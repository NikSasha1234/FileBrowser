context('Авторизация', function () {

    beforeEach(function () {
        cy.intercept('POST', '/api/login').as('login')
        cy.intercept('GET', 'api/resources/').as("resources")
        cy.intercept('GET', '/api/usage/').as("usage")
                })

    function checkStatusCodeIncorrectLogin() {

        cy.wait('@login').should(fetch => {
        expect(fetch.response.statusCode).to.eq(403)
        })

        cy.get('.wrong').should('have.text', 'Неверные данные' )
    }


    it('Авторизация под админом', () =>{

        cy.login({ name: 'admin', password: 'admin' })

        cy.wait('@usage').should('exist')
        cy.wait('@resources').should('exist')

        // проверка, что создалась кука с токеном
        cy.getCookie('auth').should('exist')

        // проверка редиректа на страницу профиля
        cy.url().should('contain', '/files/')

        // выход из профиля
        cy.logout()
    })


    it('Авторизация с некорректным логином', () =>{

        cy.login({ name: 'admin1', password: 'admin' })

        checkStatusCodeIncorrectLogin()
    })


    it('Авторизация с некорректным паролем', () =>{

        cy.login({ name: 'admin', password: '1234' })

        checkStatusCodeIncorrectLogin()
   })


    it('Авторизация с пустыми значениями полей логина и пароля', () =>{

        cy.login({ name: '{enter}', password: '{enter}' })

        checkStatusCodeIncorrectLogin()
    })


    it('Авторизация с пустым значением поля пароля', () =>{

        cy.login({ name: 'admin', password: '{enter}' })

        checkStatusCodeIncorrectLogin()
   })


    it('Авторизация с пустым значением поля логина', () =>{

       cy.login({ name: '{enter}', password: 'admin' })

       checkStatusCodeIncorrectLogin()
    })


    it('Проверка отображения сообщения об ошибке при моках запросов usage и resources', () =>{

        cy.intercept('GET', '/api/usage/', {
          statusCode: 500
          }).as('usage')

        cy.intercept('GET', '/api/resources/', {
          statusCode: 500
          }).as('resources')

        cy.login({ name: 'admin', password: 'admin' })

        // проверка редиректа на страницу профиля
        cy.url().should('contain', '/files/')

        // проверка сообщения об ошибке загрузки страницы
        cy.get('.message > span').should('have.text', 'Something really went wrong.')

        // проверка отсутствия расчета используемого хранилища
        cy.get('div.credits').should('contain', '0 of 0 used')

        // проверка, что создалась кука с токеном
        cy.getCookie('auth').should('exist')

        // выход из профиля
        cy.logout()
    })
   })