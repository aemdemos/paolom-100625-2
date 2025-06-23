/* global WebImporter */
export default function parse(element, { document }) {
  // HERO block: 1 column, 3 rows: Header, Background image (optional), Content (heading, text, CTA)

  // 1. Header row
  const headerRow = ['Hero'];

  // 2. Background image (optional); in this HTML, there is no img in the hero background.
  // So, cell is empty (must be present as a row)
  let backgroundImageCell = [''];

  // 3. Content: get heading, paragraphs, CTA in order
  const contentElements = [];

  // Find the heading (INVESTIDORES)
  const heading = element.querySelector('.elementor-widget-heading .elementor-heading-title');
  if (heading) contentElements.push(heading);

  // Find paragraphs (text-editor)
  const textWidget = element.querySelector('.elementor-widget-text-editor .elementor-widget-container');
  if (textWidget) {
    // Append each direct paragraph
    Array.from(textWidget.children).forEach(child => {
      contentElements.push(child);
    });
  }

  // Find CTA button (if present)
  const cta = element.querySelector('.elementor-widget-button a');
  if (cta) {
    contentElements.push(cta);
  }

  // Ensure at least one content node is present to avoid an empty row (shouldn't occur for this block)

  // Assemble table
  const cells = [
    headerRow,
    backgroundImageCell,
    [contentElements]
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
