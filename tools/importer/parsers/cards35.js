/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as in example
  const headerRow = ['Cards (cards35)'];
  const cards = [];
  // Find the grid of cards
  const grid = element.querySelector('.elementor-loop-container.elementor-grid');
  if (!grid) return;
  // Each card is an immediate child with class e-loop-item
  const cardEls = Array.from(grid.children).filter(el => el.classList.contains('e-loop-item'));
  cardEls.forEach(card => {
    // 1st cell: The card image (reference the <img> only)
    let img = null;
    const imgLink = card.querySelector('.card-imoveis-item a[href]');
    if (imgLink && imgLink.querySelector('img')) {
      img = imgLink.querySelector('img');
    }
    // 2nd cell: The card detail block (reference the block, not its inner HTML)
    // We want the box with .card-imoveis-dados, but only the colored inner box
    const details = card.querySelector('.card-imoveis-dados');
    let textBlock = null;
    if (details) {
      textBlock = details;
    }
    // Only add row if both image and text block are present
    if (img && textBlock) {
      cards.push([img, textBlock]);
    }
  });
  // If no cards found, do nothing
  if (!cards.length) return;
  // Build the table rows, header first
  const cells = [headerRow, ...cards];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
