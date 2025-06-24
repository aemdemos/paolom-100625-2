/* global WebImporter */
export default function parse(element, { document }) {
  // Cards are top-level e-loop-item inside element
  const cards = element.querySelectorAll('.elementor-loop-container > .e-loop-item');

  const rows = [];
  const headerRow = ['Cards (cards61)'];
  rows.push(headerRow);

  cards.forEach(card => {
    // === IMAGE COLUMN ===
    // Find image: usually in .card-imoveis-item img, but fallback to first img
    let imageEl = card.querySelector('.card-imoveis-item img');
    if (!imageEl) {
      imageEl = card.querySelector('img');
    }

    // === CONTENT COLUMN ===
    // Find the card-imoveis-dados section
    let contentBlock = card.querySelector('.card-imoveis-dados');
    let contentCell;
    if (contentBlock) {
      // Use only the main content inner, not the outer padding
      let inner = contentBlock.querySelector('.e-con-inner');
      contentCell = inner ? inner : contentBlock;
    } else {
      // fallback: just use the card minus the image, if possible
      // (robust for future layout changes)
      contentCell = document.createElement('div');
      Array.from(card.children).forEach(child => {
        if (!child.contains(imageEl)) {
          contentCell.appendChild(child.cloneNode(true));
        }
      });
    }

    // Add one row (image, content cell)
    rows.push([imageEl, contentCell]);
  });

  // Create the table and replace
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
