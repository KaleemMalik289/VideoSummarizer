import google.generativeai as genai
import os
from dotenv import load_dotenv

# Load env from current dir
env_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), ".env")
load_dotenv(env_path)

api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    print("Error: GEMINI_API_KEY not found in .env")
else:
    print(f"Using API Key: {api_key[:5]}...{api_key[-5:]}")
    try:
        import google.generativeai as genai
        print(f"Library Version: {genai.__version__}")
        
        genai.configure(api_key=api_key)
        
        print("\nListing available models:")
        for m in genai.list_models():
            if 'generateContent' in m.supported_generation_methods:
                print(f"- {m.name}")
                
    except Exception as e:
        print(f"Error listing models: {e}")
