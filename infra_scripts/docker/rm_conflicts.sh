#!/bin/bash

set -e


# Names used in docker-compose
CONTAINER_NAMES=("strapi" "strapiDB")
NETWORK_NAME="strapi"


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