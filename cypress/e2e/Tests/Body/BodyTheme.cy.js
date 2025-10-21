/// <reference types="cypress" />

describe('Theme Toggle Verification', () => {
    const url = 'http://192.168.0.10:5173/';
    const lightColor = '#b8ccd1'; // rgb(184, 204, 209)
    const darkColor = '#1a1a1a';  // rgb(26, 26, 26)

    const hexToRgb = (hex) => {
        const bigint = parseInt(hex.replace('#', ''), 16)
        const r = (bigint >> 16) & 255
        const g = (bigint >> 8) & 255
        const b = bigint & 255
        return `rgb(${r}, ${g}, ${b})`
    }

    beforeEach(() => {
        cy.clearLocalStorage();
        cy.visit(url);
    });

    it('should have dark theme by default', () => {
        // Verify that the app body has dark theme initially
        cy.get('[data-testid="item-list-container"]')
            .should('have.css', 'background-color', hexToRgb(darkColor))
            .invoke('attr', 'class')
            .should('include', 'dark');

        // Check if list items have the dark theme class initially
        cy.get('._item_1exc7_351').each(($item) => {
            cy.wrap($item)
                .should('have.css', 'background-color', hexToRgb(darkColor))
                .invoke('attr', 'class')
                .should('include', 'dark');
        });

        // Verify other elements have dark theme by default
        cy.get('._filters_1exc7_17')
            .should('have.css', 'background-color', hexToRgb(darkColor))
            .invoke('attr', 'class')
            .should('include', 'dark');

        cy.get('._searchInput_1exc7_77')
            .should('have.css', 'background-color', hexToRgb(darkColor));

        cy.get('._searchButton_1exc7_133')
            .should('have.css', 'background-color', hexToRgb(darkColor));

        cy.get('._filterSelect_1exc7_265').each(($select) => {
            cy.wrap($select)
                .should('have.css', 'background-color', hexToRgb(darkColor));
        });
    });

    it('should toggle to light theme when theme is switched', () => {
        // Find and click the theme toggle button
        cy.get('[data-testid="theme-toggle-button"]')
            .click()
            .then(() => {
                // Verify that dark theme is replaced with light theme on the container
                cy.get('[data-testid="item-list-container"]')
                    .should('have.css', 'background-color', hexToRgb(lightColor))
                    .invoke('attr', 'class')
                    .should('not.include', 'dark');

                // Verify that list items have light theme
                cy.get('._item_1exc7_351').each(($item) => {
                    cy.wrap($item)
                        .should('have.css', 'background-color', hexToRgb(lightColor))
                        .invoke('attr', 'class')
                        .should('not.include', 'dark');
                });

                // Verify other elements have light theme
                cy.get('._filters_1exc7_17')
                    .should('have.css', 'background-color', hexToRgb(lightColor))
                    .invoke('attr', 'class')
                    .should('not.include', 'dark');

                cy.get('._searchInput_1exc7_77')
                    .should('have.css', 'background-color', hexToRgb(lightColor));

                cy.get('._searchButton_1exc7_133')
                    .should('have.css', 'background-color', hexToRgb(lightColor));

                cy.get('._filterSelect_1exc7_265').each(($select) => {
                    cy.wrap($select)
                        .should('have.css', 'background-color', hexToRgb(lightColor));
                });
            });
    });

    it('should maintain light theme after page refresh', () => {
        // Toggle to light theme
        cy.get('[data-testid="theme-toggle-button"]')
            .click();

        cy.get('[data-testid="item-list-container"]')
            .should('have.css', 'background-color', hexToRgb(lightColor))
            .invoke('attr', 'class')
            .should('not.include', 'dark');

        // Refresh the page
        cy.reload();

        // Verify light theme persists
        cy.get('[data-testid="item-list-container"]')
            .should('have.css', 'background-color', hexToRgb(lightColor))
            .invoke('attr', 'class')
            .should('not.include', 'dark');

        cy.get('._item_1exc7_351').first()
            .should('have.css', 'background-color', hexToRgb(lightColor))
            .invoke('attr', 'class')
            .should('not.include', 'dark');
    });

    it('should toggle between dark and light themes', () => {
        // Start with dark theme (default)
        cy.get('[data-testid="item-list-container"]')
            .should('have.css', 'background-color', hexToRgb(darkColor))
            .invoke('attr', 'class')
            .should('include', 'dark');

        // Switch to light theme
        cy.get('[data-testid="theme-toggle-button"]')
            .click();

        cy.get('[data-testid="item-list-container"]')
            .should('have.css', 'background-color', hexToRgb(lightColor))
            .invoke('attr', 'class')
            .should('not.include', 'dark');

        // Switch back to dark theme
        cy.get('[data-testid="theme-toggle-button"]')
            .click();

        cy.get('[data-testid="item-list-container"]')
            .should('have.css', 'background-color', hexToRgb(darkColor))
            .invoke('attr', 'class')
            .should('include', 'dark');
    });

    it('should update button text when theme changes', () => {
        // Verify initial button text (should be "Mode: Light" if dark theme is default)
        cy.get('[data-testid="theme-toggle-button"]').should('contain', 'Mode: Light');

        // Toggle to light theme
        cy.get('[data-testid="theme-toggle-button"]').click();

        // Button text should now indicate dark mode is available
        cy.get('[data-testid="theme-toggle-button"]').should('contain', 'Mode: Dark');

        // Toggle back to dark theme
        cy.get('[data-testid="theme-toggle-button"]').click();

        // Button text should be back to light mode
        cy.get('[data-testid="theme-toggle-button"]').should('contain', 'Mode: Light');
    });

    it('should apply dark theme to all list items by default', () => {
        // Verify all items have dark theme by default using CSS color
        cy.get('._item_1exc7_351').should('have.length.greaterThan', 0);

        cy.get('._item_1exc7_351').each(($item, index) => {
            cy.wrap($item)
                .should('have.css', 'background-color', hexToRgb(darkColor))
                .invoke('attr', 'class')
                .should('include', 'dark');
        });
    });

    it('should apply light theme to all list items when switched', () => {
        // Verify all items have dark theme initially
        cy.get('._item_1exc7_351').each(($item) => {
            cy.wrap($item)
                .should('have.css', 'background-color', hexToRgb(darkColor))
                .invoke('attr', 'class')
                .should('include', 'dark');
        });

        // Toggle to light theme
        cy.get('[data-testid="theme-toggle-button"]')
            .click();

        // Verify all items now have light theme
        cy.get('._item_1exc7_351').each(($item) => {
            cy.wrap($item)
                .should('have.css', 'background-color', hexToRgb(lightColor))
                .invoke('attr', 'class')
                .should('not.include', 'dark');
        });
    });

    it('should apply theme to filter elements correctly', () => {
        // Verify dark theme on filter elements by default
        cy.get('._filters_1exc7_17')
            .should('have.css', 'background-color', hexToRgb(darkColor))
            .invoke('attr', 'class')
            .should('include', 'dark');

        cy.get('._searchInput_1exc7_77')
            .should('have.css', 'background-color', hexToRgb(darkColor));

        cy.get('._searchButton_1exc7_133')
            .should('have.css', 'background-color', hexToRgb(darkColor));

        cy.get('._filterSelect_1exc7_265').each(($select) => {
            cy.wrap($select)
                .should('have.css', 'background-color', hexToRgb(darkColor));
        });

        // Toggle to light theme and verify colors change
        cy.get('[data-testid="theme-toggle-button"]')
            .click();

        cy.get('._filters_1exc7_17')
            .should('have.css', 'background-color', hexToRgb(lightColor))
            .invoke('attr', 'class')
            .should('not.include', 'dark');

        cy.get('._searchInput_1exc7_77')
            .should('have.css', 'background-color', hexToRgb(lightColor));

        cy.get('._filterSelect_1exc7_265').each(($select) => {
            cy.wrap($select)
                .should('have.css', 'background-color', hexToRgb(lightColor));
        });
    });
});