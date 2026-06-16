#!/usr/bin/env bash
set -e

if [ ! -d 'venv' ]; then
    echo 'Venv does not exist. Creating venv...'
    python3 -m venv venv
fi

source venv/bin/activate

echo 'Installing requirements...'
pip install --upgrade pip
pip install -r requirements.txt

echo 'Checking MariaDB...'

if ! command -v mysql >/dev/null 2>&1; then
    echo "MariaDB not found. Installing..."

    # for debian/ubuntu users
    if [[ -f /etc/debian_version ]]; then
        sudo apt update
        sudo apt install -y mariadb-server
        sudo service mysql start
    fi

    #
    if command -v dnf >/dev/null 2>&1; then
        sudo dnf install -y mariadb-server
        sudo systemctl start mariadb
    fi
else
    echo "MariaDB already installed."
fi

echo 'Waiting for MariaDB'
until mysqladmin ping -u root --silent; do
    sleep 1
done

echo 'Setting up Database...'

mysql -u root < setup.sql

echo "Creating database tables..."
python3 backend/create_tables.py

echo 'Starting Flask server...'

export FLASK_APP=backend/dashboard_main.py
export FLASK_DEBUG=1

# Change host IP and port here
export FLASK_RUN_HOST=0.0.0.0
export FLASK_RUN_PORT=5000

flask run

echo "Flask stopped. Press enter to close."
read