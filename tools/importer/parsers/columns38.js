/* global WebImporter */
export default function parse(element, { document }) {
  // The block header row, as in the example
  const headerRow = ['Columns (columns38)'];

  // Helper: for a column container, collect meaningful widgets only
  function extractCellContent(colContainer) {
    // Only take direct widget containers with content
    const widgetContainers = Array.from(colContainer.querySelectorAll(':scope .elementor-widget-container'));
    const meaningful = widgetContainers.filter(w => w.textContent.trim().length > 0 || w.querySelector('img,svg,iframe,video'));
    if (meaningful.length === 0) return '';
    return meaningful.length === 1 ? meaningful[0] : meaningful;
  }

  // Find all direct e-con container children (these are the visual columns)
  const mainCons = Array.from(element.children).filter(div => div.classList.contains('e-con'));

  // Defensive fallback: if less than 5 columns, just put all in a single row
  if (mainCons.length < 5) {
    const singleRow = mainCons.map(extractCellContent);
    const cells = [headerRow, singleRow];
    const table = WebImporter.DOMUtils.createTable(cells, document);
    element.replaceWith(table);
    return;
  }

  // Build exactly as example: first row: 3 columns, second row: 2 columns
  const firstRow = mainCons.slice(0, 3).map(extractCellContent);
  const secondRow = mainCons.slice(3, 5).map(extractCellContent);
  const cells = [headerRow, firstRow, secondRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
