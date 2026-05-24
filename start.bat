@REM set "params=%*"
@REM cd /d "%~dp0" && ( if exist "%temp%\getadmin.vbs" del "%temp%\getadmin.vbs" ) && fsutil dirty query %systemdrive% 1>nul 2>nul || (  echo Set UAC = CreateObject^("Shell.Application"^) : UAC.ShellExecute "cmd.exe", "/k cd ""%~sdp0"" && %~s0 %params%", "", "runas", 1 >> "%temp%\getadmin.vbs" && "%temp%\getadmin.vbs" && exit /B )
@REM TASKLIST /fi "imagename eq mongod.exe" GOTO app

@REM START /B mongod

@REM :app

@REM pm2 start server.js --name hms

@REM start chrome http://192.168.0.10:8003/

@echo off
setlocal

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

echo Starting services...

:: -------------------------------------------------
:: Check if MongoDB is already running
:: -------------------------------------------------
tasklist /FI "IMAGENAME eq mongod.exe" 2>NUL | find /I "mongod.exe" >NUL

if %errorLevel% neq 0 (
    echo MongoDB not running. Starting MongoDB...
    
    :: Update this path if needed
    start "" /B "C:\Program Files\MongoDB\Server\8.0\bin\mongod.exe"
) else (
    echo MongoDB already running.
)

:: -------------------------------------------------
:: Start PM2 app safely
:: -------------------------------------------------
pm2 describe hms >nul 2>&1

if %errorLevel% neq 0 (
    echo Starting HMS server...
    pm2 start server.js --name hms
) else (
    echo HMS already running. Restarting...
    pm2 restart hms
)

:: -------------------------------------------------
:: Small delay for boot
:: -------------------------------------------------
timeout /t 3 /nobreak >nul

:: -------------------------------------------------
:: Launch browser
:: -------------------------------------------------
start "" chrome "http://192.168.0.10:8003/"

echo Done.
exit /b