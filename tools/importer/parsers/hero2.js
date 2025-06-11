/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main content container (the first child container)
  const innerContainers = Array.from(element.querySelectorAll(':scope > .elementor-element'));
  const contentContainer = innerContainers[0] || element;

  // Extract the heading (h1-h6)
  const heading = contentContainer.querySelector('h1, h2, h3, h4, h5, h6');
  // Extract all paragraphs
  const paras = Array.from(contentContainer.querySelectorAll('p'));

  // Prepare cell content for the 3rd row
  const contentCell = [];
  if (heading) contentCell.push(heading);
  if (paras.length) contentCell.push(...paras);

  // Build the table structure: header, (optional) image, content
  const cells = [
    ['Hero'],   // Table header matches the example exactly
    [''],       // No background image in HTML, so leave empty
    [contentCell]
  ];

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the table
  element.replaceWith(table);
}
