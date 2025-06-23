/* global WebImporter */
export default function parse(element, { document }) {
  // Find the container holding the cards
  const cardsContainer = element.querySelector('.elementor-loop-container.elementor-grid');
  if (!cardsContainer) return;

  // Find all card elements (direct children with data-elementor-type="loop-item")
  const cardEls = Array.from(cardsContainer.querySelectorAll(':scope > [data-elementor-type="loop-item"]'));
  if (!cardEls.length) return;

  // Helper to assemble text content from .card-imoveis-dados
  function getTextCellContent(cardEl) {
    const textContainer = cardEl.querySelector('.card-imoveis-dados');
    if (textContainer) return textContainer;
    // fallback: return null if not found
    return null;
  }

  // Helper to get first img inside feature image widget
  function getImageCellContent(cardEl) {
    const imgWidget = cardEl.querySelector('.elementor-widget-theme-post-featured-image, .elementor-widget-image');
    if (imgWidget) {
      const img = imgWidget.querySelector('img');
      if (img) return img;
    }
    // fallback: return null if not found
    return null;
  }

  // Create rows for the table: header, then each card as [img, text]
  const rows = [
    ['Cards (cards57)'],
    ...cardEls.map(cardEl => [
      getImageCellContent(cardEl),
      getTextCellContent(cardEl)
    ])
  ];

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
