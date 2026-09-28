# PLF Research Intelligence - Backend Startup Script
Write-Host "=================================================" -ForegroundColor Cyan
Write-Host "  Starting PLF Research Intelligence Backend...  " -ForegroundColor Green
Write-Host "=================================================" -ForegroundColor Cyan

$VenvPython = Join-Path $PSScriptRoot "venv\Scripts\python.exe"
if (-not (Test-Path $VenvPython)) {
    Write-Host "Virtual environment not found at $VenvPython. Falling back to system python..." -ForegroundColor Yellow
    $VenvPython = "python"
}

$BackendDir = Join-Path $PSScriptRoot "backend"
Set-Location $BackendDir

Write-Host "FastAPI listening on http://127.0.0.1:8000" -ForegroundColor Green
Write-Host "Interactive Swagger Docs: http://127.0.0.1:8000/docs" -ForegroundColor Yellow

& $VenvPython -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
