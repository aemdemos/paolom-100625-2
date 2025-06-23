/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as in the example: exactly one cell with correct block name
  const headerRow = ['Embed (embedVideo22)'];

  // To be flexible and always include all text/content, reference all children as a single DocumentFragment
  const fragment = document.createDocumentFragment();
  Array.from(element.children).forEach(child => fragment.appendChild(child));
  // This preserves all text, formatting, buttons, headings, etc.

  // Table structure: header, then all relevant content
  const rows = [headerRow, [fragment]];
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
