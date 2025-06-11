/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header row: must match exactly
  const headerRow = ['Accordion (accordion18)'];

  // 2. Accordion items extraction
  const loopContainer = element.querySelector('.elementor-loop-container');
  if (!loopContainer) return;
  const items = Array.from(loopContainer.querySelectorAll('[data-elementor-type="loop-item"]'));

  const rows = items.map(item => {
    // Title cell: year + bold month
    let year = '';
    let month = '';
    const infoUl = item.querySelector('.elementor-post-info');
    if (infoUl) {
      const termItems = infoUl.querySelectorAll('.elementor-post-info__terms-list-item');
      if (termItems.length >= 2) {
        year = termItems[0].textContent.trim();
        month = termItems[1].textContent.trim();
      }
    }
    // Use a DIV for the title cell, add year and strong month if found, else empty
    const titleCell = document.createElement('div');
    if (year && month) {
      titleCell.appendChild(document.createTextNode(year + ' '));
      const strong = document.createElement('strong');
      strong.textContent = month;
      titleCell.appendChild(strong);
    } else {
      titleCell.textContent = (year || month) ? (year + ' ' + month) : '';
    }
    
    // Content cell: heading (with link), then buttons ("Ler regulamento" and "Baixar arquivo")
    // Heading (h3 with a link)
    let heading = item.querySelector('h3.elementor-heading-title');
    // Both buttons
    const btns = Array.from(item.querySelectorAll('a.elementor-button'));
    // Compose content cell
    const contentCell = document.createElement('div');
    if (heading) {
      contentCell.appendChild(heading);
    }
    if (btns.length) {
      // Place buttons in a flex row (for clarity, but style is not preserved)
      const btnWrapper = document.createElement('div');
      btns.forEach(btn => btnWrapper.appendChild(btn));
      contentCell.appendChild(btnWrapper);
    }
    return [titleCell, contentCell];
  });

  // 3. Compose and replace with table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);
  element.replaceWith(table);
}
