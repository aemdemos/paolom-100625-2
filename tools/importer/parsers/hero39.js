/* global WebImporter */
export default function parse(element, { document }) {
  // The example does NOT have a Section Metadata block, so no hr or metadata.

  // 1. Hero table: 1 column, 3 rows: header, background (optional: empty), content with heading.
  const headerRow = ['Hero'];
  const backgroundRow = ['']; // No background image in the HTML, so empty cell.

  // Extract the direct heading (h1-h6) from the element (or one of its children).
  let heading = '';
  // Look for any heading tags inside the element, prefer the largest (h1, then h2, ...)
  const headingEl = element.querySelector('h1, h2, h3, h4, h5, h6');
  if (headingEl) {
    heading = headingEl;
  }

  // Table rows: header, background, content
  const rows = [
    headerRow,
    backgroundRow,
    [heading || ''],
  ];

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
