@echo off
echo ============================================
echo  InvestAI — Starting All Backends
echo ============================================
echo.

REM
cd /d "%~dp0"

echo [1/2] Memeriksa dependencies Express Node.js...
if not exist "node_modules\" (
    echo Menginstal npm packages...
    call npm install
)

echo [2/2] Memeriksa dependencies Python AI (FastAPI)...
cd ai
if not exist "venv\Scripts\activate.bat" (
    echo Membuat virtual environment...
    py -m venv venv
)
cd ..

echo.
echo ============================================
echo  Menjalankan kedua backend...
echo  Tekan Ctrl+C untuk menghentikan semuanya.
echo  Express API: http://localhost:5000
echo  FastAPI AI : http://localhost:8000
echo ============================================
echo.

REM Menjalankan Express di background terminal yang sama
start /B npm run dev

REM Menjalankan FastAPI di background terminal yang sama
cd ai
call venv\Scripts\activate && pip install -r requirements.txt --quiet && uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
