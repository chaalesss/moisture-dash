#!/usr/bin/env bash
set -e

sudo raspi-config nonint do_spi 0

if [ ! -d 'venv' ]; then
    echo 'Venv does not exist. Creating venv...'
    python3 -m venv venv
fi

source venv/bin/activate

echo 'Checking Requirements...'
pip install --upgrade pip
pip install -r requirements.txt
deactivate

echo 'Checking MariaDB...'

if ! command -v mysql >/dev/null 2>&1 && ! command -v mariadb >/dev/null 2>&1; then
    echo "MariaDB not found. Installing..."
    sudo apt update
    sudo apt install pkg-config python3-dev default-libmysqlclient-dev build-essential
    sudo apt install -y mariadb-server
    sudo service mysql start
else
    echo "MariaDB already installed."
fi

echo 'Waiting for MariaDB...'

until mysqladmin ping --silent; do
    sleep 1
done

if [ -f 'setup.sql' ]; then
    echo 'Setting up Database...'
    sudo mysql < setup.sql
fi

source venv/bin/activate

if [ -e 'backend/create_tables.py' ]; then
    echo "Creating database tables..."
    python3 backend/create_tables.py
    
fi

echo 'Starting Flask server...'

export FLASK_APP=backend/dashboard_main.py
export FLASK_DEBUG=1


# Change host IP and port here
export FLASK_RUN_HOST=0.0.0.0
export FLASK_RUN_PORT=5001

flask run

echo "Flask stopped. Press enter to close."
read