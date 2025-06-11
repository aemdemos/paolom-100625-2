/* global WebImporter */
export default function parse(element, { document }) {
  // Find the most populated property card grid
  const grids = Array.from(element.querySelectorAll('.elementor-loop-container'));
  let grid = null;
  let maxCards = 0;
  grids.forEach(g => {
    const cards = g.querySelectorAll(':scope > [data-elementor-type="loop-item"]');
    if (cards.length > maxCards) {
      grid = g;
      maxCards = cards.length;
    }
  });
  if (!grid) return;

  // Get all card elements directly under the grid
  const cardNodes = Array.from(grid.querySelectorAll(':scope > [data-elementor-type="loop-item"]'));

  const rows = [['Cards (cards7)']];

  cardNodes.forEach(card => {
    // 1. Extract image (first <img> in card)
    const img = card.querySelector('img');

    // 2. Extract text area (card-imoveis-dados or fallback to first .e-con-inner or .e-con-child that is not image)
    let textBlock = card.querySelector('.card-imoveis-dados');
    let textCell = null;
    if (textBlock) {
      const inner = textBlock.querySelector('.e-con-inner');
      textCell = inner ? inner : textBlock;
    } else {
      // fallback: the first .e-con-inner or .e-con-child that does not contain the image
      const possibleBlocks = Array.from(card.querySelectorAll('.e-con-inner, .e-con-child'));
      textCell = possibleBlocks.find(b => !b.contains(img));
    }
    // As a last fallback, just use the card node without the image
    if (!textCell) {
      textCell = card;
    }

    // Only add rows if both image and textCell are found
    if (img && textCell) {
      rows.push([img, textCell]);
    }
  });

  // Only create the table if there are card rows
  if (rows.length > 1) {
    const table = WebImporter.DOMUtils.createTable(rows, document);
    element.replaceWith(table);
  }
}
