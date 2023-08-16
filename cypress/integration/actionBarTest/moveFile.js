context('Интеграционные тесты на панель действий: переместить', function () {

    beforeEach(function () {

        cy.login({ name: 'mohova', password: '1' })

        cy.intercept('GET', '**/usage/', {fixture: 'usage.json'}).as('usage');
        cy.intercept('**/resources/', {times: 2}, {fixture: 'resourcesEmpty.json'}).as('resourcesEmpty');
        cy.intercept('**/resources/', {times: 1}, {fixture: 'resources.json'}).as('resources');
        cy.intercept('PATCH', '**/resources/mohova**', { statusCode: 200}).as('copyPathOK');

        wait()
                })

    function wait() {
        cy.wait(['@usage', '@resources'])
                    }
    function chooseFile() {
        cy.get('[aria-label="mohova"]').click()
        cy.get('#move-button > .material-icons').click()
                        }


    it('Перемещение файла в другую директорию', () =>{

        cy.intercept('**/resources/newDirectory/', {times: 2}, {fixture: 'newDirectoryOneObject.json'}).as('newDirectoryOneObject');
        cy.intercept('**/resources/newDirectory/', {times: 1}, {fixture: 'newDirectoryEmpty.json'}).as('newDirectoryEmpty');
        cy.intercept('POST', '**/api/renew', { statusCode: 200}).as('renew');

        cy.intercept('GET', '**/usage/newDirectory/', {fixture: 'usageNewDirectory.json'}).as('usageNewDirectory');

        chooseFile()

        cy.get('[data-url="/files/newDirectory/"]').click()

        cy.get('[aria-label="Переместить"]').click()

            cy.wait('@newDirectoryEmpty')

            cy.wait('@copyPathOK').its('request.url').should('include', 'action=rename&destination=%2FnewDirectory%2Fmohova&override=false&rename=false')
            cy.wait(['@usageNewDirectory', '@newDirectoryOneObject'])

        cy.get('[aria-label="mohova"]').should('be.exist').and('be.visible')

        cy.visit('/files')
            cy.wait('@renew')

                    cy.login({ name: 'mohova', password: '1' })

            cy.wait(['@usage', '@resourcesEmpty'])

        cy.get('[aria-label="mohova"]').should('not.exist')
           })


    it('Проверка запрета на перемещение в текущую директорию', () =>{

        chooseFile()

        cy.get('[aria-label="Переместить"]').should('be.disabled').and('be.visible')
           })


    it('Отмена перемещения файла', () =>{

        cy.intercept({url: '**/resources/mohova**'}, (req) => { //отлов нежелательных запросов
                     throw new Error('Caught unexpected request ' + req.url)}).as('unexpectedRequest1')
        cy.intercept({url: '**/usage'}, (req) => { //отлов нежелательных запросов
                     throw new Error('Caught unexpected request ' + req.url)}).as('unexpectedRequest2')
        cy.intercept({url: '**/resources'}, (req) => { //отлов нежелательных запросов
                     throw new Error('Caught unexpected request ' + req.url)}).as('unexpectedRequest3')

        chooseFile()

        cy.get('[aria-label="Отмена"]').click()
        cy.get('[aria-label="mohova"]').should('be.exist')
        })

    it('Перемещение файла в другую директорию с переименованием', () =>{

        cy.intercept('**/resources/newDirectory/', {times: 2}, {fixture: 'newDirectoryTwoObjects.json'}).as('newDirectoryTwoObjects');
        cy.intercept('**/resources/newDirectory/', {times: 1}, {fixture: 'newDirectoryOneObject.json'}).as('newDirectoryOneObject');
        cy.intercept('GET', '**/usage/newDirectory/', {fixture: 'usageNewDirectory.json'}).as('usageNewDirectory');
        cy.intercept('POST', '**/api/renew', { statusCode: 200}).as('renew');

        chooseFile()

        cy.get('[data-url="/files/newDirectory/"]').click()

        cy.get('[aria-label="Переместить"]').click()

            cy.wait('@newDirectoryOneObject')

            cy.get('[class="button button--flat button--blue"]').click()

            cy.wait('@copyPathOK').its('request.url').should('include', 'action=rename&destination=%2FnewDirectory%2Fmohova&override=false&rename=true')
            cy.wait(['@usageNewDirectory', '@newDirectoryTwoObjects'])

        cy.get('[aria-label="mohova"]').should('be.exist').and('be.visible')
        cy.get('[aria-label="mohova(1)"]').should('be.exist').and('be.visible')

        cy.visit('/files')
            cy.wait('@renew')

                    cy.login({ name: 'mohova', password: '1' })

            cy.wait(['@usage', '@resourcesEmpty'])

        cy.get('[aria-label="mohova"]').should('not.exist')
           })

    it('Перемещение файла в другую директорию с перезаписью', () =>{

        cy.intercept('GET','**/resources/newDirectory/', {fixture: 'newDirectoryOneObject.json'}).as('newDirectoryOneObject');
        cy.intercept('GET', '**/usage/newDirectory/', {fixture: 'usageNewDirectory.json'}).as('usageNewDirectory');
        cy.intercept('POST', '**/api/renew', { statusCode: 200}).as('renew');

        chooseFile()

        cy.get('[data-url="/files/newDirectory/"]').click()

        cy.get('[aria-label="Переместить"]').click()

            cy.wait('@newDirectoryOneObject')

            cy.get('[class="button button--flat button--red"]').click()

            cy.wait('@copyPathOK').its('request.url').should('include', 'action=rename&destination=%2FnewDirectory%2Fmohova&override=true&rename=false')
            cy.wait(['@usageNewDirectory', '@newDirectoryOneObject'])

        cy.get('[aria-label="mohova"]').should('be.exist').and('be.visible')

        cy.visit('/files')
        cy.wait('@renew')

        cy.login({ name: 'mohova', password: '1' })
        cy.wait(['@usage', '@resourcesEmpty'])

        cy.get('[aria-label="mohova"]').should('not.exist')
           })

    it('Отмена перемещения при наличии одноименного файла в другой директории', () =>{

        cy.intercept({url: '**/resources/mohova**'}, (req) => { //отлов нежелательных запросов
                     throw new Error('Caught unexpected request ' + req.url)}).as('unexpectedRequest1')
        cy.intercept({url: '**/usage/newDirectory/'}, (req) => { //отлов нежелательных запросов
                     throw new Error('Caught unexpected request ' + req.url)}).as('unexpectedRequest2')
        cy.intercept({url: '**/resources/newDirectory/'}, (req) => { //отлов нежелательных запросов
                     throw new Error('Caught unexpected request ' + req.url)}).as('unexpectedRequest3')

        cy.intercept('GET', '**/resources/newDirectory/', {fixture: 'newDirectoryOneObject.json'}).as('newDirectoryOneObject');

        chooseFile()

        cy.get('[data-url="/files/newDirectory/"]').click()

        cy.get('[aria-label="Переместить"]').click()

            cy.wait('@newDirectoryOneObject')

        cy.get('[class="button button--flat button--grey"]').click()
        cy.get('[aria-label="mohova"]').should('be.exist').and('be.visible')
           })
       })
