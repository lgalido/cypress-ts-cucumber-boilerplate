import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import { LoginPage } from "../../pages/LoginPage";

const lp = new LoginPage();

Given('I open the login page', () => {
  lp.visit();
});

When('I sign in as a standard user', () => {
  // Using demo credentials from the-internet.herokuapp.com
  lp.email().type('tomsmith');
  lp.pass().type('SuperSecretPassword!');
  lp.submit();
});

Then('I should see the dashboard', () => {
  // Check for successful login page
  cy.url().should('include', '/secure');
  cy.contains('Welcome to the Secure Area').should('be.visible');
  cy.get('.flash.success').should('contain', 'You logged into a secure area!');
});
