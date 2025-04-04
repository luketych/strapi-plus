#!/bin/bash

set -e

# Usage message
usage() {
  echo "Usage: $0 [local|remote|prod]"
  exit 1
}

# Validate input
ENV="$1"
if [[ -z "$ENV" ]]; then
  echo "❌ Error: No environment specified."
  echo "Please provide an environment: local, remote, or prod."
  echo "If you are running a package.json script, use 'npm run force-up:local|remote|prod'."
  usage
fi

if [[ "$ENV" != "local" && "$ENV" != "remote" && "$ENV" != "prod" ]]; then
  echo "❌ Error: Invalid environment '$ENV'"
  usage
fi

# Base Compose files including environment-specific DB config
COMPOSE_FILES=""

case "$ENV" in
  local)
    COMPOSE_FILES="-f docker-compose.db.yml -f docker-compose.yml -f docker-compose.override.yml --profile local"
    ;;
  remote)
    COMPOSE_FILES="-f docker-compose.db.yml -f docker-compose.yml -f docker-compose.remote.yml --profile remote"
    ;;
  prod)
    COMPOSE_FILES="-f docker-compose.db.yml -f docker-compose.yml -f docker-compose.prod.yml --profile prod"
    ;;
esac

# Names used in docker-compose
CONTAINER_NAMES=("strapi" "strapiDB")
NETWORK_NAME="strapi"

echo "🔧 Force-starting Docker for '$ENV' environment..."

# Remove conflicting containers
for CONTAINER_NAME in "${CONTAINER_NAMES[@]}"; do
  CONFLICTING_ID=$(docker ps -a --filter "name=^/${CONTAINER_NAME}$" --format "{{.ID}}")
  if [[ -n "$CONFLICTING_ID" ]]; then
    echo "🗑️  Removing conflicting container: ${CONTAINER_NAME} (ID: $CONFLICTING_ID)"
    docker rm -f "$CONTAINER_NAME"
  fi
done

# Remove conflicting network
if docker network ls --format '{{.Name}}' | grep -q "^${NETWORK_NAME}$"; then
  echo "🗑️  Removing existing Docker network: ${NETWORK_NAME}"
  docker network rm "$NETWORK_NAME"
fi

echo "🚀 Running docker compose for '$ENV'..."
docker compose $COMPOSE_FILES up
