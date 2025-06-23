/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: get all direct inner containers (parent is .e-con-inner)
  const inner = element.querySelector('.e-con-inner');
  if (!inner) {
    element.replaceWith(WebImporter.DOMUtils.createTable([
      ['Hero'],
      [''],
      [''],
    ], document));
    return;
  }
  const blocks = Array.from(inner.children);

  // There are two main rows in the visual layout:
  // 1. Logo + subheading (first .e-con)
  // 2. Heading + paragraph (second .e-con)
  // We want:
  //  - 1st row: header ['Hero']
  //  - 2nd row: logo (image) if present
  //  - 3rd row: everything else: heading(s), subheading(s), paragraph(s) etc.

  let logoImg = '';
  let textContent = [];

  // First block: may contain logo image and tagline
  if (blocks[0]) {
    // Find img inside this block
    const logo = blocks[0].querySelector('img');
    if (logo) {
      logoImg = logo;
    }
    // Find subheading: look for p after logo, or any text
    const subheadWidget = blocks[0].querySelector('.elementor-widget-text-editor p');
    if (subheadWidget) {
      textContent.push(subheadWidget);
    }
  }
  // Second block: heading(s) and paragraph(s)
  if (blocks[1]) {
    // Get all headings (h1-h6) in order
    const heading = blocks[1].querySelector('.elementor-widget-heading h1, .elementor-widget-heading h2, .elementor-widget-heading h3, .elementor-widget-heading h4, .elementor-widget-heading h5, .elementor-widget-heading h6');
    if (heading) {
      textContent.push(heading);
    }
    // Get all paragraphs
    const paraWidget = blocks[1].querySelector('.elementor-widget-text-editor p');
    if (paraWidget) {
      textContent.push(paraWidget);
    }
  }
  // If there is no logo, the second row must be empty string
  const secondRow = logoImg ? [logoImg] : [''];
  // If no text content, cell must be empty string
  const thirdRow = textContent.length ? [textContent] : [''];

  // Compose rows
  const rows = [
    ['Hero'],
    secondRow,
    thirdRow,
  ];

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
