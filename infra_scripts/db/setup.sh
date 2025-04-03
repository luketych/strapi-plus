#!/bin/bash

# Check for -y (yes to all) flag
AUTO_CONFIRM=false
if [[ "$1" == "-y" ]]; then
  AUTO_CONFIRM=true
fi

# Function to confirm a step
confirm() {
  if $AUTO_CONFIRM; then
    return 0
  fi

  read -p "$1 [y/N]: " response
  case "$response" in
    [yY][eE][sS]|[yY]) return 0 ;;
    *) echo "❌ Aborted." && exit 1 ;;
  esac
}

# Get DB config from the Node script
CONFIG_JSON=$(node ./infra_scripts/db/get_db_config.js)

DB_NAME=$(echo "$CONFIG_JSON" | jq -r '.database')
NEW_USER=$(echo "$CONFIG_JSON" | jq -r '.user')
NEW_PASSWORD=$(echo "$CONFIG_JSON" | jq -r '.password')
SUPERUSER="luketych"

echo "📦 Starting setup using superuser '${SUPERUSER}'..."
echo "    ➤ Will create user '${NEW_USER}' and database '${DB_NAME}'"

confirm "Step 1: Create user '${NEW_USER}' if it doesn't exist?"

# Step 1: Create the user (if not exists)
psql -U "$SUPERUSER" -d postgres -c "DO \$\$
BEGIN
   IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = '$NEW_USER') THEN
      CREATE ROLE $NEW_USER WITH LOGIN PASSWORD '$NEW_PASSWORD';
   END IF;
END
\$\$;"

confirm "Step 2: Create database '${DB_NAME}' owned by '${NEW_USER}'?"

# Step 2: Create the database owned by that user
psql -U "$SUPERUSER" -d postgres -c "CREATE DATABASE $DB_NAME OWNER $NEW_USER;"

# Final check
if [ $? -eq 0 ]; then
  echo "✅ User '$NEW_USER' and database '$DB_NAME' created successfully."
else
  echo "❌ Failed to create user or database. Check for permission or config issues."
  exit 1
fi