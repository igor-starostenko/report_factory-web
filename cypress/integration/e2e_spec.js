describe('e2e flow', () => {
  it('.should verify a successfull login', () => {
    cy.visit('http://localhost:3001/');

    cy.title().should('include', 'Report Factory');
    cy.get('h1').should('have.text', 'Welcome to ReportFactory');

    cy.get('.btn').click();
    cy.get('h1').should('have.text', 'Login');

    cy.get('.form-group').contains('Email').parent().find('input')
      .type('tester@mailinator.com');

    cy.get('.form-group').contains('Password').parent().find('input')
      .type('Qwerty12');

    cy.get('.btn[type="submit"]').click();

    cy.get('h1').should('have.text', 'Projects');

    cy.get('.list-group button:nth-child(1)>a').click();
  });
});
