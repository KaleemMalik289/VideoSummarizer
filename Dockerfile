# Use an official Python runtime as a parent image
FROM python:3.10-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PORT=8000

# Install system dependencies (FFmpeg is CRITICAL for Whisper)
RUN apt-get update && apt-get install -y \
    ffmpeg \
    git \
    nodejs \
    npm \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# --- Frontend Build ---
# Copy frontend dependency files
COPY frontend/package*.json ./frontend/
# Install frontend dependencies
RUN cd frontend && npm install
# Copy frontend source code
COPY frontend/ ./frontend/
# Build the React app
RUN cd frontend && npm run build

# --- Backend Setup ---
# Copy backend dependency file
COPY backend/requirements.txt ./backend/
# Install backend dependencies
RUN pip install --no-cache-dir -r backend/requirements.txt

# Copy backend source code including download script
COPY backend/ ./backend/

# Create temp directories
RUN mkdir -p backend/temp backend/models

# Pre-download Whisper model to bake it into the image
RUN python backend/download_model.py

# Expose the port
EXPOSE 8000

# Start the application
# We use a custom script or direct uvicorn command
# For production, we need to serve frontend static files via FastAPI or Nginx
# Here we'll modify main.py to serve static files, but for now, let's just run the backend
CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000"]
