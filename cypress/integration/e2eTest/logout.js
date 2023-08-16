import logoutPage from '../../support/pages/logoutPage';

describe('logout', () =>{

beforeEach(()=>{

cy.intercept('POST', '/api/login').as('login')

cy.login({ name: 'mohova', password: '1' })
cy.wait('@login')

logoutPage.visit();

});


it('Тест выхода из профиля', () => {
logoutPage.logoutButton();

logoutPage.getCookie().should('not.exist');
logoutPage.getNewUrl().should('contain', '/login')

})


})