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
    call venv\Scripts\activate.bat
    echo Menginstal requirements AI (FastAPI)...
    pip install -r requirements.txt
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

REM Menjalankan Express
start /B "" npm run dev

REM Menjalankan FastAPI 
cd ai
call venv\Scripts\activate.bat
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
