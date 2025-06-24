/* global WebImporter */
export default function parse(element, { document }) {
  // Find the actual grid for cards
  let cardsGrid = element.querySelector('.elementor-widget-loop-grid .elementor-loop-container');
  if (!cardsGrid) return;

  // Find all loop-item cards
  const cardNodes = Array.from(cardsGrid.querySelectorAll('[data-elementor-type="loop-item"]'));
  if (!cardNodes.length) return;

  const rows = [['Cards (cards62)']];

  cardNodes.forEach(cardNode => {
    // First column: get first image in cardNode (image is required)
    let img = cardNode.querySelector('img');
    if (!img) img = '';

    // Second column: gather all relevant text/info from card
    // Find the colored info box (card-imoveis-dados)
    let dataBox = cardNode.querySelector('.card-imoveis-dados');
    let textContent = '';
    if (dataBox) {
      // Use the info block as-is
      textContent = dataBox;
    } else {
      // Fallback: gather all .elementor-widget-container in the card (should not occur in this design)
      const containers = cardNode.querySelectorAll('.elementor-widget-container');
      if (containers.length) {
        let div = document.createElement('div');
        containers.forEach(cont => div.appendChild(cont));
        textContent = div;
      }
    }
    rows.push([img, textContent]);
  });

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
