context('Интеграционные тесты на панель действий: переименовать', function () {

    beforeEach(function () {

        cy.login({ name: 'mohova', password: '1' })

        cy.intercept('**/api/resources/', {times: 2}, {fixture: 'responseRenameFile.json'}).as('responseRenameFile');
        cy.intercept('**/usage/newDirectory/', {times: 2}, {fixture: 'usageNewDirectory.json'}).as('usageNewDirectory');
        cy.intercept('**/usage/', {times: 1}, {fixture: 'usage.json'}).as('usage');
        cy.intercept('**/resources/', {times: 1}, {fixture: 'resources.json'}).as('resources');

        wait()
                })

    function wait() {
        cy.wait(['@usage', '@resources'])
                    }
    function chooseRenameFile() {
        cy.get('[aria-label="mohova"]').click()
        cy.get('[aria-label="Переименовать"] > .material-icons').click()
                        }

    it('Переименовать файл', () =>{

        cy.intercept('PATCH', '**/resources/mohova**', { statusCode: 200}).as('copyPathOK');

        chooseRenameFile()

        cy.get('[class="input input--block"]').clear().type('file1')
        cy.get('[type="submit"]').click()

            cy.wait('@copyPathOK').its('request.url').should('include', 'action=rename&destination=%2Ffile1&override=false&rename=false')
            cy.wait('@responseRenameFile')

        cy.get('[aria-label="file1"]').should('be.exist')
        cy.get('[aria-label="mohova"]').should('not.exist')

        })


    it('Задать файлу пустое название', () =>{

        cy.intercept('PATCH', '**/resources/mohova**', { statusCode: 403}).as('copyPathForbidden');

        chooseRenameFile()

        cy.get('[class="input input--block"]').clear()
        cy.get('[type="submit"]').click()

            cy.wait('@copyPathForbidden').its('request.url').should('include', 'action=rename&destination=%2F&override=false&rename=false')

        cy.get('[aria-label="mohova"]').should('be.exist')
        cy.get('[class="noty_bar noty_type__error noty_theme__mint noty_close_with_click noty_has_progressbar"]').should('be.exist').and('be.visible')

        })

    it('Задать файлу существующее название файла', () =>{

        cy.intercept('PATCH', '**/resources/mohova**', { statusCode: 409}).as('copyPathConflict');

        chooseRenameFile()

        cy.get('[class="input input--block"]')
        cy.get('[type="submit"]').click()

            cy.wait('@copyPathConflict').its('request.url').should('include', 'action=rename&destination=%2Fmohova&override=false&rename=false')

        cy.get('[aria-label="mohova"]').should('be.exist')
        cy.get('[class="noty_bar noty_type__error noty_theme__mint noty_close_with_click noty_has_progressbar"]').should('be.exist').and('be.visible')
        })


    it('Отмена переименования', () =>{

        cy.intercept({url: '**/resources/mohova**'}, (req) => { //отлов нежелательных запросов
                     throw new Error('Caught unexpected request ' + req.url)}).as('unexpectedRequest')

        chooseRenameFile()

        cy.get('[class="input input--block"]')
        cy.get('[aria-label="Отмена"]').click()
        })
       })