/* global WebImporter */
export default function parse(element, { document }) {
  // Find all immediate container children representing columns
  const columns = Array.from(element.querySelectorAll(':scope > div'));

  // Build the content row: one cell per column, each cell gets the content of that column
  const cellsRow = columns.map((col) => {
    const fragment = document.createDocumentFragment();
    // Only select direct widget children (no grandchild containers)
    const widgets = Array.from(col.querySelectorAll(':scope > div'));
    widgets.forEach((widget) => {
      const container = widget.querySelector('.elementor-widget-container');
      if (container) {
        // Move all content from container into the fragment (maintain references)
        while (container.firstChild) {
          fragment.appendChild(container.firstChild);
        }
      }
    });
    return fragment;
  });

  // Header row: exactly one cell, per requirements
  const tableRows = [
    ['Columns (columns41)'],
    cellsRow
  ];

  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(table);
}
