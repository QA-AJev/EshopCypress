/// <reference types="cypress" />

describe('Header component UI', () => {
    const url = 'http://192.168.0.10:5173/';
    beforeEach(() => {
        cy.visit(url)
        cy.clearLocalStorage();
    })
})