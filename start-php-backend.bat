@echo off
title Mira's Beauty Touch - PHP Backend Server
echo ========================================================
echo Starting Mira's Beauty Touch PHP Backend on port 5000...
echo ========================================================
cd /d "%~dp0"

if exist "C:\xampp\php\php.exe" (
    echo Using XAMPP PHP 8.3: C:\xampp\php\php.exe
    "C:\xampp\php\php.exe" -S 0.0.0.0:5000 -t php-server/public
) else (
    echo Using system PHP in PATH
    php -S 0.0.0.0:5000 -t php-server/public
)
pause

