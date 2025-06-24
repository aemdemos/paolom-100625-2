/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header as in the example
  const header = ['Hero'];
  // 2. Image/background row (empty cell as in example)
  const imageRow = [''];

  // 3. Compose content cell with heading, paragraph, button (in DOM order and as elements)
  // Find the first main content container: look for the child with heading and paragraph
  let contentCol = null;
  const immediateChildren = Array.from(element.children);
  for (const child of immediateChildren) {
    // If this child or any of its descendants contains heading and paragraph, likely the content column
    if (
      child.querySelector('h1, h2, h3, h4, h5, h6') &&
      child.querySelector('p')
    ) {
      contentCol = child;
      break;
    }
  }
  // Fallback if not found
  if (!contentCol) contentCol = element;

  // Gather all relevant content elements in DOM order
  const contentBlocks = [];
  // We want headings, paragraphs, and buttons (links), in DOM order
  const widgets = contentCol.querySelectorAll('.elementor-widget-heading, .elementor-widget-text-editor, .elementor-widget-button');
  for (const widget of widgets) {
    // Headings
    const heading = widget.querySelector('h1, h2, h3, h4, h5, h6');
    if (heading) contentBlocks.push(heading);
    // Paragraphs
    const para = widget.querySelector('p');
    if (para) contentBlocks.push(para);
    // Button/link
    const btn = widget.querySelector('a');
    if (btn) contentBlocks.push(btn);
  }

  // Fallback: if nothing found, try to gather all h[1-6], p, a from the container
  if (contentBlocks.length === 0) {
    contentCol.querySelectorAll('h1, h2, h3, h4, h5, h6, p, a').forEach(el => {
      contentBlocks.push(el);
    });
  }

  // The cell must contain all elements (array), or empty string if nothing found
  const textRow = [contentBlocks.length ? contentBlocks : ['']];

  // 4. Build the block table exactly as in the example: 1 column, 3 rows
  const table = WebImporter.DOMUtils.createTable([
    header,
    imageRow,
    textRow
  ], document);

  // 5. No section metadata is present in the example, so no <hr> or section table needed

  // 6. Replace original element with the new block
  element.replaceWith(table);
}
