/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header row: must match exactly
  const cells = [['Hero']];

  // 2. Background image row: none in this HTML, so blank
  cells.push(['']);

  // 3. Content row: gather all relevant heading and visible text content
  const content = [];

  // Find all headings (h1-h6) inside the element, in order
  Array.from(element.querySelectorAll('h1, h2, h3, h4, h5, h6')).forEach(h => {
    if(h.textContent && h.textContent.trim().length > 0) content.push(h);
  });

  // Find all paragraphs, lists, and other text content directly under any level, but avoid duplicates
  // Only include block elements that are not empty
  Array.from(element.querySelectorAll('p, ul, ol')).forEach(el => {
    // Only include if has meaningful text and not already in content
    if (el.textContent && el.textContent.trim().length > 0 && !content.includes(el)) {
      content.push(el);
    }
  });

  // If content is still empty, fall back to all direct children with text content
  if (content.length === 0) {
    Array.from(element.children).forEach(child => {
      if(child.textContent && child.textContent.trim().length > 0) {
        content.push(child);
      }
    });
  }

  // If still empty, just add a blank string
  cells.push([content.length > 0 ? content : '']);

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
