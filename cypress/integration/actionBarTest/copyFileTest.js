context('Интеграционные тесты на панель действий: копировать', function () {

    beforeEach(function () {

        cy.login({ name: 'mohova', password: '1' })

        cy.intercept('GET', '**/usage/', {fixture: 'usage.json'}).as('usage');
        cy.intercept('GET', '**/resources/', {fixture: 'resources.json'}).as('resources');
        cy.intercept('PATCH', '**/resources/mohova**', { statusCode: 200}).as('copyPathOK');

        wait()
                })

    function wait() {
        cy.wait(['@usage', '@resources'])
                    }
    function chooseFile() {
        cy.get('[aria-label="mohova"]').click()
        cy.get('#copy-button > .material-icons').click()
                        }


    it('Копирование файла в текущую директорию', () =>{

        cy.intercept('GET', '**/resources/', {fixture: 'filesTwoObject.json'}).as('filesTwoObject');

        chooseFile()

        cy.get('[aria-label="Копировать"]').click()

            cy.wait('@copyPathOK').its('request.url').should('include', 'action=copy&destination=%2Fmohova&override=false&rename=true')

        cy.get('[aria-label="mohova"]').should('be.exist').and('be.visible')
        cy.get('[aria-label="mohova(1)"]').should('be.exist').and('be.visible')

            cy.wait('@filesTwoObject')
    })


    it('Копирование файла в другую пустую директорию', () =>{

        cy.intercept('**/resources/newDirectory/', {times: 2}, {fixture: 'newDirectoryOneObject.json'}).as('newDirectoryOneObject');
        cy.intercept('**/resources/newDirectory/', {times: 1}, {fixture: 'newDirectoryEmpty.json'}).as('newDirectoryEmpty');
        cy.intercept('GET', '**/usage/newDirectory/', {fixture: 'usageNewDirectory.json'}).as('usageNewDirectory');

        chooseFile()

        cy.get('[data-url="/files/newDirectory/"]').click()
        cy.get('[aria-label="Копировать"]').click()

            cy.wait('@copyPathOK').its('request.url').should('include', 'action=copy&destination=%2FnewDirectory%2Fmohova&override=false&rename=false')
            cy.wait(['@newDirectoryEmpty', '@usageNewDirectory', '@newDirectoryOneObject'])
        cy.get('[aria-label="mohova"]').should('be.exist').and('be.visible')
        })


    it('Копирование файла в другую директорию с переименованием файла', () =>{

        cy.intercept('**/resources/newDirectory/', {times: 2}, {fixture: 'newDirectoryTwoObjects.json'}).as('newDirectoryTwoObjects');
        cy.intercept('**/resources/newDirectory/', {times: 1}, {fixture: 'newDirectoryOneObject.json'}).as('newDirectoryOneObject');
        cy.intercept('GET', '**/usage/newDirectory/', {fixture: 'usageNewDirectory.json'}).as('usageNewDirectory');

        chooseFile()

        cy.get('[data-url="/files/newDirectory/"]').click()
        cy.get('[aria-label="Копировать"]').click()

            cy.wait('@newDirectoryOneObject')

        cy.get('[class="button button--flat button--blue"]').click()

            cy.wait('@copyPathOK').its('request.url').should('include', 'action=copy&destination=%2FnewDirectory%2Fmohova&override=false&rename=true')
            cy.wait(['@usageNewDirectory', '@newDirectoryTwoObjects'])
        cy.get('[aria-label="mohova"]').should('be.exist').and('be.visible')
        cy.get('[aria-label="mohova(1)"]').should('be.exist').and('be.visible')
        })


    it('Копирование файла в другую директорию с перезаписью файла', () =>{

        cy.intercept('GET','**/resources/newDirectory/', {fixture: 'newDirectoryOneObject.json'}).as('newDirectoryOneObject');
        cy.intercept('GET', '**/usage/newDirectory/', {fixture: 'usageNewDirectory.json'}).as('usageNewDirectory');

        chooseFile()

        cy.get('[data-url="/files/newDirectory/"]').click()
        cy.get('[aria-label="Копировать"]').click()

            cy.wait('@newDirectoryOneObject')

        cy.get('[class="button button--flat button--red"]').click()

            cy.wait('@copyPathOK').its('request.url').should('include', 'action=copy&destination=%2FnewDirectory%2Fmohova&override=true&rename=false')
            cy.wait(['@usageNewDirectory', '@newDirectoryOneObject'])
        cy.get('[aria-label="mohova"]').should('be.exist').and('be.visible')

        })


    it('Отмена действия при копировании файла в другую директорию', () =>{

        cy.intercept({url: '**/resources/mohova**'}, (req) => { //отлов нежелательных запросов
                     throw new Error('Caught unexpected request ' + req.url)}).as('unexpectedRequest1')
        cy.intercept({url: '**/usage/newDirectory/'}, (req) => { //отлов нежелательных запросов
                     throw new Error('Caught unexpected request ' + req.url)}).as('unexpectedRequest2')
        cy.intercept({url: '**/resources/newDirectory/'}, (req) => { //отлов нежелательных запросов
                     throw new Error('Caught unexpected request ' + req.url)}).as('unexpectedRequest3')

        chooseFile()

        cy.get('[data-url="/files/newDirectory/"]').click()
        cy.get('[class="button button--flat button--grey"]').click()
        })


    it('Отмена копирования файла в текущую директорию', () =>{

        cy.intercept({url: '**/resources/mohova**'}, (req) => { //отлов нежелательных запросов
                     throw new Error('Caught unexpected request ' + req.url)}).as('unexpectedRequest1')
        cy.intercept({url: '**/usage/newDirectory/'}, (req) => { //отлов нежелательных запросов
                     throw new Error('Caught unexpected request ' + req.url)}).as('unexpectedRequest2')
        cy.intercept({url: '**/resources/newDirectory/'}, (req) => { //отлов нежелательных запросов
                     throw new Error('Caught unexpected request ' + req.url)}).as('unexpectedRequest3')

        chooseFile()

        cy.get('[aria-label="Отмена"]').click()
            })
       })
