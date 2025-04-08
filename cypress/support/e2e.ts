/// <reference types="cypress" />

// Add custom commands here
Cypress.Commands.add('loginWithUI', (email: string, password: string) => {
  cy.visit('/admin/auth/login');
  cy.get('input[name="email"]').type(email);
  cy.get('input[name="password"]').type(password);
  cy.get('button[type="submit"]').click();
});

// Type definitions for custom commands
declare global {
  namespace Cypress {
    interface Chainable {
      loginWithUI(email: string, password: string): Chainable<void>;
    }
  }
}

// Enable uncaught exception handling
Cypress.on('uncaught:exception', (err) => {
  // returning false here prevents Cypress from failing the test
  console.log('Uncaught exception:', err.message);
  return false;
});

export {};
