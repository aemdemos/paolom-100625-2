/* global WebImporter */
export default function parse(element, { document }) {
  // Header for the block table, as specified
  const headerRow = ['Cards (cards3)'];
  // Find the grid container holding all cards
  const loopGrid = element.querySelector('.elementor-loop-container.elementor-grid');
  if (!loopGrid) return;
  // Each card is a [data-elementor-type="loop-item"]
  const cards = loopGrid.querySelectorAll('[data-elementor-type="loop-item"]');
  const tableRows = [headerRow];
  cards.forEach(card => {
    // IMAGE cell: find the first <img> descendant (should always exist on these cards)
    let img = card.querySelector('img');
    // TEXT cell: find the content box (prefer .card-imoveis-dados, fallback to largest text e-con-child)
    let textContent = card.querySelector('.card-imoveis-dados');
    // As a fallback, pick the e-con.e-child with most text
    if (!textContent) {
      let maxLen = 0;
      let pick = null;
      card.querySelectorAll('.e-con.e-child').forEach(div => {
        const len = div.textContent.trim().length;
        if (len > maxLen) {
          maxLen = len;
          pick = div;
        }
      });
      textContent = pick;
    }
    // Remove divider widgets from the text cell
    if (textContent) {
      textContent.querySelectorAll('.elementor-widget-divider').forEach(divider => divider.remove());
    }
    // Add the row [img, textContent]
    tableRows.push([
      img || '',
      textContent || ''
    ]);
  });
  // Create table and replace
  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(table);
}