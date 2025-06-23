/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as per spec
  const cells = [['Cards (cards49)']];

  // Find the container that holds all cards
  const cardGrid = element.querySelector('.elementor-loop-container');
  if (!cardGrid) return;
  
  // Each card is a div with .e-loop-item
  const cardNodes = cardGrid.querySelectorAll('.e-loop-item');

  cardNodes.forEach(card => {
    // COL 1: Image or icon (mandatory)
    // It is always inside .card-imoveis-item img
    let img = card.querySelector('.card-imoveis-item img');
    if (!img) {
      // fallback: any img inside card
      img = card.querySelector('img');
    }
    // Reference the actual DOM node, not clone

    // COL 2: Text content
    // The colored area with info is .card-imoveis-dados
    // This area includes status, title, location, and the feature list
    const textBox = card.querySelector('.card-imoveis-dados');
    let textCell;
    if (textBox) {
      textCell = textBox;
    } else {
      // fallback: combine text from all <ul class="elementor-post-info"> in the card
      const lists = card.querySelectorAll('ul.elementor-post-info');
      let fragment = document.createElement('div');
      lists.forEach(list => fragment.appendChild(list));
      textCell = fragment;
    }
    cells.push([
      img,
      textCell
    ]);
  });

  // Create the block table and replace original element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
