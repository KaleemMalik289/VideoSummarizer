@echo off
echo Starting Video Summarizer...

:: Start Backend
start "Backend Server" cmd /k "python -m venv venv && call venv\Scripts\activate && uvicorn backend.main:app --reload"

:: Start Frontend
start "Frontend Server" cmd /k "cd frontend && npm run dev"

echo Servers starting...
echo Backend: http://localhost:8000
echo Frontend: http://localhost:5173
echo.
echo Press any key to close this launcher (servers will keep running).
pause
