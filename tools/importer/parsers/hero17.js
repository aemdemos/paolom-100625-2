/* global WebImporter */
export default function parse(element, { document }) {
  // Find the hero image: typically the first significant image at the top level
  let img = null;
  // Search among top-level children for .elementor-widget-image img
  const topDivs = Array.from(element.querySelectorAll(':scope > div'));
  for (const div of topDivs) {
    const foundImg = div.querySelector('.elementor-widget-image img');
    if (foundImg) { img = foundImg; break; }
  }
  // Fallback: any img in a top-level child
  if (!img) {
    for (const div of topDivs) {
      const foundImg = div.querySelector('img');
      if (foundImg) { img = foundImg; break; }
    }
  }
  // Fallback: any img at all
  if (!img) img = element.querySelector('img');

  // Find the main heading: prefer a heading widget, fallback to h1/h2/h3
  let heading = null;
  // Look for .elementor-widget-heading h1|h2|h3 among top-level children
  for (const div of topDivs) {
    const foundHeading = div.querySelector('.elementor-widget-heading h1, .elementor-widget-heading h2, .elementor-widget-heading h3');
    if (foundHeading) { heading = foundHeading; break; }
  }
  // Fallback: any h1/h2/h3 in element
  if (!heading) heading = element.querySelector('h1, h2, h3');
  // Fallback: any strong
  if (!heading) heading = element.querySelector('strong');

  // Build the table cells: [header], [image], [heading]
  const cells = [
    ['Hero'], // Header row exactly as in the example
    [img ? img : ''],
    [heading ? heading : '']
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
