/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the grid containing the cards
  const grid = element.querySelector('.elementor-loop-container');
  if (!grid) return;
  // Get all card items
  const cardNodes = grid.querySelectorAll('[data-elementor-type="loop-item"]');
  const rows = [["Cards (cards49)"]];
  cardNodes.forEach((card) => {
    // --- IMAGE CELL ---
    let imgCell = null;
    const imgWidget = card.querySelector('.elementor-widget-theme-post-featured-image');
    if (imgWidget) {
      const img = imgWidget.querySelector('img');
      if (img) {
        imgCell = img;
      }
    }
    // --- TEXT CELL ---
    let textCell = null;
    // The info panel has all the textual info nicely grouped
    const infoPanel = card.querySelector('.card-imoveis-dados');
    if (infoPanel) {
      textCell = infoPanel;
    } else {
      // fallback: group all widgets except the image widget
      const fallback = document.createElement('div');
      Array.from(card.children).forEach((child) => {
        if (!imgWidget || !imgWidget.contains(child)) {
          fallback.appendChild(child);
        }
      });
      textCell = fallback.childNodes.length > 0 ? fallback : '';
    }
    // Only add rows with both columns present
    if (imgCell && textCell) {
      rows.push([imgCell, textCell]);
    }
  });
  // Only create table if there are rows to show
  if (rows.length > 1) {
    const block = WebImporter.DOMUtils.createTable(rows, document);
    element.replaceWith(block);
  }
}
