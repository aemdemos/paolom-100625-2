/* global WebImporter */
export default function parse(element, { document }) {
  // Find the grid container inside the block
  const grid = element.querySelector('.elementor-loop-container.elementor-grid');
  if (!grid) return;

  // Get all direct child cards (loop items)
  const cards = Array.from(grid.querySelectorAll(':scope > [data-elementor-type="loop-item"]'));

  // Table header
  const rows = [['Cards (cards57)']];

  // For each card
  cards.forEach(card => {
    // --- IMAGE COLUMN ---
    // Find the .elementor-widget-theme-post-featured-image img in card
    let img = card.querySelector('.elementor-widget-theme-post-featured-image img');
    // Only use the image element itself, not its parent <a>

    // --- TEXT COLUMN ---
    // Use the colored box with all info (class .card-imoveis-dados)
    // This box includes headings, location, rooms info, etc. as in the screenshot
    let textCol = card.querySelector('.card-imoveis-dados');
    // If missing (shouldn't be), fallback to card
    if (!textCol) textCol = card;

    rows.push([img || '', textCol || '']);
  });

  // Create and replace block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
