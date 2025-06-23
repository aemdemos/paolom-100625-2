/* global WebImporter */
export default function parse(element, { document }) {
  // Get direct children to distinguish content column and image column
  const children = Array.from(element.querySelectorAll(':scope > div'));
  let contentDiv = null;
  let imageDiv = null;

  // Heuristics: The div with image is the one with an <img>, content is the other
  children.forEach((child) => {
    if (child.querySelector('img')) {
      imageDiv = child;
    } else {
      contentDiv = child;
    }
  });

  // Extract the image element for hero background (optional)
  let imgEl = null;
  if (imageDiv) {
    imgEl = imageDiv.querySelector('img');
  }

  // Gather all content bits for the text/cta column
  const contentBits = [];
  if (contentDiv) {
    // The contentDiv will have several elementor widgets as direct children
    const widgets = Array.from(contentDiv.querySelectorAll(':scope > div'));
    widgets.forEach(widget => {
      const container = widget.querySelector('.elementor-widget-container');
      if (container) {
        // For each child in the widget container, add directly
        Array.from(container.children).forEach(child => {
          // Only append if child has content
          if (child.tagName === 'H1' || child.tagName === 'H2' || child.tagName === 'H3' || child.tagName === 'H4' || child.tagName === 'H5' || child.tagName === 'H6') {
            contentBits.push(child);
          } else if (child.tagName === 'P') {
            contentBits.push(child);
          } else if (child.tagName === 'DIV') {
            // Could be button wrapper
            const link = child.querySelector('a');
            if (link) contentBits.push(link);
          }
        });
      }
    });
  }

  // Build the table according to spec: 1 column with 3 rows (header, image, content)
  // Header must match example exactly
  const tableRows = [
    ['Hero'],
    [imgEl ? imgEl : ''],
    [contentBits.length ? contentBits : '']
  ];

  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(table);
}
