context('Интеграционные тесты на панель действий: удалить', function () {

    beforeEach(function () {

        cy.login({ name: 'mohova', password: '1' })

        cy.intercept('GET', '**/usage/', {fixture: 'usage.json'}).as('usage');
        cy.intercept('**/resources/', {times: 2}, {fixture: 'resourcesEmpty.json'}).as('resourcesEmpty');
        cy.intercept('**/resources/', {times: 1}, {fixture: 'resources.json'}).as('resources');
        cy.intercept('DELETE', '**/api/resources/mohova', { statusCode: 200}).as('delete');

        wait()
                })

    function wait() {
        cy.wait(['@usage', '@resources'])
                    }
    function chooseFile() {
        cy.get('[aria-label="mohova"]').click()
        cy.get('#delete-button > .material-icons').click()
                        }


    it('Удаление файла', () =>{

        chooseFile()

        cy.get('.button--red').click()

            cy.wait('@delete').its('request.url').should('contain', 'mohova')
            cy.wait('@resourcesEmpty')

        cy.get('[aria-label="mohova"]').should('not.exist')
           })


    it('Отмена удаления', () =>{
        cy.intercept({url: '**/api/resources/mohova'}, (req) => { //отлов нежелательных запросов
                     throw new Error('Caught unexpected request ' + req.url)}).as('unexpectedRequest')
        chooseFile()

        cy.get('[class="button button--flat button--grey"]').click()

        cy.get('[aria-label="mohova"]').should('be.exist')
           })
       })
