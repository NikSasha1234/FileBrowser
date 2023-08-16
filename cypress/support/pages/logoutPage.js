class logoutPage {
visit(){
cy.visit('/files/');
}

logoutButton(){
    const button = cy.get('#logout > span');

    button.should('be.exist');
    button.should('be.visible');
    button.should('have.text', 'Выйти');

    button.click();
    }

getCookie(){
return cy.getCookie('auth');
}

getNewUrl(){
return cy.url();
}

}
export default new logoutPage();