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
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('getByData', (selector) => {
  return cy.get(`[data-test="${selector}"]`)
})

// Команда для проверки загрузки страницы
Cypress.Commands.add('waitForPageLoad', () => {
  cy.get('#app').should('exist')
  cy.get('nav').should('exist')
})

// Команда для проверки доступности элемента
Cypress.Commands.add('checkA11y', (element) => {
  cy.get(element).should('have.attr', 'role')
  cy.get(element).should('have.attr', 'aria-label')
})

// Команда для проверки состояния загрузки
Cypress.Commands.add('waitForLoader', () => {
  cy.get('[data-test="loader"]').should('not.exist')
})

// Команда для проверки наличия ошибок в консоли
Cypress.Commands.add('checkNoConsoleErrors', () => {
  cy.window().then((win) => {
    cy.spy(win.console, 'error')
    expect(win.console.error).to.not.be.called
  })
})