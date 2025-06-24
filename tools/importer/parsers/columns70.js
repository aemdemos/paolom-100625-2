/* global WebImporter */
export default function parse(element, { document }) {
  // The header row must be a single cell (one column)
  const headerRow = ['Columns (columns70)'];

  // Get all direct column containers (each column is a child div inside .e-con-inner)
  const colContainers = element.querySelectorAll(':scope > .e-con-inner > div');

  // Each column will collect its content (image and heading)
  const contentRow = [];

  colContainers.forEach((col) => {
    const inner = col.querySelector(':scope > .e-con-inner');
    const colContent = [];
    if (inner) {
      const widgets = Array.from(inner.children);
      widgets.forEach((widget) => {
        const container = widget.querySelector('.elementor-widget-container');
        if (container) {
          // Add images if present
          const img = container.querySelector('img');
          if (img) {
            colContent.push(img);
          }
          // Add headings if present
          const h2 = container.querySelector('h2');
          if (h2) {
            colContent.push(h2);
          }
        }
      });
    }
    contentRow.push(colContent);
  });

  // Build the table (header row must be a single cell, then content row with as many cells as columns)
  const rows = [headerRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
