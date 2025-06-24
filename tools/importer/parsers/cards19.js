/* global WebImporter */
export default function parse(element, { document }) {
  const headerRow = ['Cards (cards19)'];

  // Find the container holding the cards
  const grid = element.querySelector('.elementor-loop-container');
  if (!grid) return;

  // Select all card elements (should be robust for multiple cards)
  const cardNodes = grid.querySelectorAll('[data-elementor-type="loop-item"]');
  if (!cardNodes.length) return;

  const rows = [headerRow];
  cardNodes.forEach(card => {
    // First column: card image (first image found in the card)
    let imgEl = card.querySelector('img');

    // Second column: all relevant text content from card
    // Use the .card-imoveis-dados .e-con-inner block if present
    let textSource = card.querySelector('.card-imoveis-dados .e-con-inner') ||
                     card.querySelector('.card-imoveis-dados') ||
                     card;
    // Gather all non-empty element children
    let textParts = [];
    Array.from(textSource.children).forEach(child => {
      if (child.textContent && child.textContent.trim().length > 0) {
        textParts.push(child);
      }
    });
    // Fallback: if no non-empty children, use the textSource itself
    if (textParts.length === 0) {
      textParts = [textSource];
    }
    rows.push([imgEl || '', textParts]);
  });
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
