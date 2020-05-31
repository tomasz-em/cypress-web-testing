// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

Cypress.Commands.add('registrationToMyApp', ( login, password ) => {    // nazwa po ADD jest własną, najlepiej użyć kontkretnje, by nie nadpisać jakiejś funkcji systemowej 
    cy.xpath('//input[@name="login"]').type( login );   // wypełnienie obu pól
    cy.xpath('//input[@name="password"]').type( password );  // UWAGA: edytor nie podpowie WŁASNEJ nazwy
})

Cypress.Commands.add('verifyMyLoginForm', ( role, subtitle, buttonText, linkText ) => {
    cy.get('.container').should('contain', role );   // CONTAIN() != CONTAINS()
    cy.get('.container').should('contain', subtitle );
    cy.get('#login').should('exist');
    cy.get('#password').should('exist');
    cy.get('button').should('exist').and('have.text', buttonText );
    cy.get('a[href="register.html"]').should('exist').and('have.text', linkText ); 
})

Cypress.Commands.add('verifyMyLoginFormByObject', ({ role, subtitle, buttonText, linkText }) => {
    cy.get('.container').should('contain', role );   // CONTAIN() != CONTAINS()
    cy.get('.container').should('contain', subtitle );
    cy.get('#login').should('exist');
    cy.get('#password').should('exist');
    cy.get('button').should('exist').and('have.text', buttonText );
    cy.get('a[href="register.html"]').should('exist').and('have.text', linkText ); 
})