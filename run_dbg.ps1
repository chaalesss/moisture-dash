$ErrorActionPreference = "Stop"

Write-Host "Checking Python venv..."

if (!(Test-Path "venv")) {
    Write-Host "Venv does not exist. Creating venv..."
    python -m venv venv
}

# Activate venv
. .\venv\Scripts\Activate.ps1

Write-Host "Installing requirements..."
python -m pip install --upgrade pip
pip install -r requirements_dbg.txt

Write-Host "Checking MariaDB..."

$mysqlExists = Get-Command mysql -ErrorAction SilentlyContinue
$mariadbExists = Get-Command mariadb -ErrorAction SilentlyContinue

if (-not $mysqlExists -and -not $mariadbExists) {
    Write-Host "MariaDB not found."
    winget install MariaDB.MariaDB
    exit 1
}
else {
    Write-Host "MariaDB already installed."
}

Write-Host "Waiting for MariaDB..."

while ($true) {
    try {
        mysqladmin ping | Out-Null
        break
    } catch {
        Start-Sleep -Seconds 1
    }
}

Write-Host "Checking setup.sql..."

if (Test-Path "backend/setup.sql") {
    Write-Host "Setting up database..."
    Get-Content setup.sql -Raw | mysql
    
}

Write-Host "Creating database tables..."

if (Test-Path "backend\create_tables.py") {
    python backend\create_tables.py
    
}

Write-Host "Starting Flask server..."

$env:FLASK_APP = "backend/dashboard_main.py"
$env:FLASK_DEBUG = "1"
$env:DEBUG = "true"
$env:FLASK_RUN_HOST = "0.0.0.0"
$env:FLASK_RUN_PORT = "5001"

flask run

Write-Host "Flask stopped. Press Enter to close."
Read-Host