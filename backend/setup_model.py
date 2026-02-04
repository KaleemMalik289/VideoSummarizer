import os
import whisper
from config import settings

def setup_whisper():
    """Download the Whisper model to the local models directory."""
    print(f"Downloading Whisper model '{settings.WHISPER_MODEL_TYPE}' to {settings.MODELS_DIR}...")
    
    if not os.path.exists(settings.MODELS_DIR):
        os.makedirs(settings.MODELS_DIR)
        
    # This triggers the download
    whisper.load_model(settings.WHISPER_MODEL_TYPE, download_root=settings.MODELS_DIR)
    
    print("Model downloaded successfully!")

if __name__ == "__main__":
    setup_whisper()
