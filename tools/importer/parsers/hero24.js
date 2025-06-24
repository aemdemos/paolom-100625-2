/* global WebImporter */
export default function parse(element, { document }) {
  // According to the example, the table has 1 column and 3 rows:
  // 1st: Header 'Hero'
  // 2nd: Background image (optional, empty in this HTML)
  // 3rd: Content (optional, empty in this HTML)
  // There is NO Section Metadata block in the example.

  // Check for background image in the element (not present in given sample)
  // Check for content in the element (not present in given sample)
  // The structure is a container div with an empty .e-con-inner div
  // So both content rows will be empty strings.

  const cells = [
    ['Hero'],
    [''],
    [''],
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
