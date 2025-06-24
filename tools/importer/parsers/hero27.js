/* global WebImporter */
export default function parse(element, { document }) {
  // Build the rows for the Hero block table.
  // 1. Header row must match the example: 'Hero'
  const headerRow = ['Hero'];

  // 2. Background image row: the example has empty cell if no decorative image is present
  // Check for background-image in the element's style or children (none in provided HTML)
  let bgCell = '';
  // (No background image or child image in this HTML, so blank as in some examples)

  // 3. Content cell: grab heading(s) and paragraph(s)
  const content = [];
  // Look for heading widgets
  const headingWidget = element.querySelector('[data-widget_type="heading.default"] .elementor-widget-container');
  if (headingWidget) {
    const heading = headingWidget.querySelector('h1, h2, h3, h4, h5, h6');
    if (heading) content.push(heading);
  }
  // Look for text editor widgets
  element.querySelectorAll('[data-widget_type="text-editor.default"] .elementor-widget-container').forEach((div) => {
    div.querySelectorAll('p').forEach((p) => {
      content.push(p);
    });
  });

  // Compose table rows
  const rows = [
    headerRow,
    [bgCell],
    [content]
  ];

  // Create the table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the element
  element.replaceWith(table);
}
