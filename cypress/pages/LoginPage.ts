export class LoginPage {
  visit() { cy.visit('/login'); }
  email() { return cy.get('[data-cy=email]'); }
  pass() { return cy.get('[data-cy=password]'); }
  submit() { return cy.get('[data-cy=submit]'); }
}
