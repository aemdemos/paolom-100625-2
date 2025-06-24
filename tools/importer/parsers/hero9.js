/* global WebImporter */
export default function parse(element, { document }) {
  // There is no Section Metadata block in the example markdown.
  // The example markdown for these HTML blocks is:
  // +------------------------+
  // | **Hero**               |
  // +------------------------+
  // |                        |
  // +------------------------+
  // |                        |
  // +------------------------+
  // That is: 1 column x 3 rows, with header 'Hero' and two empty cells.

  // Build the table structure accordingly.
  const cells = [
    ['Hero'],
    [''],
    [''],
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
