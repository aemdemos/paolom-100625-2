/* global WebImporter */
export default function parse(element, { document }) {
  // Find the element that contains all the cards
  const grid = element.querySelector('.elementor-loop-container.elementor-grid');
  if (!grid) return;

  const rows = [['Cards (cards19)']];

  // Each card is a child with data-elementor-type="loop-item"
  const cardNodes = grid.querySelectorAll('[data-elementor-type="loop-item"]');
  cardNodes.forEach((cardNode) => {
    // --- Image cell: get first image element
    const imgEl = cardNode.querySelector('img');

    // --- Text cell: get text container, prefer .card-imoveis-dados .e-con-inner
    let textContainer = cardNode.querySelector('.card-imoveis-dados .e-con-inner');
    if (!textContainer) {
      textContainer = cardNode.querySelector('.card-imoveis-dados');
    }
    if (!textContainer) {
      // fallback: collect everything except the image
      textContainer = document.createElement('div');
      Array.from(cardNode.children).forEach(child => {
        if (!child.querySelector('img')) {
          textContainer.appendChild(child);
        }
      });
    }
    if (!textContainer || !textContainer.textContent.trim()) {
      textContainer = cardNode;
    }
    rows.push([imgEl, textContainer]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
