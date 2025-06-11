/* global WebImporter */
export default function parse(element, { document }) {
  // Table header, exactly as required
  const headerRow = ['Cards (cards6)'];
  const tableRows = [headerRow];

  // Find the loop container holding cards
  const loopContainer = element.querySelector('.elementor-loop-container');
  if (!loopContainer) return;

  // Each card is a [data-elementor-type="loop-item"]
  const cards = loopContainer.querySelectorAll('[data-elementor-type="loop-item"]');
  cards.forEach(cardNode => {
    // IMAGE CELL
    let img = null;
    const imgAnchor = cardNode.querySelector('.card-imoveis-item a');
    if (imgAnchor && imgAnchor.querySelector('img')) {
      img = imgAnchor.querySelector('img');
    } else {
      // fallback: any img in .card-imoveis-item
      const imgEl = cardNode.querySelector('.card-imoveis-item img');
      if (imgEl) img = imgEl;
    }
    // TEXT CELL
    // We want to preserve content and structure, so reference the data box content
    let textCell;
    const dataBox = cardNode.querySelector('.card-imoveis-dados');
    if (dataBox) {
      // There is no need to clone; reference the real node
      textCell = dataBox;
    } else {
      // fallback: empty div to avoid missing cells
      textCell = document.createElement('div');
    }
    tableRows.push([img, textCell]);
  });

  // Create the table and replace
  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(table);
}
