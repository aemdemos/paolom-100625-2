/* global WebImporter */
export default function parse(element, { document }) {
  // Find the container holding the columns
  const mainInner = element.querySelector(':scope > .e-con-inner');
  if (!mainInner) return;
  const columnWrappers = mainInner.querySelectorAll(':scope > .elementor-element.e-con-boxed.e-con.e-child');

  const columns = [];
  columnWrappers.forEach((col) => {
    const colInner = col.querySelector(':scope > .e-con-inner');
    if (!colInner) {
      columns.push('');
      return;
    }
    const widgets = Array.from(colInner.children);
    const cellContent = [];
    widgets.forEach((widget) => {
      const container = widget.querySelector('.elementor-widget-container');
      if (container) {
        container.childNodes.forEach((n) => {
          if (n.nodeType === 3) { // TEXT_NODE
            if (n.textContent.trim()) cellContent.push(document.createTextNode(n.textContent));
          } else {
            cellContent.push(n);
          }
        });
      }
    });
    if (!cellContent.length) {
      columns.push('');
    } else {
      columns.push(cellContent);
    }
  });
  // Construct the rows for the table
  // First row: a single cell (header)
  // Second row: one cell per column
  const rows = [
    ['Columns (columns28)'],
    columns
  ];
  // Use createTable, then set colspan on the header cell
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Set colspan on the header cell to span all columns
  const headerRow = table.querySelector('tr');
  if (headerRow && headerRow.children.length === 1) {
    headerRow.children[0].setAttribute('colspan', String(columns.length));
  }
  element.replaceWith(table);
}
