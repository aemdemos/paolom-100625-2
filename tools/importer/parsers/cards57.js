/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: Get card containers
  function getCardContainers(el) {
    const loopGrid = el.querySelector('.elementor-loop-container.elementor-grid');
    if (!loopGrid) return [];
    return Array.from(loopGrid.querySelectorAll(':scope > .e-loop-item'));
  }

  // Helper: Get the card image
  function getCardImage(card) {
    const img = card.querySelector('.elementor-widget-theme-post-featured-image img');
    return img || '';
  }

  // Helper: Get the card content (text block)
  function getCardContent(card) {
    const dados = card.querySelector('.card-imoveis-dados');
    if (dados) return dados;
    const fallback = card.querySelector('.e-con-inner') || card;
    return fallback;
  }

  const cards = getCardContainers(element);
  // Prepare table rows: header row is a single cell, then card rows are arrays of 2 cells
  const rows = [];
  // Header row: single cell
  rows.push(['Cards (cards57)']);
  // Card rows: two cells (image, content)
  for (const card of cards) {
    rows.push([getCardImage(card), getCardContent(card)]);
  }

  // Create the table
  if (cards.length) {
    const table = WebImporter.DOMUtils.createTable(rows, document);

    // Ensure the header row has a single <th> spanning two columns
    // WebImporter.DOMUtils.createTable does not add colspan automatically
    const th = table.querySelector('tr th');
    if (th && cards.length) {
      th.setAttribute('colspan', '2');
    }

    element.replaceWith(table);
  }
}
