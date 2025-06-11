/* global WebImporter */
export default function parse(element, { document }) {
  // Get top-level columns/child containers
  const columns = Array.from(element.querySelectorAll(':scope > div'));

  // Defensive: need at least two columns for this block
  // If only one column, just output it; if none, output empty string
  let leftCol = columns[0] || document.createElement('div');
  let rightCol = columns[1] || document.createElement('div');

  // Build the table, following the example header exactly
  const cells = [
    ['Columns (columns31)'],
    [leftCol, rightCol],
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
