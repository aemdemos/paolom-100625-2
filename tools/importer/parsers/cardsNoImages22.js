/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for the block
  const headerRow = ['Cards (cardsNoImages22)'];
  const rows = [headerRow];

  // Get all direct card containers, each represents a card (with heading and description)
  const cardContainers = Array.from(element.querySelectorAll(':scope > div'));

  for (const cardContainer of cardContainers) {
    // Find all direct children (for nested structure)
    const innerContainers = Array.from(cardContainer.querySelectorAll(':scope > div'));
    for (const inner of innerContainers) {
      // Find the heading for the card (not just the number)
      const headingWidgets = Array.from(inner.querySelectorAll('.elementor-widget-heading'));
      let titleHeading = null;
      for (const headingWidget of headingWidgets) {
        const h = headingWidget.querySelector('h1, h2, h3, h4, h5, h6');
        if (h && h.textContent.trim() && !/^\d+$/.test(h.textContent.trim())) {
          titleHeading = h;
          break;
        }
      }
      // Find the description (text editor)
      const textWidget = inner.querySelector('.elementor-widget-text-editor');
      let desc = null;
      if (textWidget) {
        const widgetContainer = textWidget.querySelector('.elementor-widget-container');
        if (widgetContainer) {
          // Find the first non-empty <p> tag
          const paragraphs = Array.from(widgetContainer.querySelectorAll('p'));
          for (const p of paragraphs) {
            if (p.textContent.trim()) {
              desc = p;
              break;
            }
          }
        }
      }
      // Compose the card row if there's content
      if (titleHeading || desc) {
        const cardCellContent = [];
        if (titleHeading) cardCellContent.push(titleHeading);
        if (desc) cardCellContent.push(desc);
        if (cardCellContent.length) {
          rows.push([cardCellContent]);
        }
      }
    }
  }

  // Only create the block table if there are card rows
  if (rows.length > 1) {
    const block = WebImporter.DOMUtils.createTable(rows, document);
    element.replaceWith(block);
  }
}
