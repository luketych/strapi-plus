# Development Container Configuration

This directory contains configuration for using Visual Studio Code with Development Containers. This setup provides a consistent development environment for all team members.

## Files

- `devcontainer.json`: The main configuration file for VS Code Dev Containers
  - Configures editor settings and recommended extensions
  - Sets up port forwarding for Strapi (1337) and PostgreSQL (5432)
  - Configures Node.js and Git using features
  - Runs npm install after container creation

- `docker-compose.yml`: Development-specific Docker Compose configuration
  - Extends the main docker-compose.yml
  - Adds volume for node_modules persistence
  - Sets development-specific environment variables
  - Overrides command to keep container running for VS Code

## Usage

1. Install the "Remote - Containers" extension in VS Code
2. Open this project in VS Code
3. When prompted, click "Reopen in Container"
   - Or use Command Palette: "Remote-Containers: Reopen in Container"

## Development Workflow

1. VS Code will build and start the development container
2. Node modules will be installed automatically
3. Use VS Code's integrated terminal to run commands
4. Start Strapi with `npm run develop`

All files are synced between your local machine and the container, with node_modules managed in a Docker volume for better performance.
