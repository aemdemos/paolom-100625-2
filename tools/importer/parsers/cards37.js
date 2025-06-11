/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as in the example
  const headerRow = ['Cards (cards37)'];
  const tableRows = [];

  // Find all cards (each with data-elementor-type="loop-item")
  const loopItems = element.querySelectorAll('[data-elementor-type="loop-item"]');

  loopItems.forEach((item) => {
    // Get first image in the card
    const img = item.querySelector('img');
    // If no image, don't add row
    if (!img) return;
    
    // Find the info block: card-imoveis-dados (the colored content box)
    let info = item.querySelector('.card-imoveis-dados');
    // Fallback to most inner .e-con-inner if not present (robustness)
    if (!info) {
      const allInner = item.querySelectorAll('.e-con-inner');
      if (allInner.length > 0) {
        info = allInner[allInner.length - 1]; // Use the deepest one
      }
    }
    // If still not found, skip card (should not happen in these examples)
    if (!info) return;
    
    // Table row as [image, content box] referencing existing elements
    tableRows.push([img, info]);
  });

  if (tableRows.length === 0) {
    // No valid cards; remove element, do not create a block
    element.remove();
    return;
  }

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...tableRows
  ], document);

  element.replaceWith(table);
}
