/* global WebImporter */
export default function parse(element, { document }) {
  // Table header exactly as shown in the example
  const headerRow = ['Hero'];

  // 1. Find background image (if present)
  // It's in the second child container
  let bgImage = '';
  const containers = element.querySelectorAll(':scope > div');
  if (containers.length > 1) {
    const img = containers[1].querySelector('img');
    if (img) bgImage = img;
  }

  // 2. Gather content: heading, paragraphs, CTA button
  let contentElems = [];
  if (containers.length > 0) {
    const contentContainer = containers[0];

    // Headings (could be h1-h6)
    const heading = contentContainer.querySelector('h1, h2, h3, h4, h5, h6');
    if (heading) contentElems.push(heading);

    // Paragraphs
    const paragraphs = contentContainer.querySelectorAll('p');
    paragraphs.forEach(p => contentElems.push(p));

    // CTA button (first anchor)
    const cta = contentContainer.querySelector('a');
    if (cta) contentElems.push(cta);
  }

  // 3. Build the table: header, bg image, then content
  const cells = [
    headerRow,
    [bgImage],
    [contentElems]
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // 4. Replace original element
  element.replaceWith(table);
}
