/* global WebImporter */
export default function parse(element, { document }) {
  // Prepare table rows for the Hero block as per example: 1 column, 3 rows
  // Header row must be 'Hero' (no markdown, no tags)
  const cells = [];
  cells.push(['Hero']);

  // Background image row: check for a background image (not present in this HTML), so just an empty cell
  cells.push(['']);

  // Third row: grab heading, paragraphs, button (in order)
  const content = [];

  // Heading
  const headingEl = element.querySelector('.elementor-widget-heading h1, .elementor-widget-heading h2, .elementor-widget-heading h3, .elementor-widget-heading h4, .elementor-widget-heading h5, .elementor-widget-heading h6');
  if (headingEl) {
    content.push(headingEl);
  }

  // Paragraphs
  const textEditor = element.querySelector('.elementor-widget-text-editor .elementor-widget-container');
  if (textEditor) {
    const paragraphs = Array.from(textEditor.querySelectorAll('p'));
    content.push(...paragraphs);
  }

  // Button (CTA)
  const button = element.querySelector('.elementor-widget-button a');
  if (button) {
    content.push(button);
  }

  cells.push([content]);

  // Create the table and replace element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
