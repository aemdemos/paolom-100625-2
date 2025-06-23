/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion (accordion25) table, header exactly as specified
  const headerRow = ['Accordion (accordion25)'];
  const rows = [headerRow];

  // Each item is an .e-loop-item in the grid
  const loopItems = element.querySelectorAll('.e-loop-item');
  loopItems.forEach((loopItem) => {
    // Find year and month (the two .elementor-post-info__terms-list-item)
    const terms = loopItem.querySelectorAll('.elementor-post-info__terms-list-item');
    let titleCellContent;
    if (terms.length >= 2) {
      // Compose: <strong>YEAR</strong> MONTH
      titleCellContent = document.createElement('span');
      titleCellContent.innerHTML = `<strong>${terms[0].textContent.trim()}</strong> ${terms[1].textContent.trim()}`;
    } else if (terms.length === 1) {
      titleCellContent = document.createElement('span');
      titleCellContent.innerHTML = `<strong>${terms[0].textContent.trim()}</strong>`;
    } else {
      // Fallback: Untitled
      titleCellContent = document.createTextNode('');
    }

    // Content cell: Title link + the two buttons (existing elements, in order)
    const contentCellContent = [];
    // Title link: .elementor-heading-title a
    const headingLink = loopItem.querySelector('.elementor-heading-title a');
    if (headingLink) contentCellContent.push(headingLink);
    // The two buttons: .elementor-button-link ("Ler regulamento", "Baixar arquivo")
    const buttonLinks = loopItem.querySelectorAll('.elementor-button-link');
    buttonLinks.forEach((btn) => {
      contentCellContent.push(document.createTextNode(' '));
      contentCellContent.push(btn);
    });
    // Remove leading space if no heading link
    if (contentCellContent.length > 0 && contentCellContent[0].nodeType === Node.TEXT_NODE) {
      contentCellContent.shift();
    }
    
    rows.push([
      titleCellContent,
      contentCellContent.length === 1 ? contentCellContent[0] : contentCellContent
    ]);
  });

  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
