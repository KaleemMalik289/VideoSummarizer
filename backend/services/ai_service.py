import os
import shutil
import whisper
from huggingface_hub import InferenceClient
import imageio_ffmpeg
from ..config import settings

class AIService:
    _whisper_model = None

    @classmethod
    def get_whisper_model(cls):
        """Singleton pattern to load the Whisper model only once."""
        if cls._whisper_model is None:
            print("Loading Whisper model (base)... This may take a moment.")
            # Load from local models directory
            cls._whisper_model = whisper.load_model(settings.WHISPER_MODEL_TYPE, download_root=settings.MODELS_DIR)
        return cls._whisper_model

    @staticmethod
    def transcribe_audio(audio_path: str) -> str:
        """
        Transcribes audio using OpenAI Whisper (Local).
        """
        try:
            # FORCE PATH UPDATE for FFmpeg
            ffmpeg_path = os.path.dirname(imageio_ffmpeg.get_ffmpeg_exe())
            if ffmpeg_path not in os.environ["PATH"]:
                print(f"Adding FFmpeg to PATH: {ffmpeg_path}")
                os.environ["PATH"] += os.pathsep + ffmpeg_path

            # DEBUG: Check if FFmpeg is found
            ffmpeg_exe = shutil.which("ffmpeg")
            print(f"DEBUG: FFmpeg found at: {ffmpeg_exe}")
            print(f"DEBUG: Audio file exists? {os.path.exists(audio_path)} ({audio_path})")

            if not ffmpeg_exe:
                 raise Exception("FFmpeg not found in PATH. Please install FFmpeg or check configuration.")

            model = AIService.get_whisper_model()
            result = model.transcribe(audio_path)
            return result["text"]
        except Exception as e:
            raise Exception(f"Transcription failed: {str(e)}")

    @staticmethod
    def generate_summary(transcript_text: str) -> str:
        """
        Generates a summary using Hugging Face Inference API.
        """
        try:
            if not settings.HF_API_KEY:
                raise Exception("HF_API_KEY is missing in environment variables.")

            # Initializing client
            client = InferenceClient(token=settings.HF_API_KEY)

            # The "Video Content Analyst" System Instruction
            system_instruction = (
                "You are an expert Video Content Analyst. Your task is to process the provided video transcript and generate a structured, professional summary.\n\n"
                "**Input Context:**\n"
                "You will receive a raw text transcript from a video. It may contain conversational filler words (e.g., \"um,\" \"uh\") or ASR errors.\n\n"
                "**Processing Instructions:**\n"
                "1. **Analyze** the transcript to understand the core message and specific technical details.\n"
                "2. **Filter** out irrelevant digressions, self-corrections, and filler words.\n"
                "3. **Synthesize** the information into two distinct sections: an Overview and Key Topics.\n\n"
                "**Output Format (Strictly Follow This Structure):**\n\n"
                "**1. Executive Overview:**\n"
                "Write a concise paragraph summarizing the video's overall purpose and conclusion.\n\n"
                "**2. Main Topics Discussed:**\n"
                "Provide a list of bullet points discused in video. Each point must follow this format:\n"
                "* **[Topic Name]:** [Detailed explanation of what was discussed regarding this topic. Include specific numbers, tools, or arguments mentioned.]\n\n"
                "**Tone:**\n"
                "Professional, objective, and concise. Avoid phrases like \"The speaker said...\"—instead, state the facts directly."
            )

            # Using standard HF Chat Completion
            # We use Meta-Llama-3-8B-Instruct as it is the best general-purpose summarizer on free HF Inference
            model_id = "meta-llama/Meta-Llama-3-8B-Instruct"

            response = client.chat.completions.create(
                model=model_id,
                messages=[
                    {"role": "system", "content": system_instruction},
                    {"role": "user", "content": f"Transcript:\n{transcript_text}"}
                ],
                max_tokens=1024,
                temperature=0.7,
                top_p=0.9
            )

            return response.choices[0].message.content

        except Exception as e:
            print(f"Hugging Face API Error: {str(e)}")
            raise Exception(f"Summarization failed: {str(e)}")
