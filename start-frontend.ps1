# PLF Research Intelligence - Frontend Startup Script
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "  Starting PLF Research Intelligence Frontend...  " -ForegroundColor Green
Write-Host "==================================================" -ForegroundColor Cyan

$FrontendDir = Join-Path $PSScriptRoot "frontend"
Set-Location $FrontendDir

Write-Host "Next.js listening on http://localhost:3005" -ForegroundColor Green

npm start
