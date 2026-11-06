@echo off
title Mira's Beauty Touch Platform Launcher
echo ========================================================
echo Launching Mira's Beauty Touch (PHP Backend + React App)
echo ========================================================
cd /d "%~dp0"

start "Mira PHP Backend" cmd /k "start-php-backend.bat"

echo Waiting for PHP backend to initialize...
timeout /t 2 /nobreak >nul

echo Starting Frontend client...
cd client
npm run dev

