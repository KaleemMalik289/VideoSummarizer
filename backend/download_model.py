from os import getenv
import whisper
import os

# Define the models directory same as in config.py
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODELS_DIR = os.path.join(BASE_DIR, "models")
MODEL_TYPE = "base"

def download_model():
    print(f"Pre-downloading Whisper model '{MODEL_TYPE}' to {MODELS_DIR}...")
    
    # Ensure directory exists
    os.makedirs(MODELS_DIR, exist_ok=True)
    
    # This function call downloads the model if not present
    whisper.load_model(MODEL_TYPE, download_root=MODELS_DIR)
    
    print("Whisper model downloaded successfully.")

if __name__ == "__main__":
    download_model()
