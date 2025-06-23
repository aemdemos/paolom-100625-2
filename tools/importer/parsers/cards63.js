/* global WebImporter */
export default function parse(element, { document }) {
  // Header must exactly match the block/component name
  const headerRow = ['Cards (cards63)'];
  const rows = [];

  // Locate the card grid container
  const loopGrid = element.querySelector('.elementor-widget-loop-grid .elementor-loop-container');
  if (!loopGrid) return;
  
  // Each card is a [data-elementor-type="loop-item"]
  const cardEls = loopGrid.querySelectorAll('[data-elementor-type="loop-item"]');
  cardEls.forEach(cardEl => {
    // IMAGE CELL: First image inside the card (ignore links, use <img> directly)
    let imgEl = cardEl.querySelector('img');
    if (!imgEl) imgEl = '';
    
    // TEXT CELL: rich text below image. The colored area .card-imoveis-dados contains all relevant text.
    // We want to reference the existing element, not clone.
    let textEl = cardEl.querySelector('.card-imoveis-dados');
    if (textEl) {
      // Remove visual-only inner containers
      const dividers = textEl.querySelectorAll('.elementor-widget-divider');
      dividers.forEach(div => div.remove());
      // Remove empty elements (e.g., span with no content)
      Array.from(textEl.querySelectorAll('span')).forEach(span => {
        if(!span.textContent.trim() && span.children.length === 0) span.remove();
      });
    } else {
      // Fallback: try to get all non-image content after the <img>
      textEl = document.createElement('div');
      let foundImg = false;
      Array.from(cardEl.children).forEach(child => {
        if (child.querySelector && child.querySelector('img')) foundImg = true;
        if (foundImg && !child.querySelector('img')) textEl.appendChild(child);
      });
    }
    rows.push([imgEl, textEl]);
  });

  // Compose the table: header row + one row per card ([image, text])
  const table = WebImporter.DOMUtils.createTable([headerRow, ...rows], document);
  element.replaceWith(table);
}
