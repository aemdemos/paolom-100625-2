/* global WebImporter */
export default function parse(element, { document }) {
  // Header row must exactly match example
  const headerRow = ['Hero'];

  // No background image in input HTML, so leave blank as in example
  const bgRow = [''];

  // Content row: Gather all relevant content (headings, form block, etc)
  // We'll collect all direct children of the main content area
  // The main content is the `.e-con-inner` div
  const inner = element.querySelector(':scope > .e-con-inner');
  let contentCell = '';
  if (inner) {
    // Collect all direct children (the two columns/rows)
    const contentParts = [];
    inner.childNodes.forEach(child => {
      // Only element nodes
      if (child.nodeType === Node.ELEMENT_NODE) {
        // For each child (likely .e-con), collect its full content
        contentParts.push(child);
      }
    });
    contentCell = contentParts;
  } else {
    // Fallback: just use the original element's content
    contentCell = [element];
  }

  // Compose the block table
  const cells = [
    headerRow,
    bgRow,
    [contentCell]
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the new table block
  element.replaceWith(table);
}
