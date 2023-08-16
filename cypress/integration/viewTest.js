context('Интеграционные тесты на панель действий: вид', function () {

    beforeEach(function () {

        cy.login({ name: 'mohova', password: '1' })

        cy.intercept('GET', '**/usage/', {fixture: 'usage.json'}).as('usage');
        cy.intercept('GET', '**/resources/', {fixture: 'resources.json'}).as('resources');

        wait()
                })

    function wait() {
        cy.wait(['@usage', '@resources'])
                    }

        const testData = ['list', 'mosaic', 'mosaic gallery']

           testData.forEach((type) => {
               it('Проверка изменения отображения файлов при установке вида: ' + type, () => {

               cy.intercept('PUT', '**/api/users/9',
                { body:
                {"what":"user",
                "which":["viewMode"],
                "data":
                {"id":9,
                "viewMode":"\"" + type + "\""}}}).as('view');

                   if(type=='list'){
                           cy.get('button[aria-label="Вид"]').click()
                   }
                   else if(type=='mosaic'){
                           cy.get('button[aria-label="Вид"]').dblclick()
                   }
                   else if(type=='mosaic gallery'){
                   cy.get('button[aria-label="Вид"]').click()
                   cy.wait('@view').its('request.body').should('include', '{"what":"user","which":["viewMode"],"data":{"id":9,"viewMode":"list"}}')
                   cy.get('button[aria-label="Вид"]').dblclick()
                   }

               cy.wait('@view').its('request.body').should('include', '{"what":"user","which":["viewMode"],"data":{"id":9,"viewMode":"' + type + '"}}')
               })
              })
              })



