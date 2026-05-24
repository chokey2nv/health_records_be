@REM set "params=%*"
@REM cd /d "%~dp0" && ( if exist "%temp%\getadmin.vbs" del "%temp%\getadmin.vbs" ) && fsutil dirty query %systemdrive% 1>nul 2>nul || (  echo Set UAC = CreateObject^("Shell.Application"^) : UAC.ShellExecute "cmd.exe", "/k cd ""%~sdp0"" && %~s0 %params%", "", "runas", 1 >> "%temp%\getadmin.vbs" && "%temp%\getadmin.vbs" && exit /B )
@REM taskkill /F /fi "imagename eq mongod.exe"

@REM pm2 stop hms && pm2 delete hms

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

echo Stopping services...

:: -------------------------------------------------
:: Stop PM2 process safely
:: -------------------------------------------------
pm2 describe hms >nul 2>&1

if %errorLevel% equ 0 (
    echo Stopping HMS...
    pm2 stop hms
    pm2 delete hms
) else (
    echo HMS process not found.
)

:: -------------------------------------------------
:: Stop MongoDB safely
:: -------------------------------------------------
tasklist /FI "IMAGENAME eq mongod.exe" 2>NUL | find /I "mongod.exe" >NUL

if %errorLevel% equ 0 (
    echo Stopping MongoDB...
    taskkill /F /IM mongod.exe >nul 2>&1
) else (
    echo MongoDB is not running.
)

echo Done.
exit /b