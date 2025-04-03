# DevContainer Environment Variables - Potential Fix Strategies

## Strategy 1: VSCode Local Environment Enhancement
```json
// .devcontainer/devcontainer.json
{
  "remoteEnv": {
    "DATABASE_CLIENT": "${localEnv:DATABASE_CLIENT}",
    // other vars...
  },
  "initializeCommand": "export $(cat .env | xargs)"  // Add this to export vars before container starts
}
```

**Rationale**: Ensure VSCode has access to env vars before container initialization

## Strategy 2: Docker Compose Override Pattern
```yaml
# .devcontainer/docker-compose.override.yml
include:
  - path: docker-compose.yml
    env_file: .env

services:
  strapi:
    environment:
      DATABASE_CLIENT: ${DATABASE_CLIENT}
```

**Rationale**: Use Docker Compose's native override system for devcontainer specifics

## Strategy 3: Multi-Stage Environment Loading
1. Primary .env for compose interpolation
2. Runtime .env for container environment
3. DevContainer specific overrides

```bash
#!/bin/bash
# .devcontainer/env-setup.sh
set -a
source ../.env
source .env.devcontainer
exec "$@"
```

**Rationale**: Ensure proper variable loading order and availability

## Strategy 4: Build-Time Argument Approach
```dockerfile
# .devcontainer/Dockerfile
ARG DATABASE_CLIENT
ENV DATABASE_CLIENT=${DATABASE_CLIENT}
```

Combined with compose:
```yaml
services:
  strapi:
    build:
      args:
        - DATABASE_CLIENT=${DATABASE_CLIENT}
```

**Rationale**: Explicitly pass variables through build process

## Strategy 5: Hybrid Remote/Local Environment
```json
// .devcontainer/devcontainer.json
{
  "remoteEnv": {
    "DATABASE_CLIENT": "${localEnv:DATABASE_CLIENT}"
  },
  "containerEnv": {
    "DATABASE_CLIENT": "${localEnv:DATABASE_CLIENT}"
  }
}
```

**Rationale**: Ensure variables are available in both contexts

## Implementation Priority

1. **Try Strategy 1 First**
   - Minimal changes required
   - Works with existing setup
   - Easy to test and revert

2. **Strategy 3 as Fallback**
   - More robust solution
   - Handles complex scenarios
   - Better debugging capability

3. **Strategy 2 if Above Fail**
   - More invasive changes
   - But leverages Docker native features

4. **Strategies 4 & 5 as Last Resort**
   - Require more significant changes
   - But provide most control

## Testing Approach

For each strategy:

1. Implement the changes
2. Test variable availability:
   - During container build
   - At runtime
   - In VSCode terminals
   - In container shells
3. Verify persistence across:
   - Container restarts
   - VSCode reloads
   - System reboots

## Success Criteria

1. Environment variables correctly loaded in all contexts
2. Variables persist across container/VSCode restarts
3. No manual intervention required
4. Compatible with existing docker-compose setup
5. Maintainable long-term solution

## Backup Plan

If none of the strategies work:
1. Consider restructuring how environment variables are managed
2. Look into alternative devcontainer configuration approaches
3. Evaluate using docker-compose profiles for development
