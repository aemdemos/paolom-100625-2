/* global WebImporter */
export default function parse(element, { document }) {
  // Table header must match exactly as per the spec
  const headerRow = ['Cards (cards17)'];
  const cards = [];

  // Find all cards
  const cardNodes = element.querySelectorAll('.elementor-loop-container.elementor-grid > [data-elementor-type="loop-item"]');

  cardNodes.forEach((cardNode) => {
    // --- IMAGE CELL ---
    let imageCell = '';
    // Look for the image inside the card
    const img = cardNode.querySelector('.card-imoveis-item img');
    if (img) {
      imageCell = img;
    }

    // --- TEXT CELL ---
    // Find the data box containing the text
    let textCell = '';
    const dataBox = cardNode.querySelector('.card-imoveis-dados');
    if (dataBox) {
      // All text and structure is referenced, not cloned, preserving icons, spans, headings, etc.
      textCell = dataBox;
    }
    // If either cell is missing, gracefully skip this card
    if (imageCell && textCell) {
      cards.push([imageCell, textCell]);
    }
  });

  // Only build the table if there is at least one card
  if (cards.length) {
    const cells = [headerRow, ...cards];
    const block = WebImporter.DOMUtils.createTable(cells, document);
    element.replaceWith(block);
  } else {
    // No cards found, remove the element (or could leave as-is)
    element.remove();
  }
}