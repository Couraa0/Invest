@echo off
echo Starting InvestAI Backends...

echo.
echo [1/2] Starting Express Node.js Backend...
start "Express Backend" cmd /k "npm run dev"

echo [2/2] Starting Python AI Backend (FastAPI)...
start "AI Backend" cmd /k "cd ai && call venv\Scripts\activate && uvicorn app.main:app --reload --port 8000"

echo.
echo Both backends are starting in separate windows.
echo Express API runs on port 5000.
echo FastAPI AI runs on port 8000.
pause
