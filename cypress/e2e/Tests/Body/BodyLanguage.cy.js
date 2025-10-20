/// <reference types="cypress" />

describe('Language Functional Tests', () => {
    const languageMap = {
        EN: 'E-commerce Shop',
        LT: 'Elektroninės prekybos parduotuvė',
        UA: 'Інтернет-магазин',
        NL: 'E-commerce Winkel'
    };

    const url = 'http://192.168.0.10:5173/';

    beforeEach(() => {

        cy.visit(url);
    });

    it('Should display all languages in dropdown', () => {
        cy.get('[data-testid="language-select"]').within(() => {
            cy.get('option').should('have.length', 4);
            cy.get('option[value="EN"]').should('contain.text', 'English');
            cy.get('option[value="LT"]').should('contain.text', 'Lietuvių');
            cy.get('option[value="UA"]').should('contain.text', 'Українська');
            cy.get('option[value="NL"]').should('contain.text', 'Nederlands');
        });
    });

    it('Should correctly update header text for each language', () => {
        Object.entries(languageMap).forEach(([value, headerText]) => {
            cy.get('[data-testid="language-select"]').select(value);
            cy.get('[data-testid="header-title"]')
                .should('be.visible')
                .and('contain.text', headerText);
        });
    });

    it('Should persist all languages after reload', () => {
        cy.wrap(Object.entries(languageMap)).each(([value, headerText]) => {
            cy.get('[data-testid="language-select"]').select(value);

            // Wait for header to update (UI confirms state change)
            cy.get('[data-testid="header-title"]')
                .should('be.visible')
                .and('contain.text', headerText);

            // Then check localStorage
            cy.window().its('localStorage').invoke('getItem', 'language-eshop1').should('eq', value);

            cy.reload();

            cy.get('[data-testid="header-title"]')
                .should('be.visible')
                .and('contain.text', headerText);
        });
    });
});