/* global WebImporter */
export default function parse(element, { document }) {
  // Get the main content columns
  const inner = element.querySelector('.e-con-inner');
  if (!inner) return;
  const columns = Array.from(inner.children).filter(el => el.classList.contains('e-con'));
  if (columns.length !== 2) return;

  // Left column: image
  let leftCell = null;
  const image = columns[0].querySelector('img');
  if (image) leftCell = image;
  else leftCell = document.createElement('div');

  // Right column: heading and text
  let rightCell = document.createElement('div');
  const heading = columns[1].querySelector('.elementor-widget-heading .elementor-heading-title');
  if (heading) rightCell.appendChild(heading);
  const textWidget = columns[1].querySelector('.elementor-widget-text-editor .elementor-widget-container');
  if (textWidget) {
    Array.from(textWidget.childNodes).forEach(node => rightCell.appendChild(node));
  }
  if (!rightCell.hasChildNodes()) rightCell = document.createElement('div');

  // Compose the block table with header as one cell, then content as two cells
  const cells = [
    ['Columns (columns11)'],
    [leftCell, rightCell]
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
