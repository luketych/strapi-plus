# Milestones

## 2025-04-04 14:05
- ✅ Updated logging in upload plugin extension
  - Replaced all console.log calls with strapi.log.info
  - Standardized logging to use Winston configuration
  - Improved log consistency across all message types

## 2025-04-04 14:07
- ✅ Implemented alternative logging approach
  - Added command to capture all Strapi output: `npm run strapi:dev 2>&1 | tee logs/strapi-all.log`
  - This captures both stdout and stderr to a single log file
  - Allows real-time viewing in terminal while also saving to file
