/* global WebImporter */
export default function parse(element, { document }) {
  // The block header row
  const headerRow = ['Accordion (accordion44)'];
  const rows = [headerRow];

  // Try to find all accordion pairs (header+body) inside the element
  // In this HTML structure, there's only one header and one body, but code for multiple pairs
  // Look for all .elementor-toc__header and .elementor-toc__body pairs at the top level
  const widgetContainers = element.querySelectorAll('.elementor-widget-table-of-contents');

  if (widgetContainers.length) {
    widgetContainers.forEach((widget) => {
      const tocHeader = widget.querySelector('.elementor-toc__header');
      let title = '';
      if (tocHeader) {
        // Look for h1-h6 or specific header-title
        const heading = tocHeader.querySelector('h1,h2,h3,h4,h5,h6,.elementor-toc__header-title');
        title = heading ? heading.textContent.trim() : tocHeader.textContent.trim();
      }
      const tocBody = widget.querySelector('.elementor-toc__body');
      if (title && tocBody) {
        rows.push([title, tocBody]);
      }
    });
  }

  // Fallback: if no widgets found directly, try to find a single accordion pair for minimal HTML
  if (rows.length === 1) {
    // Try to find the .elementor-toc__header and .elementor-toc__body directly under the provided element
    const tocHeader = element.querySelector('.elementor-toc__header');
    let title = '';
    if (tocHeader) {
      const heading = tocHeader.querySelector('h1,h2,h3,h4,h5,h6,.elementor-toc__header-title');
      title = heading ? heading.textContent.trim() : tocHeader.textContent.trim();
    }
    const tocBody = element.querySelector('.elementor-toc__body');
    if (title && tocBody) {
      rows.push([title, tocBody]);
    }
  }

  // Create the block table and replace the original element
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
