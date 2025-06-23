/* global WebImporter */
export default function parse(element, { document }) {
  // Block header row
  const headerRow = ['Cards (cards26)'];
  const cells = [headerRow];

  // 1. Find the card grid container
  const grid = element.querySelector('.elementor-loop-container');
  if (!grid) return;

  // 2. Find all card items
  const cards = grid.querySelectorAll('[data-elementor-type="loop-item"]');
  if (!cards.length) return;

  // 3. For each card, extract the image and the text cell
  cards.forEach(card => {
    // Get the first image in the card as the image cell
    const img = card.querySelector('img');

    // For the text cell, select the .card-imoveis-dados container if present
    let textCell = card.querySelector('.card-imoveis-dados');
    // Fallback: try to find a container that looks like text
    if (!textCell) {
      // If not found, extract all possible text containers except image block
      // This is a fallback, but should not normally be used for this structure
      const possibleTextContainers = Array.from(card.children).filter(child => !child.contains(img));
      textCell = possibleTextContainers.length === 1 ? possibleTextContainers[0] : possibleTextContainers;
    }

    // Always reference existing elements, not clones
    cells.push([
      img || '',
      textCell || '',
    ]);
  });

  // 4. Create the table and replace the original element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
