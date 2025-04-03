# Project Milestones

## 2025-04-03 16:02
- Security: Moved AWS credentials from default.js to environment variables
- Configured AWS SDK to use environment-based configuration
- Improved security by removing hardcoded credentials from version control
- Added AWS_DEFAULT_REGION environment variable to ensure proper region configuration
- Updated docker-compose.yml to pass AWS environment variables to Strapi container
