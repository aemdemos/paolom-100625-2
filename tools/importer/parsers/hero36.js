/* global WebImporter */
export default function parse(element, { document }) {
  // Prepare block rows following the Hero table example (header, image placeholder, content)
  const rows = [];
  rows.push(['Hero']); // Header row exactly as in the example

  // Row for background image - not present in DOM (visual only), leave cell blank
  rows.push(['']);

  // Gather heading and subheading/paragraph
  const content = [];
  const heading = element.querySelector('h1, h2, h3, h4, h5, h6');
  if (heading) content.push(heading);
  // Find subheading/paragraph(s). Only direct children of text editor widgets
  const textEditors = element.querySelectorAll('.elementor-widget-text-editor .elementor-widget-container');
  textEditors.forEach(te => {
    Array.from(te.children).forEach(child => {
      if (child.tagName.toLowerCase() === 'p') {
        content.push(child);
      }
    });
  });
  rows.push([content]);

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
