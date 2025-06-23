/* global WebImporter */
export default function parse(element, { document }) {
  // Header as described in the block information
  const headerRow = ['Columns (columns48)'];

  // Find the two main columns by looking for .e-con-inner, then its children
  let leftCol = null;
  let rightCol = null;
  const inner = element.querySelector(':scope > .e-con-inner');
  if (inner) {
    const containers = inner.querySelectorAll(':scope > div');
    if (containers.length >= 2) {
      leftCol = containers[0];
      rightCol = containers[1];
    }
  }

  // Defensive fallback: if not found, fallback to direct children
  if (!leftCol || !rightCol) {
    const fallbackChildren = element.querySelectorAll(':scope > div');
    if (fallbackChildren.length >= 2) {
      leftCol = fallbackChildren[0];
      rightCol = fallbackChildren[1];
    }
  }

  // LEFT COLUMN: reference all content of leftCol
  let leftCellContent = [];
  if (leftCol) {
    // Pick all direct children of leftCol's .e-con-inner (if present), else direct children
    const leftInner = leftCol.querySelector('.e-con-inner');
    if (leftInner) {
      leftCellContent = Array.from(leftInner.children);
    } else {
      leftCellContent = Array.from(leftCol.children);
    }
  }

  // RIGHT COLUMN: reference all content of rightCol
  let rightCellContent = [];
  if (rightCol) {
    // Sometimes there is no wrapper, just widgets
    rightCellContent = Array.from(rightCol.children);
  }

  // Put all contents as arrays (so that createTable appends them all to the cell)
  const tableArr = [
    headerRow,
    [leftCellContent, rightCellContent],
  ];

  const block = WebImporter.DOMUtils.createTable(tableArr, document);
  element.replaceWith(block);
}
