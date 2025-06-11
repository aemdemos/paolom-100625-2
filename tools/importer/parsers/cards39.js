/* global WebImporter */
export default function parse(element, { document }) {
  // Find the grid container with all cards
  const grid = element.querySelector('.elementor-loop-container');
  if (!grid) return;
  const cards = Array.from(grid.children).filter(el => el.matches('[data-elementor-type="loop-item"]'));
  // Header (exactly as required)
  const cells = [
    ['Cards (cards39)']
  ];
  cards.forEach(card => {
    // IMAGE: get first image in card .card-imoveis-item (do NOT clone)
    let img = null;
    const cardItem = card.querySelector('.card-imoveis-item img');
    if (cardItem) img = cardItem;
    // CONTENT: use the .card-imoveis-dados block (do NOT clone)
    const content = card.querySelector('.card-imoveis-dados');
    // Only push row if both present (as per requirement)
    if (img && content) {
      cells.push([img, content]);
    }
  });
  // Create the table and replace
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
