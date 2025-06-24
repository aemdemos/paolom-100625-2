/* global WebImporter */
export default function parse(element, { document }) {
  // Find all card grid containers
  const gridContainers = element.querySelectorAll('.elementor-loop-container.elementor-grid');
  if (!gridContainers.length) return;

  // Gather all cards, deduplicate by data-elementor-id
  const seen = new Set();
  const cards = [];
  gridContainers.forEach(grid => {
    grid.querySelectorAll(':scope > [data-elementor-type="loop-item"], :scope > .elementor').forEach(card => {
      const cardId = card.getAttribute('data-elementor-id') || card.id;
      if (!seen.has(cardId) && card.querySelector('img')) {
        seen.add(cardId);
        cards.push(card);
      }
    });
  });
  if (!cards.length) return;

  // Build the table: header (1 col) + all card rows (2 cols)
  const rows = [
    ['Cards (cards18)']
  ];
  
  cards.forEach(card => {
    // IMAGE CELL (col 1)
    let img = card.querySelector('img');

    // TEXT CELL (col 2):
    // Try to get the unified text content block (all visible text for the card)
    let dataContainer = card.querySelector('.card-imoveis-dados .e-con-inner') || card.querySelector('.card-imoveis-dados') || null;
    let textParts = [];
    if (dataContainer) {
      // Remove dividers
      Array.from(dataContainer.querySelectorAll('.elementor-widget-divider, .elementor-divider')).forEach(div => div.remove());
      // Gather all non-empty direct children
      Array.from(dataContainer.children).forEach(child => {
        if (child.textContent.trim() !== '' || child.querySelector('a')) {
          textParts.push(child);
        }
      });
    }
    // Fallback: grab all visible text except image blocks
    if (!textParts.length) {
      let imgBlock = img ? img.closest('.elementor-widget-theme-post-featured-image, .elementor-widget-image, .card-imoveis-item') : null;
      Array.from(card.children).forEach(child => {
        if (!imgBlock || !imgBlock.contains(child)) {
          if (child.textContent.trim() !== '' || child.querySelector('a')) {
            textParts.push(child);
          }
        }
      });
    }
    // Fallback: just use dataContainer
    if (!textParts.length && dataContainer) textParts.push(dataContainer);
    if (!textParts.length) textParts.push(card);

    // Add the row (image, all text content as array or single element)
    rows.push([
      img || '',
      textParts.length === 1 ? textParts[0] : textParts
    ]);
  });

  // Create and replace
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
