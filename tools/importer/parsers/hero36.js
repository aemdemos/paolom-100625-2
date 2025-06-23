/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header row exactly as in the example
  const headerRow = ['Hero'];
  // 2. Second row: background image (optional, often empty in this layout)
  const bgRow = [''];

  // 3. Third row: All heading and text content, preserving order and semantics.
  // We'll include headings, paragraphs, and other block content as in the examples.
  // We'll extract immediate children from the main content container after any images or visual-divs.

  // Find the main text container: look for first element with heading (h1-h6) as a child
  let contentContainer = null;
  const blocks = Array.from(element.querySelectorAll(':scope > div, :scope > section, :scope > header, :scope > main, :scope > article'));
  for (const block of blocks) {
    if (block.querySelector('h1, h2, h3, h4, h5, h6')) {
      contentContainer = block;
      break;
    }
  }
  // fallback to element itself if not found
  if (!contentContainer) contentContainer = element;

  // Gather all headings and text elements in order
  const contentElements = [];
  Array.from(contentContainer.childNodes).forEach((node) => {
    if (node.nodeType === 1) {
      // Only consider Elements
      if (/^H[1-6]$/.test(node.tagName) || node.tagName === 'P') {
        contentElements.push(node);
      }
    } else if (node.nodeType === 3 && node.textContent.trim()) {
      // Text node
      const text = node.textContent.trim();
      if (text.length) contentElements.push(document.createTextNode(text));
    }
  });
  // As a fallback, if there are no direct children, look deeper for all headings and paragraphs
  if (contentElements.length === 0) {
    contentContainer.querySelectorAll('h1, h2, h3, h4, h5, h6, p').forEach((el) => {
      contentElements.push(el);
    });
  }
  // If still nothing, add any text content from the container
  if (contentElements.length === 0 && contentContainer.textContent.trim()) {
    contentElements.push(document.createTextNode(contentContainer.textContent.trim()));
  }

  // Compose the content row
  const contentRow = [contentElements];

  const cells = [
    headerRow,
    bgRow,
    contentRow,
  ];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
