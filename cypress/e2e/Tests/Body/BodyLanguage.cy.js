/// <reference types="cypress" />

describe('Body Product List Multilingual Support', () => {
    const url = 'http://192.168.0.10:5173/';
    const languages = ['EN', 'LT', 'UA', 'NL'];

    beforeEach(() => {
        cy.visit(url);
    });

    it('should update visible product texts when switching language', () => {
        let textEN = '';

        // Step 1: Capture baseline (English)
        cy.get('[data-testid="language-select"]').select('EN');
        cy.wait(200);
        cy.get('ul._list_1exc7_333').then($ul => {
            textEN = normalizeText($ul.text());
        });

        // Step 2: Compare each language
        languages.slice(1).forEach(lang => {
            cy.get('[data-testid="language-select"]').select(lang);
            cy.wait(250);

            cy.get('ul._list_1exc7_333').then($ul => {
                const textNew = normalizeText($ul.text());
                const diffRatio = wordDiffRatio(textEN, textNew);
                expect(diffRatio).to.be.greaterThan(
                    0.25,
                    `Language "${lang}" did not produce sufficient textual change`
                );
            });
        });
    });

    function normalizeText(text) {
        return text
            .replace(/\s+/g, ' ')
            .replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, '')
            .toLowerCase()
            .trim();
    }

    function wordDiffRatio(a, b) {
        const wordsA = new Set(a.split(' '));
        const wordsB = new Set(b.split(' '));
        const intersection = [...wordsA].filter(word => wordsB.has(word)).length;
        const union = new Set([...wordsA, ...wordsB]).size;
        return 1 - intersection / union; // higher ratio = more difference
    }
});
