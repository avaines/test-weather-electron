@echo off
REM Windows batch script for scheduling degree days collection
REM Edit the variables below with your settings

REM ===== CONFIGURATION =====
set API_KEY=YOUR_API_KEY_HERE
set COORDS="0,0"
REM Latitude,Longitude

set OUTPUT_DIR=C:\Data\DegreeDays
REM =========================

REM Get the directory where this script is located
set SCRIPT_DIR=%~dp0

REM Run the app in headless mode
"%SCRIPT_DIR%Degree Days Collector.exe" --headless --apikey %API_KEY% --coords "%COORDS%" --output "%OUTPUT_DIR%"

REM Exit with the same code as the app
exit /b %ERRORLEVEL%
