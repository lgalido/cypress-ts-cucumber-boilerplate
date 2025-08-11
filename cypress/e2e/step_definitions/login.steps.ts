import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import { LoginPage } from "../../pages/LoginPage";

const lp = new LoginPage();

Given('I open the login page', () => {
  lp.visit();
});

When('I sign in as a standard user', () => {
  const email = Cypress.env('USER');
  const pass = Cypress.env('PASS');
  lp.email().type(String(email || ''));
  lp.pass().type(String(pass || ''));
  lp.submit();
});

Then('I should see the dashboard', () => {
  cy.url().should('include', '/dashboard');
  cy.contains('Welcome').should('be.visible');
});
