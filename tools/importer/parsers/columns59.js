/* global WebImporter */
export default function parse(element, { document }) {
  // Find the inner container, which contains the column containers
  const inner = element.querySelector('.e-con-inner');
  if (!inner) return;
  // Get all immediate child containers that are columns
  const columns = Array.from(inner.children).filter((child) => child.classList.contains('e-con-full'));
  if (columns.length < 2) return;

  // Column 1 content
  let col1Content = [];
  const headingWidget = columns[0].querySelector('.elementor-widget-heading');
  if (headingWidget) {
    col1Content.push(headingWidget);
  } else {
    col1Content.push(columns[0]);
  }

  // Column 2 content
  let col2Content = [];
  const textWidget = columns[1].querySelector('.elementor-widget-text-editor');
  if (textWidget) {
    col2Content.push(textWidget);
  } else {
    col2Content.push(columns[1]);
  }

  // The header row must be a single cell (not multiple columns)
  const headerRow = ['Columns (columns59)'];
  const contentRow = [col1Content[0], col2Content[0]];

  // The second row and below should match the number of columns needed
  const cells = [headerRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
