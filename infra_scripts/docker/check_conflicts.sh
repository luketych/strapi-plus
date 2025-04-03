#!/bin/bash

# Names used in docker-compose.yml
CONTAINER_NAMES=("strapi" "strapiDB")
NETWORK_NAME="strapi"

echo "🔍 Checking for Docker container and network conflicts..."

HAS_CONFLICT=0

# Check containers
for CONTAINER_NAME in "${CONTAINER_NAMES[@]}"; do
  CONFLICTING_ID=$(docker ps -a --filter "name=^/${CONTAINER_NAME}$" --format "{{.ID}}")
  if [[ -n "$CONFLICTING_ID" ]]; then
    echo "❗ Conflict: Container named '${CONTAINER_NAME}' already exists (ID: $CONFLICTING_ID)."
    echo "👉 To remove it, run:"
    echo "   docker rm -f ${CONTAINER_NAME}"
    echo
    HAS_CONFLICT=1
  fi
done

# Check network
if docker network ls --format '{{.Name}}' | grep -q "^${NETWORK_NAME}$"; then
  echo "⚠️  Warning: Docker network '${NETWORK_NAME}' already exists."
  echo "👉 If it's meant to be reused, add this to your docker-compose.yml:"
  echo
  echo "   networks:"
  echo "     ${NETWORK_NAME}:"
  echo "       external: true"
  echo
  echo "👉 To remove the network, run:"
  echo "   docker network rm ${NETWORK_NAME}"
  echo
  HAS_CONFLICT=1
fi

if [[ $HAS_CONFLICT -eq 1 ]]; then
  echo "🛑 Conflicts detected. Resolve them before running docker compose."
  exit 1
fi

echo "✅ No conflicts found."
exit 0