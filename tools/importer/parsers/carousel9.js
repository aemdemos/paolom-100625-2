/* global WebImporter */
export default function parse(element, { document }) {
  // Both provided HTML blocks are empty: no images, no headings, no text – just an empty carousel container.
  // Edge case: Create only a 1-row table with the block header.
  const rows = [
    ['Carousel (carousel9)']
  ];
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}