# Discord Music Bot PowerShell Startup Script
$Host.UI.RawUI.WindowTitle = "Discord Music Bot"

Write-Host "Starting Discord Music Bot..." -ForegroundColor Green
Write-Host ""

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "Node.js version: $nodeVersion" -ForegroundColor Blue
} catch {
    Write-Host "ERROR: Node.js is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org/" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

# Check if .env file exists
if (-not (Test-Path ".env")) {
    Write-Host "WARNING: .env file not found!" -ForegroundColor Yellow
    Write-Host "Please copy .env.example to .env and configure your bot token" -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Press Enter to continue anyway"
}

# Install dependencies if node_modules doesn't exist
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    npm install
    Write-Host ""
}

# Start the bot
Write-Host "Starting the music bot..." -ForegroundColor Green
Write-Host "Press Ctrl+C to stop the bot" -ForegroundColor Cyan
Write-Host ""

try {
    npm start
} catch {
    Write-Host "Failed to start the bot. Please check your configuration." -ForegroundColor Red
}

Read-Host "Press Enter to exit"
