import os
import shutil
from typing import Optional
from fastapi import FastAPI, UploadFile, File, Form, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

# Import internal modules (Ensure paths work)
try:
    from backend.config import settings
    from backend.services.audio_service import AudioService
    from backend.services.ai_service import AIService
    from backend.utils.file_manager import FileManager
except ImportError:
    # Fallback if running directly from backend dir
    from config import settings
    from services.audio_service import AudioService
    from services.ai_service import AIService
    from utils.file_manager import FileManager

# Configure FFmpeg path (Ensure local ffmpeg.exe is found for local dev)
# For Docker, apt-get install ffmpeg handles this, but this line is safe
os.environ["PATH"] += os.pathsep + os.path.dirname(os.path.abspath(__file__))

# Initialize App
app = FastAPI(title=settings.PROJECT_NAME, version=settings.PROJECT_VERSION)

# CORS Setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow all for simplicity in this setup
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": settings.PROJECT_NAME}

@app.post("/summarize")
async def summarize_video(
    background_tasks: BackgroundTasks,
    file: Optional[UploadFile] = File(None),
    youtube_url: Optional[str] = Form(None)
):
    """
    Main endpoint to summarize video.
    """
    temp_files = [] # Track files to delete
    
    try:
        if not file and not youtube_url:
            raise HTTPException(status_code=400, detail="Please provide either a file or a YouTube URL.")

        audio_path = None
        source_title = "Uploaded Video"

        # 1. Input Processing
        if youtube_url:
            source_title = f"YouTube Video ({youtube_url})"
            audio_path = AudioService.download_audio_from_youtube(youtube_url)
            temp_files.append(audio_path)
        
        elif file:
            source_title = file.filename
            # Save uploaded video/audio temp
            video_path = await FileManager.save_upload_file(file)
            temp_files.append(video_path)
            
            # Extract audio from it
            audio_path = AudioService.extract_audio_from_file(video_path)
            temp_files.append(audio_path)

        if not audio_path or not os.path.exists(audio_path):
             raise HTTPException(status_code=500, detail="Failed to process audio input.")

        # 2. Transcription (Whisper)
        transcript = AIService.transcribe_audio(audio_path)
        
        # 3. Summarization (Gemini/Groq/HF)
        summary = AIService.generate_summary(transcript)

        return {
            "status": "success",
            "title": source_title,
            "summary": summary,
            "transcript_snippet": transcript[:500] + "..." if len(transcript) > 500 else transcript
        }

    except Exception as e:
        print(f"Error processing request: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
        
    finally:
        # 4. Cleanup
        for path in temp_files:
            try:
                if os.path.exists(path):
                    os.remove(path)
            except Exception:
                pass

# --- Serve Frontend Static Files (Deployment) ---
# This comes LAST so API routes take precedence
frontend_dist = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "frontend", "dist")

if os.path.exists(frontend_dist):
    # Mount assets folder
    app.mount("/assets", StaticFiles(directory=os.path.join(frontend_dist, "assets")), name="assets")
    
    # Catch-all route for React Router
    @app.get("/{full_path:path}")
    async def serve_react_app(full_path: str):
        # Allow API routes to pass through (double check just in case)
        if full_path.startswith("health") or full_path.startswith("summarize") or full_path.startswith("docs") or full_path.startswith("openapi"):
             raise HTTPException(status_code=404) # Should have been caught by API routes
            
        file_path = os.path.join(frontend_dist, full_path)
        if os.path.exists(file_path) and os.path.isfile(file_path):
            return FileResponse(file_path)
            
        # Fallback to index.html
        return FileResponse(os.path.join(frontend_dist, "index.html"))
