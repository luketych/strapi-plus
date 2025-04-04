#!/bin/bash
# infra_scripts/pink-box/setup_psql.sh
# This script checks if the PostgreSQL 15 data directory exists and is empty.
# If it doesn’t exist, it will warn you, create it, and continue.
# It will then prompt you to either wipe the data directory and reinitialize the database
# or simply start the PostgreSQL service using the existing data.
#
# Note: Running this script with the wipe option will delete any existing data.
# Run as a user with sudo privileges.

DATA_DIR="/var/lib/pgsql/15/data"
PG_SETUP="/usr/pgsql-15/bin/postgresql-15-setup"
SERVICE="postgresql-15"

# Function to start PostgreSQL service
start_pg() {
    echo "Starting PostgreSQL service..."
    sudo systemctl start ${SERVICE}
    sudo systemctl status ${SERVICE} --no-pager
}

# Check if the data directory exists
if [ ! -d "$DATA_DIR" ]; then
    echo "Warning: Data directory $DATA_DIR does not exist. Creating it..."
    sudo mkdir -p "$DATA_DIR"
fi

# Check if the data directory is empty
if [ "$(ls -A "$DATA_DIR")" ]; then
    echo "Data directory is not empty."
    read -rp "Do you want to wipe the data directory and reinitialize PostgreSQL? [y/N]: " answer
    case "$answer" in
        [Yy]* )
            echo "Stopping PostgreSQL service (if running)..."
            sudo systemctl stop ${SERVICE}
            echo "Wiping data directory $DATA_DIR..."
            sudo rm -rf "${DATA_DIR:?}"/*
            echo "Initializing PostgreSQL..."
            sudo $PG_SETUP initdb
            echo "Starting PostgreSQL service..."
            start_pg
            ;;
        * )
            echo "Using existing data directory. Starting PostgreSQL..."
            start_pg
            ;;
    esac
else
    echo "Data directory is empty. Initializing PostgreSQL..."
    sudo $PG_SETUP initdb
    echo "Starting PostgreSQL service..."
    start_pg
fi

echo "Done."