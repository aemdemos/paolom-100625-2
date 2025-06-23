/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as per block name
  const headerRow = ['Cards (cardsNoImages55)'];

  // FIND main heading (FICHA TÉCNICA)
  let heading = element.querySelector('h2, h1, h3');

  // FIND the leisure items text editor (Itens de lazer)
  let leisureTextDiv = null;
  const textEditors = element.querySelectorAll('.elementor-widget-text-editor .elementor-widget-container');
  for (const te of textEditors) {
    if (/Itens de lazer/i.test(te.textContent)) {
      leisureTextDiv = te;
      break;
    }
  }

  // FIND the accordion with technical data (the <details> element inside .e-n-accordion)
  let detailsEl = null;
  let accordion = element.querySelector('.e-n-accordion');
  if (accordion) {
    // Only use the first accordion item for this block
    detailsEl = accordion.querySelector(':scope > details');
  }

  // Compose the title cell
  // Per example: This is the FICHA TÉCNICA heading
  let titleCell = heading || '';

  // Compose the content cell: Leisure items + all technical data in the accordion content
  let contentCellParts = [];
  if (leisureTextDiv) {
    contentCellParts.push(leisureTextDiv);
  }
  if (detailsEl) {
    // All content after summary in detailsEl
    for (const child of detailsEl.children) {
      if (child.tagName.toLowerCase() !== 'summary') {
        contentCellParts.push(child);
      }
    }
  }

  // If there's no heading, we must not provide an empty element but keep cell non-empty
  if (!titleCell) titleCell = document.createTextNode('');
  if (contentCellParts.length === 0) contentCellParts = [''];

  // Build the table rows as per the block structure
  const rows = [
    headerRow,
    [titleCell, contentCellParts]
  ];

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(table);
}
