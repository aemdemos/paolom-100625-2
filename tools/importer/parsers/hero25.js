/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row - must be exactly 'Hero'
  const headerRow = ['Hero'];

  // 2. Background image (optional)
  let bgImgElem = null;
  // Check for background image via inline style on self or children
  function getBgFromStyle(el) {
    if (!el) return null;
    const style = el.getAttribute('style');
    if (style) {
      const match = /background-image:\s*url\(['"]?([^'")]+)['"]?\)/.exec(style);
      if (match && match[1]) {
        const img = document.createElement('img');
        img.src = match[1];
        return img;
      }
    }
    return null;
  }

  // Try all direct children for img or background image style
  const directChildren = Array.from(element.querySelectorAll(':scope > *'));
  for (const child of directChildren) {
    // Check for image tag
    const img = child.querySelector('img');
    if (img) {
      bgImgElem = img;
      break;
    }
    // Check for background image style
    const styledImg = getBgFromStyle(child);
    if (styledImg) {
      bgImgElem = styledImg;
      break;
    }
  }
  // If not found, check on self
  if (!bgImgElem) {
    bgImgElem = getBgFromStyle(element);
  }

  // 3. Text content (Heading, optional subheading, CTA)
  // Find all headings in element (keep order)
  const textContent = [];
  // Only headings and paragraphs as per example
  for (const tag of ['h1','h2','h3','h4','h5','h6','p']) {
    const nodes = element.querySelectorAll(tag);
    for (const n of nodes) {
      // Only push if is descendant of this element
      if (element.contains(n)) textContent.push(n);
    }
  }

  // 4. Compose table rows
  // Row 2: background image (may be empty)
  const row2 = [bgImgElem ? bgImgElem : ''];
  // Row 3: all text content (may be empty)
  const row3 = [textContent.length ? textContent : ''];

  // 5. Create the table as per requirements
  const tableRows = [headerRow, row2, row3];
  const table = WebImporter.DOMUtils.createTable(tableRows, document);

  // 6. Replace the original element with the table
  element.replaceWith(table);
}
