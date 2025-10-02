export class LoginPage {
  visit() { 
    cy.visit('https://the-internet.herokuapp.com/login'); 
  }
  
  email() { 
    return cy.get('#username'); 
  }
  
  pass() { 
    return cy.get('#password'); 
  }
  
  submit() { 
    return cy.get('button[type="submit"]').click(); 
  }
}
