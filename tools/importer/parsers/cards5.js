/* global WebImporter */
export default function parse(element, { document }) {
  // Compose header row as in example
  const headerRow = ['Cards (cards5)'];

  // Find the grid that holds all the cards
  const cardsGrid = element.querySelector('.elementor-loop-container.elementor-grid');
  if (!cardsGrid) return;
  
  // Find all card elements
  const cardNodes = Array.from(cardsGrid.querySelectorAll('[data-elementor-type="loop-item"]'));

  // Build each card row
  const cardRows = cardNodes.map(card => {
    // Image: find the first <img> within the card
    let imgEl = card.querySelector('img');
    // If there's a link wrapping the image, include the <img>, not the <a>
    if (imgEl && imgEl.parentElement.tagName.toLowerCase() === 'a') {
      imgEl = imgEl;
    }

    // Text content: use the colored box inner section if available
    let textCell = null;
    const dadosBox = card.querySelector('.card-imoveis-dados');
    if (dadosBox) {
      // Use just the content inside the colored box, excluding the image
      // Prefer the '.e-con-inner' child if present
      const inner = dadosBox.querySelector('.e-con-inner');
      textCell = inner || dadosBox;
    } else {
      // fallback: use the card itself
      textCell = card;
    }
    return [imgEl, textCell];
  });

  // Compose the final table data
  const tableData = [headerRow, ...cardRows];

  const block = WebImporter.DOMUtils.createTable(tableData, document);
  element.replaceWith(block);
}
