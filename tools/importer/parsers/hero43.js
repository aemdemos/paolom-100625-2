/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Create the table header row as in the example
  const tableRows = [
    ['Hero']
  ];

  // 2. Background image cell (row 2): In this source, there is NO <img> in the hero container, so the cell should be empty as in the example.
  tableRows.push(['']);

  // 3. Title and description cell (row 3):
  // Find the main heading (h1/h2/h3/.elementor-heading-title)
  let heading = element.querySelector('h1, h2, h3, .elementor-heading-title');
  // Find all non-empty <p> elements
  const paragraphs = Array.from(element.querySelectorAll('p')).filter(p => p.textContent.trim());

  // Compose cell content preserving order and structure
  const content = [];
  if (heading) content.push(heading);
  if (paragraphs.length) {
    if (content.length) content.push(document.createElement('br'));
    content.push(...paragraphs);
  }

  tableRows.push([content]);

  // 4. Build and replace
  const block = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(block);
}
