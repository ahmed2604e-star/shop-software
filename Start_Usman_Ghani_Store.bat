@echo off
setlocal
cd /d "%~dp0"
where py >nul 2>nul
if %errorlevel%==0 (
  start "Usman Ghani Store Server" /min cmd /c "py -m http.server 8765 --bind 127.0.0.1"
) else (
  where python >nul 2>nul
  if %errorlevel%==0 (
    start "Usman Ghani Store Server" /min cmd /c "python -m http.server 8765 --bind 127.0.0.1"
  ) else (
    echo Python install nahi hai. Website ko VS Code Live Server se chalayein.
    pause
    exit /b 1
  )
)
timeout /t 2 /nobreak >nul
start "" "http://127.0.0.1:8765/usman_ghani_bartan_store_fixed2.html"
echo Website khul rahi hai. Hamesha isi address se use karein: http://127.0.0.1:8765/usman_ghani_bartan_store_fixed2.html
echo Is window ko band karne se local server band ho sakta hai.
pause
