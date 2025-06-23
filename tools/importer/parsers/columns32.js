/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Check for the main loop item (for resilience to possible variations)
  const loopContainer = element.querySelector('.elementor-loop-container');
  if (!loopContainer) return;
  // Find the actual loop item (the card block)
  const loopItem = loopContainer.querySelector('.e-loop-item');
  if (!loopItem) return;

  // The two primary columns are the first two direct children of the loop item
  // Find all direct children of loopItem that are containers
  const containers = Array.from(loopItem.children).filter((child) =>
    child.classList.contains('elementor-element') && child.classList.contains('e-con')
  );

  // Defensive: If less than two columns found, abort
  if (containers.length < 2) return;

  // LEFT COLUMN: City title and subtitle (address summary)
  const leftCol = containers[0];
  // RIGHT COLUMN: Details, icons, links, address
  const rightCol = containers[1];

  // Reference the leftCol and rightCol containers as cells in the table
  // (No need to clone: referencing elements directly is correct here)

  // TABLE HEADER: Must be exactly as required
  const headerRow = ['Columns (columns32)'];

  // TABLE ROWS: The left and right columns
  const tableRows = [
    headerRow,
    [leftCol, rightCol]
  ];

  // Create the table
  const table = WebImporter.DOMUtils.createTable(tableRows, document);

  // Replace the original element with the table
  element.replaceWith(table);
}
