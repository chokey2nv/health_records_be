@echo off
setlocal enabledelayedexpansion

echo =====================================
echo Stopping HMS Environment
echo =====================================

:: -------------------------------------------------
:: Run as Administrator
:: -------------------------------------------------
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo Requesting administrator permission...
    powershell -Command "Start-Process '%~f0' -Verb RunAs"
    exit /b
)

:: -------------------------------------------------
:: Move to current directory
:: -------------------------------------------------
cd /d "%~dp0"

:: -------------------------------------------------
:: Ensure PM2 exists
:: -------------------------------------------------
where pm2 >nul 2>&1

if %errorLevel% neq 0 (
    echo ERROR: PM2 not found in PATH.
    echo Make sure Node.js and PM2 are installed globally.
    pause
    exit /b
)

:: -------------------------------------------------
:: Stop PM2 App
:: -------------------------------------------------
echo.
echo Checking HMS process...

pm2 describe hms >nul 2>&1

if %errorLevel% equ 0 (

    echo Stopping HMS...
    call pm2 stop hms

    timeout /t 2 /nobreak >nul

    echo Deleting HMS...
    call pm2 delete hms

) else (
    echo HMS process not found.
)

:: -------------------------------------------------
:: Stop MongoDB Process
:: -------------------------------------------------
echo.
echo Checking MongoDB...

tasklist /FI "IMAGENAME eq mongod.exe" 2>NUL | find /I "mongod.exe" >NUL

if %errorLevel% equ 0 (

    echo Stopping MongoDB...
    taskkill /F /IM mongod.exe /T

    timeout /t 2 /nobreak >nul

    echo MongoDB stopped.

) else (
    echo MongoDB is not running.
)

:: -------------------------------------------------
:: Cleanup PM2 daemon (optional)
:: -------------------------------------------------
echo.
echo Stopping PM2 daemon...
call pm2 kill >nul 2>&1

echo.
echo =====================================
echo All services stopped successfully.
echo =====================================

pause