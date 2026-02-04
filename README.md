# Video Summarizer MVP

This repository contains the source code for the Video Summarizer application.

## Project Structure

- **frontend/**: React.js application (Vite + Tailwind CSS).
- **backend/**:  Python/Node.js backend.

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

## Access the Application
- **Frontend UI**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:8000](http://localhost:8000)
- **API Documentation**: [http://localhost:8000/docs](http://localhost:8000/docs)
