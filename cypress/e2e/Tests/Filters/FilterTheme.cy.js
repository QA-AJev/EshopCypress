/// <reference types="cypress" />

const hexToRgb = (hex) => {
    const bigint = parseInt(hex.replace('#', ''), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgb(${r}, ${g}, ${b})`;
};

describe('Theme Toggle Verification', () => {
    const url = 'http://192.168.0.10:5173/';
    const lightFiltersHex = '#e0e8f0';
    const lightContainerHex = '#b8ccd1';
    const darkFiltersHex = '#2a2a2a';
    const darkContainerHex = '#1a1a1a';
    const lightFiltersColor = hexToRgb(lightFiltersHex);
    const lightContainerColor = hexToRgb(lightContainerHex);
    const darkFiltersColor = hexToRgb(darkFiltersHex);
    const darkContainerColor = hexToRgb(darkContainerHex);

    beforeEach(() => {
        cy.clearLocalStorage();
        cy.visit(url);
    });

    it('should load in dark theme by default', () => {
        cy.get('[data-testid="item-list-container"]')
            .should('have.css', 'background-color', darkContainerColor);

        cy.get('[data-testid="item-list-container"]')
            .invoke('attr', 'class')
            .should('include', 'dark');
    });

    it('should toggle to light theme when user switches theme', () => {
        cy.get('[data-testid="theme-toggle-button"]').click();

        cy.get('[data-testid="filters"]')
            .should('have.css', 'background-color', lightFiltersColor);

        cy.window().then((win) => {
            expect(win.localStorage.getItem('theme-eshop1')).to.eq('light');
        });
    });

    it('should persist theme after reload', () => {
        cy.get('[data-testid="theme-toggle-button"]').click();
        cy.reload();

        cy.get('[data-testid="item-list-container"]')
            .should('have.css', 'background-color', lightContainerColor);
    });
});
