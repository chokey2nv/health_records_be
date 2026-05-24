@echo off
setlocal enabledelayedexpansion

:: -------------------------------------------------
:: Run as Administrator
:: -------------------------------------------------
net session >nul 2>&1
if %errorLevel% neq 0 (
    powershell -Command "Start-Process '%~f0' -Verb RunAs"
    exit /b
)

:: -------------------------------------------------
:: Move to script directory
:: -------------------------------------------------
cd /d "%~dp0"

echo =====================================
echo Starting HMS Environment
echo =====================================

:: -------------------------------------------------
:: MongoDB Config
:: -------------------------------------------------
set "MONGO_PATH=C:\Program Files\MongoDB\Server\8.0\bin\mongod.exe"
set "MONGO_DBPATH=C:\data\db"

:: -------------------------------------------------
:: Ensure DB Path Exists
:: -------------------------------------------------
if not exist "%MONGO_DBPATH%" (
    echo Creating MongoDB data directory...
    mkdir "%MONGO_DBPATH%"
)

:: -------------------------------------------------
:: Check MongoDB
:: -------------------------------------------------
tasklist /FI "IMAGENAME eq mongod.exe" 2>NUL | find /I "mongod.exe" >NUL

if %errorLevel% neq 0 (

    echo Starting MongoDB...

    start "MongoDB" "%MONGO_PATH%" --dbpath "%MONGO_DBPATH%"

) else (
    echo MongoDB already running.
)

:: -------------------------------------------------
:: Wait for MongoDB boot
:: -------------------------------------------------
timeout /t 5 /nobreak >nul

:: -------------------------------------------------
:: PM2
:: -------------------------------------------------
call pm2 describe hms >nul 2>&1

if %errorLevel% equ 0 (
    echo Restarting HMS...
    call pm2 restart hms
) else (
    echo Starting HMS...
    call pm2 start server.js --name hms
)

:: -------------------------------------------------
:: Open Browser
:: -------------------------------------------------
timeout /t 2 /nobreak >nul

start "" "http://192.168.0.10:8003/"

echo =====================================
echo HMS Environment Started
echo =====================================

pause