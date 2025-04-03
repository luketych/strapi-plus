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
TARGET_USER=$(echo "$CONFIG_JSON" | jq -r '.user')
SUPERUSER="luketych"

echo "🧨 Full teardown: Dropping DB '${DB_NAME}' and user '${TARGET_USER}' using superuser '${SUPERUSER}'..."

confirm "Step 1: Reassign objects owned by '${TARGET_USER}' to '${SUPERUSER}'?"

# Step 1: Reassign objects
psql -U "$SUPERUSER" -d "$DB_NAME" -c "REASSIGN OWNED BY $TARGET_USER TO $SUPERUSER;" 2>/dev/null

confirm "Step 2: Drop all objects owned by '${TARGET_USER}' in database '${DB_NAME}'?"

# Step 2: Drop objects owned by the user
psql -U "$SUPERUSER" -d "$DB_NAME" -c "DROP OWNED BY $TARGET_USER;" 2>/dev/null

confirm "Step 3: Drop database '${DB_NAME}'?"

# Step 3: Drop the database
psql -U "$SUPERUSER" -d postgres -c "DROP DATABASE IF EXISTS $DB_NAME;"

confirm "Step 4: Drop user '${TARGET_USER}'?"

# Step 4: Drop the user
psql -U "$SUPERUSER" -d postgres -c "DROP USER IF EXISTS $TARGET_USER;"

# Final check
if [ $? -eq 0 ]; then
  echo "✅ Teardown complete: database and user '${TARGET_USER}' removed."
else
  echo "❌ Teardown failed. Check previous output for errors."
  exit 1
fi