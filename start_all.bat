@echo off
title AgroVision Suite Launcher
cls
echo =======================================================================
echo                 AgroVision Decoupled Suite Launcher
echo =======================================================================
echo.
echo Services yang akan dijalankan:
echo   [1] Python AI Engine  -  http://127.0.0.1:8000
echo   [2] Laravel Backend   -  http://localhost:8001
echo   [3] Next.js Frontend  -  http://localhost:3000
echo.
echo Tekan tombol apapun untuk memulai...
pause > nul
echo.

:: === PATH KONFIGURASI ===
set PYTHON=C:\laragon\bin\python\python-3.13\python.exe
set PHP=C:\laragon\bin\php\php-8.3.30-Win32-vs16-x64\php.exe
set PROJECT_ROOT=%~dp0

:: 1. Start Python AI Engine
echo [1/3] Menjalankan Python AI Engine (port 8000)...
start "AgroVision - AI Engine" cmd /k "cd /d "%PROJECT_ROOT%backend\ai_engine" && "%PYTHON%" -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload"
timeout /t 3 > nul

:: 2. Start Laravel Backend
echo [2/3] Menjalankan Laravel Backend API (port 8001)...
start "AgroVision - Laravel Backend" cmd /k "cd /d "%PROJECT_ROOT%backend" && "%PHP%" artisan serve --port=8001"
timeout /t 3 > nul

:: 3. Start Next.js Frontend
echo [3/3] Menjalankan Next.js Frontend (port 3000)...
start "AgroVision - Next.js Frontend" cmd /k "cd /d "%PROJECT_ROOT%frontend" && npm run dev"
timeout /t 3 > nul

echo.
echo =======================================================================
echo  Semua service telah dijalankan!
echo.
echo   Buka browser dan akses:  http://localhost:3000
echo.
echo   - Frontend  : http://localhost:3000
echo   - Backend   : http://localhost:8001
echo   - AI Docs   : http://127.0.0.1:8000/docs
echo =======================================================================
echo.
echo Tutup jendela ini atau tekan tombol apapun untuk keluar.
pause > nul
