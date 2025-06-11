/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards35) block: 2 columns (image/icon | text), header exact.
  const headerRow = ['Cards (cards35)'];
  const rows = [headerRow];

  // Find direct card containers: only immediate children with e-con e-child
  const cardContainers = element.querySelectorAll(':scope > div > .e-con-inner > div');
  cardContainers.forEach((card) => {
    // Find the image: .elementor-widget-image img (first in this card)
    const imgElem = card.querySelector('.elementor-widget-image img');

    // Find the text: .elementor-widget-text-editor .elementor-widget-container (first in this card)
    let textElem = card.querySelector('.elementor-widget-text-editor .elementor-widget-container');
    // Fallback: If not found, use the card itself (shouldn't happen in this block)
    if (!textElem) textElem = card;

    // Only push row if there is content
    if (imgElem || textElem) {
      rows.push([
        imgElem ? imgElem : '',
        textElem ? textElem : ''
      ]);
    }
  });

  const blockTable = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(blockTable);
}
