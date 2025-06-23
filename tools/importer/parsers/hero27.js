/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: create the Hero block table
  // 1. Header row matches example: 'Hero'
  const headerRow = ['Hero'];

  // 2. Background image cell: in this example, the image is applied via CSS background, not present as <img>
  // So, leave the cell empty ('')
  const backgroundImageCell = [''];

  // 3. Text content: gather any heading and paragraph(s) as in the example
  const textContent = [];
  // Only consider headings and paragraphs that are inside the element's children, as in the origin HTML
  const children = Array.from(element.querySelectorAll(':scope > div'));
  for (const child of children) {
    // Headings
    const heading = child.querySelector('h1, h2, h3, h4, h5, h6');
    if (heading) textContent.push(heading);
    // Paragraphs
    const paragraphs = child.querySelectorAll('p');
    paragraphs.forEach((p) => textContent.push(p));
  }

  // Create the block table
  const cells = [
    headerRow,
    backgroundImageCell,
    [textContent]
  ];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element with the block table
  element.replaceWith(block);
}
