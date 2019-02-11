// import ProjectsClient from '../../src/api/projects_client';

describe('e2e flow', () => {
  it('.should verify a successfull login', () => {
    // Welcome
    cy.visit('http://localhost:3001/');

    cy.title().should('include', 'Report Factory');
    cy.get('h1').should('have.text', 'Welcome to ReportFactory');

    cy.get('.btn').click();

    // Login
    cy.url().should('match', /login$/);
    cy.get('h1').should('have.text', 'Login');

    cy.get('.form-group')
      .contains('Email')
      .parent()
      .find('input')
      .type('tester@mailinator.com');

    cy.get('.form-group')
      .contains('Password')
      .parent()
      .find('input')
      .type('Qwerty12');

    cy.get('.btn[type="submit"]').click();

    // Projects
    cy.url().should('match', /projects$/);

    cy.getCookie('X-API-KEY')
      .its('value')
      .should('be.a', 'String');

    cy.get('h1').should('have.text', 'Projects');

    cy.get('.project')
      .eq(0)
      .click();

    // Project
    cy.get('h1')
      .invoke('text')
      .then(projectName => {
        expect(projectName).to.be.a('String');
        cy.url().should('include', `projects/${projectName}`);
      });
    cy.get('canvas').should('be.visible');

    // Rspec Reports
    cy.get('a.btn-primary')
      .contains('View Reports')
      .click();
    cy.get('h1')
      .invoke('text')
      .then(projectName => {
        expect(projectName).to.be.a('String');
        cy.url().should('include', `projects/${projectName}/rspec`);
      });
    cy.get('canvas').should('be.visible');
  });
});
