/* global WebImporter */
export default function parse(element, { document }) {
  // The provided HTML for each block is empty, so no content can be dynamically extracted.
  // However, per the requirements, the script should gracefully handle empty elements and still create the Hero (hero9) table block with only the header.
  // This matches the structure of the block, ensuring the header exactly matches the example.

  const cells = [
    ['Hero (hero9)']
    // No slide rows since there are no images or content in the input HTML.
  ];
  
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
