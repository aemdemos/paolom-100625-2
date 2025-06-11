/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main container that holds the grid of cards
  const grid = element.querySelector('.elementor-loop-container.elementor-grid');
  if (!grid) return;

  // Each card is an element with the class 'e-loop-item'
  const cardEls = Array.from(grid.querySelectorAll(':scope > .e-loop-item'));
  if (!cardEls.length) return;

  const headerRow = ['Cards (cards11)'];
  const rows = cardEls.map(card => {
    // Image cell: find the first image (should always be present in .card-imoveis-item or anywhere inside the card)
    let img = card.querySelector('.card-imoveis-item img');
    if (!img) img = card.querySelector('img');
    // If there is no image at all, leave it empty
    let imgCell = img || '';

    // Content cell: the colored box with all the info, always with class .card-imoveis-dados
    let contentBox = card.querySelector('.card-imoveis-dados');
    if (!contentBox) {
      // fallback: find first div with some inline background color
      contentBox = Array.from(card.querySelectorAll('div')).find(div => div.style && div.style.backgroundColor);
    }
    // If still not found, fallback to the card root (should not happen in this HTML)
    let textCell = contentBox || '';
    return [imgCell, textCell];
  });

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);
  element.replaceWith(table);
}
