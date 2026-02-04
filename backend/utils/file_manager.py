import os
import shutil
import uuid
from fastapi import UploadFile
from ..config import settings

class FileManager:
    @staticmethod
    def get_temp_file_path(extension: str) -> str:
        """Generate a unique temporary file path."""
        if not os.path.exists(settings.TEMP_DIR):
            os.makedirs(settings.TEMP_DIR)
        
        unique_id = str(uuid.uuid4())
        return os.path.join(settings.TEMP_DIR, f"{unique_id}{extension}")

    @staticmethod
    async def save_upload_file(upload_file: UploadFile) -> str:
        """Save an uploaded file to the temp directory."""
        file_extension = os.path.splitext(upload_file.filename)[1]
        temp_path = FileManager.get_temp_file_path(file_extension)
        
        with open(temp_path, "wb") as buffer:
            shutil.copyfileobj(upload_file.file, buffer)
            
        return temp_path

    @staticmethod
    def delete_file(file_path: str):
        """Safely delete a file."""
        try:
            if os.path.exists(file_path):
                os.remove(file_path)
        except Exception as e:
            print(f"Error deleting file {file_path}: {e}")

    @staticmethod
    def clean_temp_dir():
        """Clean up the entire temp directory (useful for maintenance)."""
        try:
            if os.path.exists(settings.TEMP_DIR):
                shutil.rmtree(settings.TEMP_DIR)
                os.makedirs(settings.TEMP_DIR)
        except Exception as e:
            print(f"Error cleaning temp dir: {e}")
