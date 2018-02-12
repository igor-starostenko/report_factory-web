describe('authentication', () => {
  it('projects page requires authentication', () => {
    cy.visit('http://localhost:3001/projects');

    cy.get('h1').should('have.text', 'Login');
  });
});
