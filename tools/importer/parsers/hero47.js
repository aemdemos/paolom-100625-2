/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: get immediate child containers
  const topDivs = Array.from(element.querySelectorAll(':scope > div'));

  // Find the main content container for the left side (should contain heading, address, ctas, etc)
  let mainCol = null;
  for (const div of topDivs) {
    // look for a container with a heading somewhere inside
    if (div.querySelector('h1,h2,h3,h4')) {
      mainCol = div;
      break;
    }
  }
  if (!mainCol) mainCol = element;

  // Find heading (usually h2, sometimes h1, etc)
  const heading = mainCol.querySelector('h1,h2,h3,h4');

  // Find all icon lists (address label, maps links, waze links)
  const iconLists = Array.from(mainCol.querySelectorAll('ul.elementor-icon-list-items'));
  // Find all paragraphs (address line)
  const paragraphs = Array.from(mainCol.querySelectorAll('p'));
  // Find CTA buttons
  const ctas = Array.from(mainCol.querySelectorAll('a.elementor-button'));

  // Compose the content cell as per example: heading, address label, address paragraph, map/waze links, CTA
  const contentCells = [];
  if (heading) contentCells.push(heading);
  // First icon list is typically 'Endereço' label
  if (iconLists.length > 0) contentCells.push(iconLists[0]);
  // Address paragraph (if present)
  if (paragraphs.length > 0) contentCells.push(...paragraphs);
  // Any further icon lists are map links
  if (iconLists.length > 1) {
    for (let i = 1; i < iconLists.length; i++) {
      contentCells.push(iconLists[i]);
    }
  }
  // CTA button at the end
  if (ctas.length > 0) contentCells.push(...ctas);

  // The background image cell is empty for these hero blocks (in the HTML there is no img)
  const table = [
    ['Hero'],
    [''],
    [contentCells]
  ];

  const block = WebImporter.DOMUtils.createTable(table, document);
  element.replaceWith(block);
}
