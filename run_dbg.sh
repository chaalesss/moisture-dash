#!/usr/bin/env bash

if [ ! -d 'venv' ]; then
    echo 'Venv does not exist. Creating venv...'
    python3 -m venv venv
fi

source venv/bin/activate

echo 'Installing requirements'
pip install --update pip
pip install -r requirements_dbg.txt
export DEBUG=true

# create db file if it doesnt exist then run python script to create tables
if [ ! -d 'db' ]; then
    echo 'DB doesn't' exist. Creating DB...'
    mkdir db
    touch db/accounts.db
    python3 backend/create_tables.py
fi

echo 'Starting Flask server...'
export FLASK_APP=backend/dashboard_main.py
export FLASK_DEBUG=1

# Change host IP and port here (Default: host='127.0.0.1', port='5000')
export FLASK_RUN_HOST=127.0.0.1
export FLASK_RUN_PORT=5000
flask run

echo "Flask stopped. Press enter to close."
read