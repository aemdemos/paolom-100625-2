/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header row must match the example EXACTLY
  const headerRow = ['Hero'];

  // 2. Extract content from the element
  // The structure is: left side text (heading, paragraph), right side image (SVG map)

  // To support all variations, collect all headings and paragraphs in order, and the first img

  let imgEl = null;
  const contentEls = [];

  // Look for all child containers in order
  const containers = element.querySelectorAll(':scope > .e-con-inner > div');
  containers.forEach((container) => {
    // Look for heading (h1-h6) inside any heading widget
    const headingWidget = container.querySelector('.elementor-widget-heading');
    if (headingWidget) {
      const h = headingWidget.querySelector('h1, h2, h3, h4, h5, h6');
      if (h) contentEls.push(h);
    }
    // Look for paragraphs inside text-editor widget
    const textWidget = container.querySelector('.elementor-widget-text-editor');
    if (textWidget) {
      // Find all paragraphs in order
      const pList = textWidget.querySelectorAll('p');
      pList.forEach(p => {
        // Only add if not empty
        if (p.textContent.trim()) {
          contentEls.push(p);
        }
      });
    }
    // Look for image inside image widget
    if (!imgEl) {
      const imgWidget = container.querySelector('.elementor-widget-image img');
      if (imgWidget) {
        imgEl = imgWidget;
      }
    }
  });

  // 3. Assemble table rows
  // Row 1: block header, Row 2: image or empty, Row 3: heading+paragraphs or empty
  const cells = [
    headerRow,
    [imgEl || ''],
    [contentEls.length > 0 ? contentEls : ''],
  ];

  // 4. Create and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
