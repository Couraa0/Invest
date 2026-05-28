@echo off
echo ============================================
echo  InvestAI — FastAPI Stock Prediction Server
echo ============================================
echo.

REM Pergi ke direktori backend/ai
cd /d "%~dp0"

REM Install dependencies jika belum
echo [1/2] Memeriksa dependencies...
pip install -r requirements.txt --quiet
if errorlevel 1 (
    echo ERROR: Gagal install dependencies!
    pause
    exit /b 1
)

echo [2/2] Menjalankan FastAPI server...
echo.
echo  API akan berjalan di: http://localhost:8000
echo  Dokumentasi API    : http://localhost:8000/docs
echo  Tekan Ctrl+C untuk menghentikan
echo.

uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

pause
