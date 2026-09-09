@echo off
cd /d "%~dp0"

echo.
echo  Gloria Times — Next.js dev server starting...
echo  New window: npm run dev  ^|  Browser: http://localhost:3000
echo.

start "Gloria Times - npm run dev" cmd /k "npm run dev"
timeout /t 8 /nobreak >nul
start http://localhost:3000
