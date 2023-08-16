Cypress.Commands.add('login', (user) => {
cy.visit('')

        cy.get('[type="text"]').type(user.name)
        cy.get('[type="password"]').type(user.password)
        cy.get('.button').click()
    }
)

Cypress.Commands.add('logout', () => {

    cy.visit('/files/')

    // проверка, что существует объект Logout
    cy.contains('Выйти').should('exist')

    // выход из профиля
    cy.get('#logout > span').click()

    // проверка, что удалилась кука с токеном
    cy.getCookie('auth').should('not.exist')

    // проверка редиректа на страницу авторизации
    cy.url().should('contain', '/login')
})




