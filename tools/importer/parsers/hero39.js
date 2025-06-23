/* global WebImporter */
export default function parse(element, { document }) {
  // According to the example, the table has 1 column and 3 rows:
  // Row 1: 'Hero' (header)
  // Row 2: background image (optional, empty if absent)
  // Row 3: Heading and block content (optional)

  // 1. HEADER: Always 'Hero'
  const headerRow = ['Hero'];

  // 2. BACKGROUND IMAGE: In this HTML, no background image is present as <img>; leave blank
  const imageRow = [''];

  // 3. Heading or content: extract heading as element
  let textContent = '';
  let headingEl = null;
  // Search for a heading element (h1-h6) inside any nested element
  const heading = element.querySelector('h1, h2, h3, h4, h5, h6');
  if (heading) {
    headingEl = heading;
  }
  const contentRow = [headingEl ? headingEl : ''];

  // Compose cells array for the block table
  const cells = [
    headerRow,
    imageRow,
    contentRow
  ];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the original element with the new block table
  element.replaceWith(block);
}
