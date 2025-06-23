/* global WebImporter */
export default function parse(element, { document }) {
  // Get the two main columns: left (.endereco-left-col) and right (the other main container)
  let leftCol = null;
  let rightCol = null;

  // In this Elementor structure, there is a wrapping .e-con-inner containing the two columns
  const inner = element.querySelector(':scope > .e-con-inner');
  let children = [];
  if (inner) {
    children = Array.from(inner.children);
  } else {
    // fallback: if .e-con-inner is missing, use direct children
    children = Array.from(element.children);
  }

  // Try to find left and right columns
  leftCol = children.find((div) => div.classList.contains('endereco-left-col'));
  rightCol = children.find((div) => !div.classList.contains('endereco-left-col'));

  // Extract content from left column
  let leftContent;
  if (leftCol) {
    const leftInner = leftCol.querySelector(':scope > .e-con-inner') || leftCol;
    leftContent = document.createElement('div');
    Array.from(leftInner.children).forEach(child => {
      leftContent.appendChild(child);
    });
  } else {
    leftContent = document.createTextNode('');
  }

  // Extract content from right column
  let rightContent;
  if (rightCol) {
    const rightInner = rightCol.querySelector(':scope > .e-con-inner') || rightCol;
    rightContent = document.createElement('div');
    Array.from(rightInner.children).forEach(child => {
      rightContent.appendChild(child);
    });
  } else {
    rightContent = document.createTextNode('');
  }

  // Create table with a single header cell (colspan handled after table creation)
  const cells = [
    ['Columns (columns48)'],
    [leftContent, rightContent]
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Fix: Make the header cell span both columns (colspan=2)
  const headerRow = table.querySelector('tr');
  if (headerRow && headerRow.children.length === 1) {
    headerRow.firstElementChild.setAttribute('colspan', '2');
  }

  element.replaceWith(table);
}
