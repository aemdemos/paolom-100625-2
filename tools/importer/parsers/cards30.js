/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main card grid (container for cards)
  let cardGrid = element.querySelector('.elementor-loop-container.elementor-grid');
  if (!cardGrid) {
    // fallback for mobile or variations
    cardGrid = element.querySelector('.elementor-loop-container');
  }
  // fallback for any direct .e-loop-item children
  let cardElements = [];
  if (cardGrid) {
    cardElements = Array.from(cardGrid.querySelectorAll(':scope > .e-loop-item'));
  } else {
    cardElements = Array.from(element.querySelectorAll(':scope > .e-loop-item'));
  }

  // Defensive: filter empty/hidden cards
  cardElements = cardElements.filter(card => card.textContent.trim() || card.querySelector('img'));

  // Prepare header row
  const rows = [['Cards (cards30)']];

  // For each card: extract image and text block
  cardElements.forEach(card => {
    // 1. Image cell: first <img> found (reference, not clone), or ''
    const img = card.querySelector('img');
    // 2. Text cell: card info block (reference to .card-imoveis-dados), fallback to card itself (if minimal)
    let textCell = card.querySelector('.card-imoveis-dados');
    if (!textCell) {
      // For alternate markup, try direct first div without image, or fallback to all text content
      const cardChildDivs = Array.from(card.children);
      let bestText = null;
      for (let div of cardChildDivs) {
        if (!div.querySelector('img') && div.textContent.trim()) {
          bestText = div;
          break;
        }
      }
      textCell = bestText || card;
    }
    rows.push([
      img || '',
      textCell || ''
    ]);
  });

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}