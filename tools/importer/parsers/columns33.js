/* global WebImporter */
export default function parse(element, { document }) {
  // Extract all tab title spans
  const tabSpans = Array.from(element.querySelectorAll('.e-n-tab-title-text'));
  // Edge case: if no columns, do nothing
  if (tabSpans.length === 0) return;

  // The header row must have exactly one cell (array of length 1)
  const headerRow = ['Columns (columns33)'];
  // The content row must have as many cells as there are columns (each tab title)
  const contentRow = tabSpans;

  const cells = [
    headerRow,      // Single header cell
    contentRow      // One cell per column (tab)
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
