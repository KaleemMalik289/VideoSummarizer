import os
from dotenv import load_dotenv

# Explicitly load .env from the backend directory
env_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), ".env")
load_dotenv(env_path)

class Settings:
    PROJECT_NAME: str = "Video Summarizer API"
    PROJECT_VERSION: str = "1.0.0"
    
    # AI Keys
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY") # If using remote Whisper later
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY")
    
    # Paths
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    TEMP_DIR = os.path.join(BASE_DIR, "temp")
    MODELS_DIR = os.path.join(BASE_DIR, "models")
    
    # AI Settings
    WHISPER_MODEL_TYPE: str = "base"

    # API Prefix
    API_V1_STR: str = "/api/v1"

settings = Settings()
