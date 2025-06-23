/* global WebImporter */
export default function parse(element, { document }) {
  // Build header row as in instructions
  const rows = [['Accordion (accordion25)']];
  // Select all accordion items: .e-loop-item
  const items = element.querySelectorAll('.e-loop-item');
  items.forEach((item) => {
    // Extract year and month (from ul.elementor-post-info)
    let year = '', month = '';
    const infoItems = item.querySelectorAll('ul.elementor-post-info .elementor-post-info__terms-list-item');
    if (infoItems.length > 0) {
      year = infoItems[0].textContent.trim();
    }
    if (infoItems.length > 1) {
      month = infoItems[1].textContent.trim();
    }
    // Title cell = e.g. '2024 Novembro' (or just whatever is present)
    const titleCell = `${year}${month ? ' ' + month : ''}`;
    // Content cell: post title + buttons (existing elements only!)
    const contentElements = [];
    // Get h3 (title with link)
    const h3 = item.querySelector('h3.elementor-heading-title');
    if (h3) contentElements.push(h3);
    // Get all buttons for this item
    const buttons = Array.from(item.querySelectorAll('a.elementor-button-link'));
    if (buttons.length > 0) {
      // Place buttons in a container div with spacing
      const btnContainer = document.createElement('div');
      btnContainer.style.display = 'flex';
      btnContainer.style.gap = '1em';
      buttons.forEach(btn => btnContainer.appendChild(btn));
      contentElements.push(btnContainer);
    }
    // Add the row: [titleCell, contentElements]
    rows.push([titleCell, contentElements]);
  });
  // Build the block and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
