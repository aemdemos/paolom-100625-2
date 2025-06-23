/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to collect all elements from a column container (number, title, text)
  function collectColumnContent(colContainer) {
    const result = [];
    // Find .elementor-widget-container descendants in order
    const widgets = Array.from(colContainer.querySelectorAll('.elementor-widget-container'));
    widgets.forEach(widget => {
      Array.from(widget.children).forEach(node => {
        if (node.textContent && node.textContent.trim() !== '') {
          result.push(node);
        }
      });
    });
    return result;
  }
  // Get all the direct children (5 column containers)
  const mainColumns = Array.from(element.querySelectorAll(':scope > .elementor-element'));
  // Group columns 1-3 (left cell) and 4-5 (right cell)
  const leftColumns = mainColumns.slice(0, 3).map(collectColumnContent).flat();
  const rightColumns = mainColumns.slice(3, 5).map(collectColumnContent).flat();
  // Compose table
  const headerRow = ['Columns (columns38)'];
  const contentRow = [leftColumns, rightColumns];
  const cells = [headerRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
