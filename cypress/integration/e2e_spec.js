describe('e2e flow', () => {
  it('.should verify a successfull login', () => {
    cy.visit('http://localhost:3001/');

    cy.title().should('include', 'Report Factory');
  });
});
