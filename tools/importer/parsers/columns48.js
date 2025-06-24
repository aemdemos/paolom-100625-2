/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as in the example
  const headerRow = ['Columns (columns48)'];
  // Get direct children representing columns
  // In this structure, the first column is the address/label/left, the second is the right column (the list)
  let leftCol = null;
  let rightCol = null;
  // Find columns by class
  const firstCol = element.querySelector(
    ':scope > .e-con-inner > .endereco-left-col'
  );
  leftCol = firstCol ? firstCol : null;
  // The right column is the other direct child (but not .endereco-left-col)
  const allCols = Array.from(element.querySelectorAll(':scope > .e-con-inner > div'));
  rightCol = allCols.find((col) => col !== leftCol);

  // Defensive: fallback if structure changes
  if (!leftCol && allCols.length > 0) leftCol = allCols[0];
  if (!rightCol && allCols.length > 1) rightCol = allCols[1];

  // For each column, grab the content container for resilience
  function getColumnContent(col) {
    if (!col) return document.createElement('div');
    const inner = col.querySelector(':scope > .e-con-inner');
    if (inner) return inner;
    return col;
  }

  const leftContent = getColumnContent(leftCol);
  const rightContent = getColumnContent(rightCol);

  // Compose table rows
  const cells = [
    headerRow,
    [leftContent, rightContent],
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
