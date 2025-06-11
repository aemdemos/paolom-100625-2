/* global WebImporter */
export default function parse(element, { document }) {
  // Find the content container
  const inner = element.querySelector('.e-con-inner');
  let columns = [];
  if (inner) {
    // Get all direct children of .e-con-inner
    const colDivs = inner.querySelectorAll(':scope > div');
    // For this specific HTML, only one colDiv has content
    colDivs.forEach((col) => {
      // Gather all visible content in this column
      const cellContent = [];
      // Headings
      const heading = col.querySelector('h1, h2, h3, h4, h5, h6');
      if (heading) cellContent.push(heading);
      // Paragraphs
      col.querySelectorAll('p').forEach(p => cellContent.push(p));
      // Buttons (links)
      col.querySelectorAll('a.elementor-button-link').forEach(a => cellContent.push(a));
      // Only add non-empty columns
      if (cellContent.length > 0) {
        // If only one element, use it directly, otherwise use array
        columns.push(cellContent.length === 1 ? cellContent[0] : cellContent);
      }
    });
  }
  // Fallback: if no columns found, just push empty ('')
  if (columns.length === 0) columns = [''];
  // --- Only make as many columns as content is detected! ---
  const cells = [
    ['Columns (columns19)'],
    columns // This will be a single cell array for this input
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
