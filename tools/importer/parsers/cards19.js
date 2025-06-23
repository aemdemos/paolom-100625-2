/* global WebImporter */
export default function parse(element, { document }) {
  // Always create a single-column header row as in the example
  const headerRow = ['Cards (cards19)'];
  const rows = [headerRow];

  // Find the card grid container (allow flexible matching)
  const grid = element.querySelector('.elementor-loop-container');
  if (!grid) return;

  // Get all card nodes in the grid
  const cardNodes = Array.from(grid.children).filter(child => child.hasAttribute('data-elementor-type') && child.getAttribute('data-elementor-type') === 'loop-item');

  cardNodes.forEach(card => {
    // First cell: image (reference the <img> only, not a clone)
    const img = card.querySelector('img');
    let imgCell = img ? img : '';

    // Second cell: all card content except image, but keep the info block as a single reference
    let infoBlock = card.querySelector('.card-imoveis-dados');
    let infoCell = infoBlock ? infoBlock : '';

    rows.push([imgCell, infoCell]);
  });

  if (rows.length > 1) {
    const table = WebImporter.DOMUtils.createTable(rows, document);
    // Set correct header colspan if needed
    const tr = table.querySelector('tr');
    if (tr && tr.children.length > 1) {
      tr.children[0].setAttribute('colspan', tr.children.length);
      while (tr.children.length > 1) {
        tr.removeChild(tr.children[1]);
      }
    }
    element.replaceWith(table);
  }
}
