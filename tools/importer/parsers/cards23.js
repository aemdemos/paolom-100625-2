/* global WebImporter */
export default function parse(element, { document }) {
  // Table header exactly as required
  const headerRow = ['Cards (cards23)'];

  // Find the grid of cards
  const grid = element.querySelector('.elementor-loop-container.elementor-grid');
  if (!grid) return;

  // Find all card items
  const cards = grid.querySelectorAll('[data-elementor-type="loop-item"]');

  // Build rows for each card
  const rows = Array.from(cards).map(card => {
    // 1. Image (first cell)
    // 2. Text/Info area (second cell)
    // Only reference existing, do not clone
    let img = card.querySelector('img');
    // Defensive: If no image, put empty string
    if (!img) img = '';

    // The colored box contains all card info: .card-imoveis-dados
    // Use its entire content, which contains headings, descriptions, icons, etc.
    let infoBox = card.querySelector('.card-imoveis-dados');
    if (!infoBox) infoBox = '';

    return [img, infoBox];
  });

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);

  element.replaceWith(table);
}
