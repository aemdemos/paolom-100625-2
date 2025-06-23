/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as defined in the example
  const headerRow = ['Search (search22)'];

  // Collect all direct children (to preserve structure and all text)
  const children = Array.from(element.children);
  const wrapper = document.createElement('div');
  children.forEach((child) => {
    wrapper.appendChild(child);
  });

  // Compose the table: header row, then all source content
  const cells = [headerRow, [wrapper]];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(table);
}