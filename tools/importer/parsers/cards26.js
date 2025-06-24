/* global WebImporter */
export default function parse(element, { document }) {
  // Header for the block
  const headerRow = ['Cards (cards26)'];
  // Find the cards grid
  const grid = element.querySelector('.elementor-loop-container.elementor-grid');
  if (!grid) return;
  // Get each card item
  const cardNodes = grid.querySelectorAll('[data-elementor-type="loop-item"]');
  const rows = [headerRow];
  cardNodes.forEach((card) => {
    // Find image: only the first <img> in the card
    const img = card.querySelector('img');
    // Find the data/info element
    let info = card.querySelector('.card-imoveis-dados');
    let textElement = null;
    if (info) {
      // Remove background color so we don't accidentally import color styling
      info.removeAttribute('style');
      // Remove divider lines and empty spans/separators
      info.querySelectorAll('.elementor-widget-divider, .elementor-divider, span').forEach(el => {
        // Only remove <span> if it's empty
        if (el.matches('span') && el.textContent.trim() === '' && el.children.length === 0) {
          el.remove();
        } else if (!el.matches('span')) {
          el.remove();
        }
      });
      // Use the .e-con-inner as the main text block if present, else the info
      let inner = info.querySelector('.e-con-inner') || info;
      textElement = inner;
    } else {
      // Fallback: just use all .elementor-widget-post-info blocks
      const fallback = card.querySelectorAll('.elementor-widget-post-info');
      if (fallback.length > 0) {
        textElement = Array.from(fallback);
      } else {
        // Fallback: Use all text nodes
        textElement = document.createElement('div');
        textElement.textContent = card.textContent || '';
      }
    }
    // Always push as array for the text cell (even if single node)
    if (img && textElement) {
      rows.push([img, Array.isArray(textElement) ? textElement : [textElement]]);
    } else if (img) {
      rows.push([img, '']);
    } else if (textElement) {
      rows.push(['', Array.isArray(textElement) ? textElement : [textElement]]);
    }
  });
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
