@echo off
setlocal enabledelayedexpansion

echo Checking virtual environment...

if not exist venv (
    echo Venv does not exist. Creating venv...
    python -m venv venv
)

call venv\Scripts\activate

echo Installing requirements...
python -m pip install --upgrade pip
pip install -r requirements_dbg.txt
set DEBUG=true


echo Checking MariaDB...

where mysql >nul 2>nul
if errorlevel 1 (
    echo ERROR: MariaDB is not installed or not in PATH
    echo Please install MariaDB manually or add it to PATH
    pause
    exit /b 1
)

echo Waiting for MariaDB...
:wait_db
mysqladmin ping -u root --silent
if errorlevel 1 (
    timeout /t 1 >nul
    goto wait_db
)


echo Setting up database...
mysql -u root < setup.sql


echo Creating database tables...
python backend\create_tables.py


echo Starting Flask server...

set FLASK_APP=backend/dashboard_main.py
set FLASK_DEBUG=1
set FLASK_RUN_HOST=0.0.0.0
set FLASK_RUN_PORT=5000

flask run

echo Flask stopped. Press any key to exit...
pause