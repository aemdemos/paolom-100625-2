/* global WebImporter */
export default function parse(element, { document }) {
  // The header row: exactly one column, block name
  const headerRow = ['Columns (columns32)'];

  // Find the loop container and main loop-item
  const loopContainer = element.querySelector('.elementor-loop-container');
  const loopItem = loopContainer ? loopContainer.querySelector('[data-elementor-type="loop-item"]') : null;

  let leftCol = null;
  let rightCol = null;

  if (loopItem) {
    // Find the two main .e-con containers (the columns)
    // We need to guarantee leftCol = '7ff4075b' (heading/subtitle), rightCol = '42104fad' (details)
    const mainCols = loopItem.querySelectorAll(':scope > .elementor-element.e-con');
    if (mainCols.length >= 2) {
      // Find by data-id for max resilience
      mainCols.forEach(col => {
        if (col.getAttribute('data-id') === '7ff4075b') {
          leftCol = col;
        } else if (col.getAttribute('data-id') === '42104fad') {
          rightCol = col;
        }
      });
    } else if (mainCols.length === 1) {
      leftCol = mainCols[0];
    }
  }

  // Fallback: try to get by class order if data-id not present
  if ((!leftCol || !rightCol)) {
    const allCons = element.querySelectorAll('.elementor-element.e-con');
    if (allCons.length >= 2) {
      // Try to find the leftCol as the one containing a h3 (which is the city heading)
      let foundLeft = false;
      allCons.forEach(col => {
        if (!foundLeft && col.querySelector('h3')) {
          leftCol = col;
          foundLeft = true;
        }
      });
      // rightCol is any other
      allCons.forEach(col => {
        if (col !== leftCol && !rightCol) rightCol = col;
      });
    } else if (allCons.length === 1) {
      leftCol = allCons[0];
    }
  }
  // Build the row in the correct order: [leftCol, rightCol]
  const rowColumns = [];
  if (leftCol) rowColumns.push(leftCol);
  if (rightCol) rowColumns.push(rightCol);
  if (rowColumns.length === 0) rowColumns.push(element);

  const cells = [headerRow, rowColumns];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
