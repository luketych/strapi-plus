import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:1337',
    supportFile: 'cypress/support/e2e.ts',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    video: false,
    screenshotOnRunFailure: true,
    defaultCommandTimeout: 10000,
    setupNodeEvents(on, config) {
      on('task', {
        log(message: string) {
          console.log(message);
          return null;
        }
      });
    }
  },
  env: {
    API_URL: 'http://localhost:1337',
    ADMIN_JWT_SECRET: process.env.ADMIN_JWT_SECRET || 'your-secret-key'
  }
});
