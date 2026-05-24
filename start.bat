@REM set "params=%*"
@REM cd /d "%~dp0" && ( if exist "%temp%\getadmin.vbs" del "%temp%\getadmin.vbs" ) && fsutil dirty query %systemdrive% 1>nul 2>nul || (  echo Set UAC = CreateObject^("Shell.Application"^) : UAC.ShellExecute "cmd.exe", "/k cd ""%~sdp0"" && %~s0 %params%", "", "runas", 1 >> "%temp%\getadmin.vbs" && "%temp%\getadmin.vbs" && exit /B )
@REM TASKLIST /fi "imagename eq mongod.exe" GOTO app

@REM START /B mongod

@REM :app

@REM pm2 start server.js --name hms

@REM start chrome http://192.168.0.10:8003/

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
:: MongoDB
:: -------------------------------------------------
tasklist /FI "IMAGENAME eq mongod.exe" 2>NUL | find /I "mongod.exe" >NUL

if %errorLevel% neq 0 (

    echo Starting MongoDB...

    :: CHANGE THIS TO YOUR REAL DB PATH
    set MONGO_DBPATH=C:\data\db

    start "MongoDB" cmd /k ^
    ""C:\Program Files\MongoDB\Server\8.0\bin\mongod.exe" --dbpath "!MONGO_DBPATH!""

) else (
    echo MongoDB already running.
)

:: -------------------------------------------------
:: Wait a bit
:: -------------------------------------------------
timeout /t 3 /nobreak >nul

:: -------------------------------------------------
:: PM2
:: -------------------------------------------------
where pm2 >nul 2>&1

if %errorLevel% neq 0 (
    echo PM2 not found in PATH.
    pause
    exit /b
)

pm2 describe hms >nul 2>&1

if %errorLevel% equ 0 (
    echo Restarting HMS...
    pm2 restart hms
) else (
    echo Starting HMS...
    pm2 start server.js --name hms
)

:: -------------------------------------------------
:: Open Browser
:: -------------------------------------------------
timeout /t 2 /nobreak >nul

start "" chrome "http://192.168.0.10:8003/"

echo =====================================
echo All services started successfully.
echo =====================================

pause