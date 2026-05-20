@echo off
title AgroVision Suite Launcher
cls
echo =======================================================================
echo                 AgroVision Decoupled Suite Launcher
echo =======================================================================
echo.
echo This script will launch the 3 required services in separate windows:
echo   1. Python AI Engine (port 8000)
echo   2. Laravel Backend API (port 8001)
echo   3. Next.js Frontend App (port 3000)
echo.
echo Press any key to start all services...
pause > nul
echo.

:: 1. Start Python AI API
echo [1/3] Starting Python FastAPI AI Engine on port 8000...
start "AgroVision AI Engine" cmd /k "cd backend\ai_engine && echo Starting AI Engine... && uvicorn main:app --host 127.0.0.1 --port 8000"
timeout /t 2 > nul

:: 2. Start Laravel API
echo [2/3] Starting Laravel API Backend on port 8001...
start "AgroVision Laravel Backend" cmd /k "cd backend && echo Starting Laravel API... && php artisan serve --port=8001"
timeout /t 2 > nul

:: 3. Start Next.js Frontend
echo [3/3] Starting Next.js Web App on port 3000...
start "AgroVision Next.js Frontend" cmd /k "cd frontend && echo Starting Frontend... && npm run dev"
timeout /t 2 > nul

echo.
echo =======================================================================
echo All services have been launched!
echo.
echo   - Web Frontend:  http://localhost:3000
echo   - Backend API:   http://localhost:8001
echo   - AI API Docs:   http://127.0.0.1:8000/docs
echo =======================================================================
echo.
echo Keep this window open or press any key to exit this launcher launcher.
pause > nul
