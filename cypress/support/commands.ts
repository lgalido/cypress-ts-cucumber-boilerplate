declare global {
  namespace Cypress {
    interface Chainable {
      login(email: string, password: string): Chainable<void>;
    }
  }
}

Cypress.Commands.add('login', (email: string, password: string) => {
  // Prefer API login to speed up tests
  cy.session([email], () => {
    cy.request('POST', '/api/login', { email, password })
      .its('status')
      .should('eq', 200);
  });
});

export {};
