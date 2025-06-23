/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Find the background image: first visible/prominent <img> in this block
  let bgImg = null;
  const imgs = Array.from(element.querySelectorAll('img'));
  if (imgs.length > 0) {
    bgImg = imgs[0];
  }

  // 2. Get all text content after the background image (includes headings, paragraphs, etc)
  // We'll capture all text content (headings, paragraphs, breadcrumbs, any text block), in DOM order
  const contentBlocks = [];
  // Helper: recursively collect text elements only (h1-h6, p, or div/span with only text and not images)
  function collectTextNodes(node) {
    if (node.nodeType === 1) {
      // If this is a heading or paragraph
      if (node.matches('h1, h2, h3, h4, h5, h6, p')) {
        if (node.textContent && node.textContent.trim().length > 0) contentBlocks.push(node);
      } else if (
        node.children.length === 0 &&
        node.textContent && node.textContent.trim().length > 0 &&
        node.querySelectorAll('img').length === 0
      ) {
        // Plain text block/div/span/etc, not an image
        contentBlocks.push(node);
      } else {
        // Recursively check children
        Array.from(node.children).forEach(collectTextNodes);
      }
    }
  }
  // Start from direct children, skipping any containers that hold only images
  let passedFirstImg = !bgImg; // If no image, just start from top
  for (const child of element.children) {
    if (!passedFirstImg && child.contains(bgImg)) {
      passedFirstImg = true;
      continue;
    }
    if (passedFirstImg) {
      collectTextNodes(child);
    }
  }
  // Fallback: If nothing found, collect all headings and paragraphs from anywhere in the block
  if (contentBlocks.length === 0) {
    element.querySelectorAll('h1, h2, h3, h4, h5, h6, p').forEach(el => {
      if (el.textContent && el.textContent.trim().length > 0) contentBlocks.push(el);
    });
  }

  // 3. Table creation as per the markdown example: header, image (or empty), then all text in one cell
  const tableCells = [
    ['Hero'],
    [bgImg ? bgImg : ''],
    [contentBlocks.length > 0 ? contentBlocks : '']
  ];
  const table = WebImporter.DOMUtils.createTable(tableCells, document);
  element.replaceWith(table);
}
