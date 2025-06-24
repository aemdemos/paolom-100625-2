/* global WebImporter */
export default function parse(element, { document }) {
  // Compose header row with exact block name
  const headerRow = ['Columns (columns69)'];

  // To retain semantic meaning and all text, split the form block into two columns:
  // Column 1: the heading (and any intro text)
  // Column 2: the form itself
  // We'll use the first heading in the block as column 1, and the first form as column 2

  // Find heading (h1/h2/h3/h4/h5/h6) within the block
  const headingEl = element.querySelector('h1, h2, h3, h4, h5, h6');

  // Find the first form in the block
  const formEl = element.querySelector('form');

  // Compose the left (text) column
  let leftCol = null;
  if (headingEl) {
    leftCol = headingEl;
  }

  // Compose the right (form) column
  let rightCol = null;
  if (formEl) {
    rightCol = formEl;
  }

  // If heading and form are both found, use as two columns
  // Otherwise, fall back to putting all content in one column
  let contentRow = null;
  if (leftCol && rightCol && leftCol !== rightCol) {
    contentRow = [leftCol, rightCol];
  } else {
    // Fallback: put all content in a single cell (in a fragment to preserve all text/content)
    const frag = document.createDocumentFragment();
    Array.from(element.childNodes).forEach(node => {
      frag.appendChild(node);
    });
    contentRow = [frag];
  }

  const cells = [
    headerRow,
    contentRow
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
