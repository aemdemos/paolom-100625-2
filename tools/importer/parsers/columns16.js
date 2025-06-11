/* global WebImporter */
export default function parse(element, { document }) {
  // Get the .e-con-inner child (if present), else the element itself
  const inner = element.querySelector(':scope > .e-con-inner') || element;
  // Get immediate child containers (columns)
  const columnDivs = Array.from(inner.querySelectorAll(':scope > .elementor-element'));

  // Prepare left and right columns
  // LEFT: Heading (the left, vertical text)
  let leftContent = null;
  if (columnDivs.length > 0) {
    const headingWidget = columnDivs[0].querySelector('.elementor-widget-heading .elementor-widget-container');
    leftContent = headingWidget ? headingWidget : columnDivs[0];
  }

  // RIGHT: Text content (the right, multiple paragraphs)
  let rightContent = null;
  if (columnDivs.length > 1) {
    const textWidget = columnDivs[1].querySelector('.elementor-widget-text-editor .elementor-widget-container');
    rightContent = textWidget ? textWidget : columnDivs[1];
  }

  // Header row: a single cell, which should span all columns
  // We'll use the createTable API as specified: pass a single-cell array for the header row
  const headerRow = ['Columns (columns16)'];
  // Content row: as many cells as needed (here, 2 columns)
  const contentRow = [leftContent, rightContent];

  // Build the table data
  const cells = [
    headerRow, // single cell (header)
    contentRow // two columns (content)
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
