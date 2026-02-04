# Video Summarizer MVP

This repository contains the source code for the Video Summarizer application.

## Project Structure

- **frontend/**: React.js application (Vite + Tailwind CSS).
- **backend/**: (Coming Soon) Python/Node.js backend.

## Getting Started

### Frontend
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

### Backend
1.  **Setup**:
    ```bash
    cd backend
    pip install -r requirements.txt
    python setup_model.py
    ```
2.  **Run Server**:
    **Navigate back to the root directory**:
    ```bash
    cd ..
    uvicorn backend.main:app --reload
    ```
    Server running at `http://localhost:8000`.
