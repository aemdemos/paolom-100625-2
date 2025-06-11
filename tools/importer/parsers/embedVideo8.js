/* global WebImporter */
export default function parse(element, { document }) {
  // Find the image within the block
  const img = element.querySelector('img');

  // The example format expects:
  // Header: Embed (embedVideo8)
  // 1 cell containing the image (no external video URL present in the HTML)
  const headerRow = ['Embed (embedVideo8)'];

  // Handle case where image might be missing
  const contentRow = [img ? img : ''];

  const cells = [
    headerRow,
    contentRow
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
