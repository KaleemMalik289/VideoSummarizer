import os
import shutil
import whisper
from groq import Groq
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
        Generates a summary using Groq (Llama3).
        """
        try:
            if not settings.GROQ_API_KEY:
                raise Exception("GROQ_API_KEY is missing in environment variables.")

            # llama3-70b-8192 is decommissioned. Using Llama 3.3 70B Versatile.
            model = "llama-3.3-70b-versatile"

            # The "Golden" System Instruction
            system_instruction = (
                "You are an expert Technical Video Analyst. Task: Analyze the provided transcript and generate a structured summary. "
                "Output Rules: "
                "1. Output strictly as a list of bullet points. "
                "2. Each point must start with a bold concept title (e.g., **Concept:**). "
                "3. Include specific numbers, tools, or technical terms mentioned. "
                "4. Ignore conversational filler. "
                "5. Keep it between 5 to 7 key points."
            )

            prompt = f"{system_instruction}\n\nTranscript:\n{transcript_text}"
            
            completion = client.chat.completions.create(
                model=model,
                messages=[
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_tokens=1024,
                top_p=1,
                stop=None,
                stream=False
            )

            return completion.choices[0].message.content

        except Exception as e:
             # Simple error handling for Groq
            print(f"Groq API Error: {str(e)}")
            raise Exception(f"Summarization failed: {str(e)}")
