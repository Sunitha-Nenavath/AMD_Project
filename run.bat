@echo off
title AI Food Health Assistant - Local Server
echo ==========================================================
echo       AI Smart Food Health Assistant - Local Server
echo ==========================================================
echo.

:: Automatically install Node Modules if they are secretly missing
IF NOT EXIST "node_modules\" (
    echo [INFO] First-time setup detected. Installing Node.js dependencies...
    npm install
    echo.
)

echo [INFO] Starting the Node.js Express server connected to Gemini...
echo [INFO] Keep this window open to keep the server alive!
echo [INFO] The Web App is running. Go to: http://127.0.0.1:8080
echo.

npm start

pause
