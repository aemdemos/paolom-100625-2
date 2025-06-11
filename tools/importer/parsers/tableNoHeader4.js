/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row per requirements
  const headerRow = ['Table (no header, tableNoHeader4)'];
  const rows = [];

  // Find all filter buttons inside the element
  // Get all direct child divs
  const childDivs = element.querySelectorAll(':scope > div');
  for (const div of childDivs) {
    // Try to find <button class="e-filter-item"> inside this div
    const button = div.querySelector('button.e-filter-item');
    if (button) {
      // Get the button's textContent as a cell
      const text = button.textContent.trim();
      if (text) {
        rows.push([text]);
      }
    }
  }

  // Only build and replace if there is at least one row
  if (rows.length > 0) {
    const table = WebImporter.DOMUtils.createTable([
      headerRow,
      ...rows
    ], document);
    element.replaceWith(table);
  }
}