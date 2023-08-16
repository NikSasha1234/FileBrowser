import spok from 'cy-spok'

context('Авторизация', function () {

    beforeEach(function () {
        cy.intercept('POST', '/api/login').as('login')
        cy.intercept('GET', 'api/resources/').as("resources")
        cy.intercept('GET', '/api/usage/').as("usage")
                })
    it('е2е тест авторизации', () =>{

        cy.login({ name: 'mohova', password: '1' })

        cy.wait('@usage').should('exist')
        cy.wait('@resources').should('exist')

        //проверка тела запроса login
        cy.get('@login').its('request.body').should(
            spok(Cypress._.cloneDeep(        {
            'username':'mohova',
            'password':'1',
            'recaptcha':''
        })))

        // проверка, что создалась кука с токеном
        cy.getCookie('auth').should('exist')

        // проверка редиректа на страницу профиля
        cy.url().should('contain', '/files/')

        // выход из профиля
        cy.logout()
    })
       })