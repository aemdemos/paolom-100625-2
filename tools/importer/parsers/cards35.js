/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the loop grid container
  const grid = element.querySelector('.elementor-widget-loop-grid .elementor-loop-container');
  if (!grid) return;

  // Each card is a loop-item
  const cards = Array.from(grid.querySelectorAll(':scope > div[data-elementor-type="loop-item"]'));
  if (cards.length === 0) return;

  // Table header must match example exactly
  const cells = [['Cards (cards35)']];

  cards.forEach(card => {
    // Image cell (always first column)
    let img = null;
    const imgCandidate = card.querySelector('.elementor-widget-theme-post-featured-image img');
    if (imgCandidate) {
      img = imgCandidate;
    }
    // Content cell (everything in the colored data box)
    let content = card.querySelector('.card-imoveis-dados.color-applied');
    if (!content) content = card.querySelector('.card-imoveis-dados');
    if (!content) content = document.createElement('div'); // fallback: empty div if truly missing
    cells.push([img, content]);
  });

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
