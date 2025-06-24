/* global WebImporter */
export default function parse(element, { document }) {
  // Find the first grid container that contains cards as separate columns
  const gridContainers = Array.from(element.querySelectorAll('.elementor-loop-container.elementor-grid'));
  const grid = gridContainers.find(gc => gc.querySelector('[data-elementor-type="loop-item"]'));
  if (!grid) return;

  // Get all immediate loop-item children (these are the columns)
  const cards = Array.from(grid.children).filter(
    (child) => child.getAttribute('data-elementor-type') === 'loop-item'
  );
  if (!cards.length) return;

  // Each card becomes a single cell in the content row
  const contentRow = cards.map((card) => card);

  // The header row must have exactly one cell with the correct block name
  const headerRow = ['Columns (columns52)'];

  // Build the cells for the block table
  const cells = [
    headerRow,
    contentRow
  ];

  // Create the table and replace the original element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
