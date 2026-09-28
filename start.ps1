# PLF Research Intelligence - Master Startup Script
Write-Host "==================================================================" -ForegroundColor Green
Write-Host "         PLF RESEARCH INTELLIGENCE PLATFORM LAUNCHER              " -ForegroundColor Cyan
Write-Host "   A Living Knowledge Base for Precision Livestock Farming        " -ForegroundColor White
Write-Host "==================================================================" -ForegroundColor Green

$BackendScript = Join-Path $PSScriptRoot "start-backend.ps1"
$FrontendScript = Join-Path $PSScriptRoot "start-frontend.ps1"

Write-Host "[1/2] Launching Backend Server on port 8000..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-ExecutionPolicy", "Bypass", "-File", "`"$BackendScript`""

Start-Sleep -Seconds 2

Write-Host "[2/2] Launching Frontend Dev Server on port 3005..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-ExecutionPolicy", "Bypass", "-File", "`"$FrontendScript`""

Write-Host ""
Write-Host "==================================================================" -ForegroundColor Green
Write-Host "Both servers launched in background windows!" -ForegroundColor Green
Write-Host "  - Frontend: http://localhost:3005" -ForegroundColor Cyan
Write-Host "  - Backend API: http://localhost:8000" -ForegroundColor Cyan
Write-Host "  - Swagger Docs: http://localhost:8000/docs" -ForegroundColor Cyan
Write-Host "==================================================================" -ForegroundColor Green
