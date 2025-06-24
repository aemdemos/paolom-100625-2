/* global WebImporter */
export default function parse(element, { document }) {
  // Table header exactly as required
  const headerRow = ['Cards (cards10)'];

  // Get the card containers - must only select direct card rows
  // Each card: e-con-full, e-flex, e-con, e-child
  // Always nested inside .e-con-inner, but let's make this resilient
  let cardParents = [];
  const boxed = element.querySelector('.e-con-boxed .e-con-inner');
  if (boxed) {
    cardParents = Array.from(boxed.children).filter(
      (el) => el.classList.contains('e-con-full') && el.classList.contains('e-child')
    );
  } else {
    // fallback: perhaps direct children?
    cardParents = Array.from(element.querySelectorAll(':scope > div')).filter(
      (el) => el.classList.contains('e-con-full') && el.classList.contains('e-child')
    );
  }

  const rows = cardParents.map((card) => {
    // Find image widget in this card
    const imgWidget = card.querySelector('.elementor-widget-image img');
    // Find text widget in this card
    // The .elementor-widget-text-editor may wrap the actual .elementor-widget-container
    let textWidget = card.querySelector('.elementor-widget-text-editor .elementor-widget-container');
    if (!textWidget) {
      // fallback: check for .elementor-widget-text-editor directly
      textWidget = card.querySelector('.elementor-widget-text-editor');
    }
    // If still not found, fallback to the card itself, so nothing is missed
    const imgCell = imgWidget || '';
    const textCell = textWidget || '';
    return [imgCell, textCell];
  });

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);

  element.replaceWith(table);
}
