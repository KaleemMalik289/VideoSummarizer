import os
import yt_dlp
import moviepy.editor as mp
from ..config import settings
from ..utils.file_manager import FileManager

class AudioService:
    @staticmethod
    def extract_audio_from_file(video_path: str) -> str:
        """
        Extracts audio from a video file and saves it as MP3.
        Returns the path to the temporary MP3 file.
        """
        try:
            # Generate temp path for audio
            audio_path = FileManager.get_temp_file_path(".mp3")
            
            # Load video and extract audio
            print(f"Extracting audio from {video_path}...")
            video = mp.VideoFileClip(video_path)
            video.audio.write_audiofile(audio_path, verbose=False, logger=None)
            video.close()
            
            return audio_path
        except Exception as e:
            raise Exception(f"Audio extraction failed: {str(e)}")

    @staticmethod
    def download_audio_from_youtube(url: str) -> str:
        """
        Downloads audio from a YouTube URL using yt-dlp.
        Returns the path to the temporary MP3 file.
        """
        try:
            # Generate temp path logic (yt-dlp adds extension automatically)
            temp_base_path = FileManager.get_temp_file_path("") # No extension yet
            
            ydl_opts = {
                'format': 'bestaudio/best',
                'postprocessors': [{
                    'key': 'FFmpegExtractAudio',
                    'preferredcodec': 'mp3',
                    'preferredquality': '192',
                }],
                'outtmpl': temp_base_path, # yt-dlp will append .mp3
                'quiet': True,
                'no_warnings': True,
            }

            print(f"Downloading audio from {url}...")
            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                ydl.download([url])
            
            # The actual file created by yt-dlp
            final_path = temp_base_path + ".mp3"
            
            if not os.path.exists(final_path):
                raise Exception("Downloaded file not found.")

            return final_path
        except Exception as e:
            raise Exception(f"YouTube download failed: {str(e)}")
