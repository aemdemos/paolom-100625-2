/* global WebImporter */
export default function parse(element, { document }) {
  // Find direct child containers
  const containers = Array.from(element.querySelectorAll(':scope > div'));
  let imageEl = null;
  let contentEls = [];

  // There are two main containers: one for text/button, one for image
  containers.forEach(cont => {
    const img = cont.querySelector('img');
    if (img && !imageEl) {
      imageEl = img;
    } else {
      // This is the text/button container, gather its widget containers
      const widgetContainers = Array.from(cont.querySelectorAll('.elementor-widget-container'));
      contentEls.push(...widgetContainers);
    }
  });

  // Compose content cell: preserve element order and spacing
  const contentCell = [];
  contentEls.forEach((el, idx) => {
    contentCell.push(el);
    // Add spacing (preserved visually) except after the last element
    if (idx < contentEls.length - 1) {
      contentCell.push(document.createElement('br'));
    }
  });

  // Ensure the table has the correct header from the example
  const headerRow = ['Hero'];
  // Background image row (even if empty)
  const bgRow = [imageEl ? imageEl : ''];
  // Content row (even if empty)
  const contentRow = [contentCell.length > 0 ? contentCell : ''];

  const rows = [headerRow, bgRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the block table
  element.replaceWith(table);
}
