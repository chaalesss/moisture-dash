#!/usr/bin/env bash
set -e

if [ ! -d 'venv' ]; then
    echo 'Venv does not exist. Creating venv...'
    python3 -m venv venv
fi

source venv/bin/activate

echo 'Installing requirements...'
pip install --upgrade pip
pip install -r requirements_dbg.txt
deactivate

echo 'Checking MariaDB...'

if ! command -v mysql >/dev/null 2>&1 && ! command -v mariadb >/dev/null 2>&1; then
    echo "MariaDB not found. Installing..."

    # for macos users
    if [[ "$OSTYPE" == "darwin"* ]]; then
        if ! command -v brew >/dev/null 2>&1; then
            echo "Homebrew not installed. Install it first."
            exit 1
        fi
        brew install pkg-config mariadb
        brew services start mariadb
    fi

    # for debian/ubuntu users
    if [[ -f /etc/debian_version ]]; then
        sudo apt update
        sudo apt-get install build-essential python-smbus python-pip
        sudo apt install pkg-config python3-dev default-libmysqlclient-dev
        sudo apt install -y mariadb-server
        sudo service mysql start
    fi
else
    echo "MariaDB already installed."
fi

echo 'Waiting for MariaDB...'

until mysqladmin ping --silent; do
    sleep 1
done

if [[ "$OSTYPE" == "darwin"* ]]; then
    if [ -e 'backend/setup.sql' ]; then
        echo 'Setting up Database...'
        mysql < backend/setup.sql

    fi
else
    if [ -e 'backend/setup.sql' ]; then
        echo 'Setting up Database...'
        sudo mysql < backend/setup.sql

    fi
fi

source venv/bin/activate
export DEBUG=true

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