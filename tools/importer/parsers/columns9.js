/* global WebImporter */
export default function parse(element, { document }) {
  // Find column containers
  const inner = element.querySelector('.e-con-inner');
  if (!inner) return;
  const columns = inner.querySelectorAll(':scope > .elementor-element.e-con');
  if (columns.length !== 2) return;

  // --- LEFT COLUMN ---
  const leftCol = columns[0];
  // Reference the image element directly if it exists
  let leftImg = null;
  const imgWidget = leftCol.querySelector('.elementor-widget-image');
  if (imgWidget) {
    leftImg = imgWidget.querySelector('img');
  }

  // --- RIGHT COLUMN ---
  const rightCol = columns[1];
  // Heading
  let headingEl = null;
  const headingWidget = rightCol.querySelector('.elementor-widget-heading');
  if (headingWidget) {
    headingEl = headingWidget.querySelector('h1, h2, h3, h4, h5, h6');
  }
  // Text (all paragraphs)
  let textEls = [];
  const textWidget = rightCol.querySelector('.elementor-widget-text-editor');
  if (textWidget) {
    textEls = Array.from(textWidget.querySelectorAll('p'));
  }
  // Build content for the right cell (preserve heading and paragraphs)
  const rightCell = document.createElement('div');
  if (headingEl) rightCell.appendChild(headingEl);
  textEls.forEach(p => rightCell.appendChild(p));

  // Build table structure
  const rows = [
    ['Columns (columns9)'],
    [leftImg, rightCell]
  ];
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
