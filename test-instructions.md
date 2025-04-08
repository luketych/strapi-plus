# Testing Strapi Authentication Flow

## Setup

1. Install dependencies:
```bash
npm install
```

2. Make sure Strapi server is running:
```bash
npm run develop
```

## Running Tests

1. Open Cypress Test Runner:
```bash
npm run test:e2e:open
```

2. Run tests headlessly:
```bash
npm run test:e2e
```

3. Run tests with server start/stop (CI mode):
```bash
npm run test:e2e:ci
```

## Test Coverage

The test suite (`cypress/e2e/auth-flow.cy.ts`) verifies:

1. Public Route Access
   - Root path access (/)
   - Server health check

2. Authentication Scenarios
   - Invalid token handling
   - Expired token handling
   - Missing token handling
   - Complete auth flow (login & protected route access)

3. Server Stability
   - Multiple sequential requests
   - Server restart handling
   - Error response consistency

## Expected Results

1. All tests should pass without server crashes
2. Server should respond appropriately to:
   - Invalid tokens (401)
   - Missing tokens (401)
   - Expired tokens (401)
   - Valid tokens (200)

3. No infinite loops or hanging requests

## Debugging

If tests fail, check:

1. Server logs for any crashes or errors
2. Cypress test runner output
3. Network requests in Cypress dev tools
4. Response status codes and bodies

## Common Issues

1. Server Crashes:
   - Check auth-logger.js middleware error handling
   - Verify error responses include proper status codes
   - Ensure middleware chain continues for public routes

2. Hanging Tests:
   - Check for proper next() calls in middleware
   - Verify request timeouts are set
   - Check for proper error handling in tests

3. Authentication Issues:
   - Verify token format and validation
   - Check user creation in beforeEach hook
   - Ensure proper cleanup between tests
