/* global WebImporter */
export default function parse(element, { document }) {
  // Find the loop container that holds all cards
  const loopContainer = element.querySelector('.elementor-loop-container');
  if (!loopContainer) return;
  const cardItems = Array.from(loopContainer.querySelectorAll(':scope > .e-loop-item'));
  if (!cardItems.length) return;

  const cells = [['Cards (cards20)']];

  cardItems.forEach((card) => {
    // IMAGE CELL
    let imageCell = null;
    const imageItem = card.querySelector('.card-imoveis-item .elementor-widget-image img');
    if (imageItem) {
      imageCell = imageItem;
    }

    // TEXT CELL
    // We'll use the colored box, which contains all card details
    let textCell = null;
    const dataBox = card.querySelector('.card-imoveis-dados');
    if (dataBox) {
      textCell = dataBox;
    }

    if (imageCell && textCell) {
      cells.push([imageCell, textCell]);
    }
  });

  if (cells.length > 1) {
    const table = WebImporter.DOMUtils.createTable(cells, document);
    element.replaceWith(table);
  }
}
