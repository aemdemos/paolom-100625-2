/* global WebImporter */
export default function parse(element, { document }) {
  // Get the two main columns (first and second)
  let columns = [];
  // Try to get direct children from .e-con-inner, else fallback
  const inner = element.querySelector(':scope > .e-con-inner');
  let colElements;
  if (inner) {
    colElements = inner.querySelectorAll(':scope > div');
  } else {
    colElements = element.querySelectorAll(':scope > div');
  }
  if (colElements.length < 2) {
    // Not enough columns to form a two-column block, use whatever is available in one cell
    const table = WebImporter.DOMUtils.createTable([
      ['Columns (columns2)'],
      [element],
    ], document);
    element.replaceWith(table);
    return;
  }
  // For each column, collect all relevant block content as a wrapper div
  for (let i = 0; i < 2; i++) {
    const col = colElements[i];
    // gather all children inside .e-con-inner if present
    let colInner = col.querySelector(':scope > .e-con-inner');
    let colChildren;
    if (colInner) {
      colChildren = Array.from(colInner.children);
    } else {
      colChildren = Array.from(col.children);
    }
    // Group all children into a div for structure
    const wrapper = document.createElement('div');
    colChildren.forEach(child => wrapper.appendChild(child));
    columns.push(wrapper);
  }
  // Compose table cells as per block definition
  // Fix: header is a single cell (not columns.length cells)
  const cells = [
    ['Columns (columns2)'],
    columns,
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
