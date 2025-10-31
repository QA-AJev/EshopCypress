/// <reference types="cypress" />

const sortTests = [
    {
        sortValue: 'nameAz',
        firstName: 'Backpack',
        lastName: 'Yoga Mat',
        before: 'React Guidebook',
        after: 'Wireless Headphones'
    },
    {
        sortValue: 'nameZa',
        firstName: 'Yoga Mat',
        lastName: 'Backpack',
        before: 'Wireless Headphones',
        after: 'React Guidebook'
    },
    {
        sortValue: 'categoryAz',
        firstName: 'Sunglasses',
        lastName: 'Notebook',
        before: null,
        after: null
    },
    {
        sortValue: 'categoryZa',
        firstName: 'Notebook',
        lastName: 'Sunglasses'
    },
    {
        sortValue: 'priceLowHigh',
        firstName: 'Gardening Gloves',
        lastName: 'Lawn Mower',
        before: 'Coffee Maker',
        after: 'Smartwatch'
    },
    {
        sortValue: 'priceHighLow',
        firstName: 'Lawn Mower',
        lastName: 'Gardening Gloves',
        before: 'Smartwatch',
        after: 'Coffee Maker'
    }
];

describe('Filter Functionality Tests', () => {
    const url = 'http://192.168.0.10:5173/';

    beforeEach(() => {
        cy.clearLocalStorage();
        cy.visit(url);
    });

    it('should display correct number of items for each show option', () => {
        const totalItems = 30; // Based on mockItems length

        const showOptions = [
            { value: '5', expected: 5 },
            { value: '10', expected: 10 },
            { value: '20', expected: 20 },
            { value: '50', expected: Math.min(50, totalItems) }, // 30
            { value: 'all', expected: totalItems }
        ];

        showOptions.forEach(({ value, expected }) => {
            cy.get('[data-testid="filters"] select').first().select(value);
            cy.get('[data-testid="item-list-container"] ul li').should('have.length', expected);
        });
    });

    it('should sort items correctly for each sort option', () => {
        sortTests.forEach(({ sortValue, firstName, lastName, before, after }) => {
            cy.get('[data-testid="filters"] select').last().select(sortValue);

            // Check first item
            cy.get('[data-testid="item-list-container"] ul li').first().within(() => {
                cy.get('h3').should('contain', firstName);
            });

            // Check last item
            cy.get('[data-testid="item-list-container"] ul li').last().within(() => {
                cy.get('h3').should('contain', lastName);
            });

            // Check specific pair order if provided
            if (before && after) {
                cy.get('[data-testid="item-list-container"] ul li h3').then($headers => {
                    const names = $headers.map((i, el) => el.textContent).get();
                    const indexBefore = names.indexOf(before);
                    const indexAfter = names.indexOf(after);
                    expect(indexBefore).to.be.lessThan(indexAfter);
                });
            }
        });
    });

    it('should filter items by search query', () => {
        // Test case 1: Search for "Head" - should show 1 item (Wireless Headphones)
        cy.get('[data-testid="search-input"]').type('Head');
        cy.get('[data-testid="search-button"]').click();
        cy.get('[data-testid="item-list-container"] ul li').should('have.length', 1);
        cy.get('h3').first().should('contain', 'Wireless Headphones');

        // Test case 2: Search for "e" - should show multiple items (many names contain 'e')
        cy.get('[data-testid="search-input"]').clear().type('e');
        cy.get('[data-testid="search-button"]').click();
        cy.get('[data-testid="item-list-container"] ul li').should('have.length.gt', 5); // At least 6 items should match

        // Test case 3: Search for "xyz" - should show 0 items
        cy.get('[data-testid="search-input"]').clear().type('xyz');
        cy.get('[data-testid="search-button"]').click();
        cy.get('[data-testid="item-list-container"] ul li').should('have.length', 0);

        // Clear search and show all items
        cy.get('[data-testid="search-input"]').clear();
        cy.get('[data-testid="search-button"]').click();
        cy.get('[data-testid="item-list-container"] ul li').should('have.length', 30);
    });
});
