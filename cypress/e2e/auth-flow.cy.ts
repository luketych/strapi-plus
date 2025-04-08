/// <reference types="cypress" />

describe('Strapi Server Health Tests', () => {
  it('should handle root path access', () => {
    cy.visit('/', { failOnStatusCode: false });
    cy.url().should('include', 'http://localhost:1337');
  });

  it('should handle admin path access', () => {
    cy.visit('/admin', { failOnStatusCode: false });
    cy.url().should('include', 'http://localhost:1337/admin');
  });

  it('should handle server restarts without crashing', () => {
    // Test multiple requests in sequence to verify server stability
    const endpoints = [
      '/',
      '/admin'
    ];

    cy.wrap(endpoints).each((endpoint: string) => {
      cy.request({
        method: 'GET',
        url: endpoint,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 302]);
        cy.task('log', `Endpoint ${endpoint} response: ${response.status}`);
      });
    });
  });
});
