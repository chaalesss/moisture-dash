@echo off
cd /d %~dp0

REM Create venv if missing
IF NOT EXIST venv (
    python -m venv venv
)

call venv\Scripts\activate.bat

echo Installing requirements...
pip install --upgrade pip
pip install -r requirements.txt

IF NOT EXIST db (
    echo database does not exist. Creating database...
    mkdir db
    type nul > db\accounts.db
    python backend\create_tables.py
)

echo Starting Flask server...
set FLASK_APP=backend/dashboard_main.py
set FLASK_DEBUG=1

REM Change host IP and port here (Default: host='127.0.0.1', port='5000')
set FLASK_RUN_HOST=127.0.0.1
set FLASK_RUN_PORT=5000
flask run
pause

echo.
echo Flask server has stopped.
pause