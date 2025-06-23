/* global WebImporter */
export default function parse(element, { document }) {
  // Find the inner wrapper that holds the columns
  const inner = element.querySelector('.e-con-inner');
  if (!inner) return;

  // Get all direct child columns (should be .e-con)
  const columnEls = Array.from(inner.querySelectorAll(':scope > .e-con'));
  if (!columnEls.length) return;

  // For each column, gather its widgets' content as an array of arrays (rows)
  // We'll support multi-row columns by finding the largest widget count across columns
  const columnsContent = columnEls.map(col => {
    // All direct child widgets in this column
    const widgets = Array.from(col.querySelectorAll(':scope > .elementor-widget'));
    // For each widget, get its .elementor-widget-container children or fallback to itself
    return widgets.map(widget => {
      const container = widget.querySelector(':scope > .elementor-widget-container');
      // Return all children (filtering whitespace-only text nodes)
      if (container) {
        const nodes = Array.from(container.childNodes).filter(n => {
          if (n.nodeType === Node.TEXT_NODE) return n.textContent.trim().length;
          if (n.nodeType === Node.ELEMENT_NODE) return n.innerHTML.replace(/\s|&nbsp;/g,'') !== '';
          return false;
        });
        // If empty, fallback to container itself
        return nodes.length ? (nodes.length === 1 ? nodes[0] : nodes) : container;
      }
      return widget;
    });
  });

  // Determine the max number of rows present in any column
  const numRows = Math.max(...columnsContent.map(col => col.length));

  // Build the header row (always single column)
  const headerRow = ['Columns (columns59)'];
  // Now, build the body rows: each row is an array of cells, one from each column
  const bodyRows = [];
  for (let i = 0; i < numRows; i++) {
    const row = columnsContent.map(colArr => {
      // For this column, get the i-th widget, or empty string if missing
      return colArr[i] !== undefined ? colArr[i] : '';
    });
    bodyRows.push(row);
  }

  // Compose the cells array
  const cells = [headerRow, ...bodyRows];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
