## [envToConfig] - 2025-04-03
**Goal:** Remove environment variables in favor of config vars for better compatibility with VSCode dev containers.

- Removed .env references across services
- Introduced centralized config system
- Makes working with multiple environments (dev, staging) easier inside containers
