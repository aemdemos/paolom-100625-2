/* global WebImporter */
export default function parse(element, { document }) {
  // Get the main grid of cards
  const grid = element.querySelector('.elementor-loop-container.elementor-grid');
  if (!grid) return;
  const cards = Array.from(grid.querySelectorAll('[data-elementor-type="loop-item"]'));

  // Table header as required
  const rows = [['Cards (cards63)']];

  // For each card
  cards.forEach(card => {
    // IMAGE CELL
    let img = card.querySelector('.card-imoveis-item img');
    if (!img) {
      // fallback to any img
      img = card.querySelector('img');
    }
    // TEXT CELL
    // Find the card info area (colored box)
    let infoBox = card.querySelector('.card-imoveis-dados');
    if (!infoBox) {
      // fallback to the card itself
      infoBox = card;
    }
    rows.push([
      img ? img : '',
      infoBox
    ]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
