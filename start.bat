@echo off
title Discord Music Bot
echo Starting Discord Music Bot...
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Check if .env file exists
if not exist ".env" (
    echo WARNING: .env file not found!
    echo Please copy .env.example to .env and configure your bot token
    echo.
    pause
)

REM Install dependencies if node_modules doesn't exist
if not exist "node_modules" (
    echo Installing dependencies...
    npm install
    echo.
)

REM Start the bot
echo Starting the music bot...
echo Press Ctrl+C to stop the bot
echo.
npm start

pause
