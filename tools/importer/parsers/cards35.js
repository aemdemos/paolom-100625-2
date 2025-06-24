/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main grid container that holds the cards
  const gridContainer = element.querySelector('.elementor-loop-container.elementor-grid');
  if (!gridContainer) return;

  // Get all the cards within the grid
  const cardNodes = Array.from(gridContainer.querySelectorAll('[data-elementor-type="loop-item"]'));
  if (cardNodes.length === 0) return;

  // Prepare the header row
  const cells = [
    ['Cards (cards35)']
  ];

  // For each card, prepare its row
  cardNodes.forEach(card => {
    // ----------- IMAGE CELL -----------
    let imgCell = null;
    // Try to find the image element inside a link
    const imgWidget = card.querySelector('.elementor-widget-theme-post-featured-image');
    if (imgWidget) {
      const img = imgWidget.querySelector('img');
      if (img) {
        imgCell = img;
      }
    }
    if (!imgCell) {
      imgCell = card.querySelector('img');
    }

    // ----------- CONTENT CELL -----------
    let contentCell = null;
    // The card-imoveis-dados container holds the content (colored background)
    const dataBox = card.querySelector('.card-imoveis-dados');
    if (dataBox) {
      // Reference existing element (do not clone!)
      contentCell = dataBox;
    } else {
      // Fallback: gather all nodes except the image widget
      contentCell = document.createElement('div');
      Array.from(card.children).forEach(child => {
        // Exclude known image containers
        if (!child.classList.contains('card-imoveis-item') && !child.classList.contains('elementor-widget-theme-post-featured-image')) {
          contentCell.appendChild(child);
        }
      });
    }

    // Add the row to the cells array, only if both cell elements are found
    // (since both image and content are mandatory for a card)
    if (imgCell && contentCell) {
      cells.push([imgCell, contentCell]);
    }
  });

  // If only the header row is present, don't create the table
  if (cells.length === 1) return;

  // Create the cards table block
  const table = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the original element with the table
  element.replaceWith(table);
}
