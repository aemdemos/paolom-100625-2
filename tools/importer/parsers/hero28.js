/* global WebImporter */
export default function parse(element, { document }) {
  // Build the Hero block table as per spec: header, background (empty), content
  const cells = [];
  // Header as in the example
  cells.push(['Hero']);
  // Background image cell (empty, none in provided HTML)
  cells.push(['']);
  // Content cell
  const content = [];

  // Find heading (prefer h1-h3), use first found
  const heading = element.querySelector('h1, h2, h3, h4, h5, h6');
  if (heading) content.push(heading);

  // Find subheading/paragraph (first <p>)
  const paragraph = element.querySelector('p');
  if (paragraph) content.push(paragraph);

  // Find the first visible CTA link (a with href not '#'), if any
  const ctaButton = Array.from(element.querySelectorAll('a.elementor-button')).find(a => a.getAttribute('href') && a.getAttribute('href') !== '#');
  if (ctaButton) content.push(ctaButton);

  cells.push([content]);

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
