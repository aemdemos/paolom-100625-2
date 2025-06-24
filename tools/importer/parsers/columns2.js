/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main container holding columns
  const inner = element.querySelector(':scope > .e-con-inner') || element;
  // Get all immediate children (columns)
  const columnElements = Array.from(inner.children).filter(el => el.tagName === 'DIV');

  // For each column, gather all visible content (including text nodes and all children)
  const columns = columnElements.map(colEl => {
    const colInner = colEl.querySelector(':scope > .e-con-inner') || colEl;
    const nodes = [];
    Array.from(colInner.childNodes).forEach(n => {
      if (n.nodeType === Node.ELEMENT_NODE) {
        nodes.push(n);
      } else if (n.nodeType === Node.TEXT_NODE && n.textContent.trim()) {
        const span = document.createElement('span');
        span.textContent = n.textContent;
        nodes.push(span);
      }
    });
    if (nodes.length === 1) return nodes[0];
    if (nodes.length > 1) return nodes;
    return '';
  });

  // Build the table: header row should be a single cell, then a row with as many columns as needed
  const cells = [
    ['Columns (columns2)'],
    columns
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
