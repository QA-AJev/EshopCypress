/// <reference types="cypress" />

describe('Header component UI', () => {
    beforeEach(() => {
        cy.visit('http://192.168.0.10:5173/')
    })

    it('Should render all header elements correctly', () => {
        // Header container
        cy.get('[data-testid="header"]').should('be.visible')

        // Title
        cy.get('[data-testid="header-title"]')
            .should('be.visible')
            .and('not.be.empty')

        // Navigation links
        cy.get('[data-testid="nav"]').should('be.visible')
        cy.get('[data-testid="nav-menu"]').should('be.visible')
        cy.get('[data-testid="nav-shop"]').should('be.visible')
        cy.get('[data-testid="nav-contact"]').should('be.visible')
        cy.get('[data-testid="nav-aboutUs"]').should('be.visible')

        // Button group
        cy.get('[data-testid="button-group"]').should('be.visible')

        // Theme toggle button
        cy.get('[data-testid="theme-toggle-button"]')
            .should('be.visible')
            .and('contain.text', 'Light')

        // Language select
        cy.get('[data-testid="language-select"]')
            .should('be.visible')
            .and('have.prop', 'tagName', 'SELECT')

        // Check that language options exist
        cy.get('[data-testid^="language-option-"]').should('have.length.at.least', 1)
    })
})