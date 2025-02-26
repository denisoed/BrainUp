describe('Breathe App', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.get('#app').should('exist')
  })

  it('should load the application successfully', () => {
    cy.url().should('eq', Cypress.config().baseUrl + '/')
    cy.get('#app').should('be.visible')
  })

  it('should have proper meta information', () => {
    cy.title().should('not.be.empty')
    cy.get('meta[name="viewport"]').should('exist')
  })
}) 