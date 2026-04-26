@echo off
REM Start backend in a new window
start "Wasta Backend" cmd /k "cd /d c:\Wasta\backend && node server.js"

REM Wait a bit for backend to start
timeout /t 3 /nobreak

REM Start frontend in a new window
start "Wasta Frontend" cmd /k "cd /d c:\Wasta\frontend && node .\node_modules\vite\bin\vite.js"

echo Both servers are starting...
echo Backend will be at http://localhost:3000
echo Frontend will be at http://localhost:5173
