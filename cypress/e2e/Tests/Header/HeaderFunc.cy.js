/// <reference types="cypress" />

const hexToRgb = (hex) => {
    const bigint = parseInt(hex.replace('#', ''), 16)
    const r = (bigint >> 16) & 255
    const g = (bigint >> 8) & 255
    const b = bigint & 255
    return `rgb(${r}, ${g}, ${b})`
}

const languageMap = {
    EN: 'E-commerce Shop',      // replace with actual header text in English
    LT: 'Elektroninės prekybos parduotuvė',   // Lithuanian
    UA: 'Інтернет-магазин',        // Ukrainian
    NL: 'E-commerce Winkel'     // Dutch
}

describe('Header Functional Tests', () => {
    beforeEach(() => {
        cy.visit('http://192.168.0.10:5173/')
    })
    //THEME TEST complete
    it('Should toggle theme when the button is clicked', () => {

        cy.get('[data-testid="theme-toggle-button"]').click()

        cy.get('[data-testid="header"]')
            .invoke('attr', 'class')
            .should('include', 'dark')

        cy.get('[data-testid="theme-toggle-button"]').click()

        cy.get('[data-testid="header"]').invoke('attr', 'class')
            .should('include', 'light')
        cy.get('[data-testid="header"]').should('have.css', 'background-color', hexToRgb('#b8ccd1')) // light
        cy.get('[data-testid="theme-toggle-button"]').click()
        cy.get('[data-testid="header"]').should('have.css', 'background-color', hexToRgb('#1a1a1a')) // dark
        cy.reload()
        cy.get('[data-testid="header"]').should('have.css', 'background-color', hexToRgb('#b8ccd1')) // light
        // must return light, because no theme memory setup in localstorage, default = light #b8ccd1
    })

    it('should update header when any language is selected', () => {
        // Get all options in the select
        cy.get('[data-testid="language-select"] option').each(($option) => {
            const value = $option.val() // get the option value
            cy.get('[data-testid="language-select"]').select(value) // select it
            cy.get('[data-testid="header-title"]')
                .should('be.visible')
                .and('not.be.empty') // assert header text updates
        })
    })
    //NAV LINK (not included)
    it('should navigate via nav links', () => {
        cy.get('[data-testid="nav-menu"]').click()
        cy.url().should('include', '#') // or actual route
    })

    //LANGUAGE SUPPORT TEST
    it('Should display languages in option list:', () => {
        cy.get('[data-testid="language-select"]').within(() => {
            cy.get('option').should('have.length', 4)
            cy.get('option[value="EN"]').should('exist').and('contain.text', 'English')
            cy.get('option[value="LT"]').should('exist').and('contain.text', 'Lietuviškai')
            cy.get('option[value="UA"]').should('exist').and('contain.text', 'Українська')
            cy.get('option[value="NL"]').should('exist').and('contain.text', 'Nederlands')
        })
    })
    it('Verify multilingual support in Header', () => {
        Object.entries(languageMap).forEach(([value, headerText]) => {
            cy.get('[data-testid="language-select"]').select(value)
            cy.get('[data-testid="header-title"]').should('contain.text', headerText)
        })
    })

})