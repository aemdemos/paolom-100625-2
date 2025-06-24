/* global WebImporter */
export default function parse(element, { document }) {
  // Header must match the example exactly:
  const headerRow = ['Cards (cards63)'];
  const rows = [headerRow];

  // Each card is a [data-elementor-type="loop-item"]
  const cardNodes = element.querySelectorAll('[data-elementor-type="loop-item"]');

  cardNodes.forEach(card => {
    // Get the image (first <img> inside a <a>)
    let img = card.querySelector('img');

    // Get the text block (the info area below the image)
    // Usually .card-imoveis-dados
    let textBlock = card.querySelector('.card-imoveis-dados');
    // Fallback: try to find a colored box (info area)
    if (!textBlock) {
      textBlock = card.querySelector('[style*="background-color"]');
    }
    // As a last resort, grab the deepest container in the card (should be info area)
    if (!textBlock) {
      const allContainers = card.querySelectorAll('[data-element_type="container"]');
      if (allContainers.length) {
        textBlock = allContainers[allContainers.length - 1];
      }
    }
    // Defensive: If neither found, skip this card
    if (!img && !textBlock) return;

    rows.push([
      img || '',
      textBlock || ''
    ]);
  });

  // If no cards found, do not replace
  if (rows.length === 1) return;
  // Use createTable as specified, referencing elements (not HTML strings)
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
