/* global WebImporter */
export default function parse(element, { document }) {
  // Get the two main columns
  const columns = Array.from(element.querySelectorAll(':scope > div'));
  if (columns.length !== 2) return;

  const leftCol = columns[0];
  const rightCol = columns[1];

  // Left column: gather all text content
  const leftContentFragments = [];
  // Select all .elementor-widget-text-editor .elementor-widget-container in leftCol
  leftCol.querySelectorAll('.elementor-widget-text-editor .elementor-widget-container').forEach(widget => {
    // Append all childNodes (preserving p, ul, strong, br, etc)
    Array.from(widget.childNodes).forEach(node => {
      if (node.nodeType === Node.ELEMENT_NODE || (node.nodeType === Node.TEXT_NODE && node.textContent.trim())) {
        leftContentFragments.push(node);
      }
    });
  });
  // If nothing, add a blank div to not break table
  const leftContent = leftContentFragments.length === 1
    ? leftContentFragments[0]
    : leftContentFragments.length > 1 ? leftContentFragments : document.createElement('div');

  // Right column: image widget
  let rightContent = document.createElement('div');
  const imgWidget = rightCol.querySelector('.elementor-widget-image .elementor-widget-container');
  if (imgWidget) {
    const img = imgWidget.querySelector('img');
    if (img) {
      rightContent = img;
    }
  }

  // Table
  const cells = [
    ['Columns (columns66)'],
    [leftContent, rightContent]
  ];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
