/// <reference types="cypress" />

const hexToRgb = (hex) => {
    const bigint = parseInt(hex.replace('#', ''), 16)
    const r = (bigint >> 16) & 255
    const g = (bigint >> 8) & 255
    const b = bigint & 255
    return `rgb(${r}, ${g}, ${b})`
}



describe('Header Functional Tests', () => {
    const url = 'http://192.168.0.10:5173/';
    const lightColor = hexToRgb('#b8ccd1');
    const darkColor = hexToRgb('#1a1a1a');

    beforeEach(() => {
        cy.visit(url);
        cy.clearLocalStorage();
    })
    //THEME TEST
    it('toggles theme and updates header class & color', () => {

        // Default = dark
        cy.get('[data-testid="header"]')
            .should('have.css', 'background-color', darkColor)
            .invoke('attr', 'class')
            .should('include', 'dark');

        // Switch to light
        cy.get('[data-testid="theme-toggle-button"]').click();
        cy.get('[data-testid="header"]')
            .should('have.css', 'background-color', lightColor)
            .invoke('attr', 'class')
            .should('include', 'light');
        // Check localStorage saved light theme
        cy.window().its('localStorage.theme-eshop1').should('eq', 'light');

        // Switch back to dark
        cy.get('[data-testid="theme-toggle-button"]').click();
        cy.get('[data-testid="header"]')
            .should('have.css', 'background-color', darkColor)
            .invoke('attr', 'class')
            .should('include', 'dark');
        // Check localStorage saved dark theme
        cy.window().its('localStorage.theme-eshop1').should('eq', 'dark');
    })

   
    //NAV LINK (not included)
    it('should navigate via nav links', () => {
        cy.get('[data-testid="nav-menu"]').click()
        cy.url().should('include', '#') // or actual route
    })


})