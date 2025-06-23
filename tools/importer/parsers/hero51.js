/* global WebImporter */
export default function parse(element, { document }) {
  // 1. HEADER ROW: Block name matches the example exactly
  const headerRow = ['Hero'];

  // 2. BACKGROUND IMAGE ROW: Get first <img> if present (may be null)
  let backgroundImg = null;
  // Look for an immediate or descendant <img>
  const imgs = element.querySelectorAll('img');
  if (imgs && imgs.length > 0) {
    backgroundImg = imgs[0];
  } else {
    // Also check for inline style background image
    let bgUrl = null;
    let e = element;
    do {
      const style = e.getAttribute && e.getAttribute('style');
      if (style && /background-image\s*:/i.test(style)) {
        const m = style.match(/background-image\s*:\s*url\(["']?(.*?)["']?\)/i);
        if (m && m[1]) bgUrl = m[1];
        break;
      }
      e = e.parentElement;
    } while (e && !bgUrl);
    if (bgUrl) {
      const img = document.createElement('img');
      img.src = bgUrl;
      backgroundImg = img;
    }
  }
  // If no image, empty cell
  const bgImgRow = [backgroundImg || ''];

  // 3. CONTENT ROW: Grab all semantic content in order (headings, paragraphs, cta)
  // Only top-level heading+text+cta
  const contentParts = [];
  // We want to include all block-level elements that are children of the main content column.
  // Usually a container with heading, some text, and a button.
  // Try to find a top-level column container
  let textContainer = null;
  // Heuristic: look for div with heading inside
  const candidates = element.querySelectorAll(':scope > div, :scope > * > div');
  for (const candidate of candidates) {
    if (candidate.querySelector('h1, h2, h3, h4, h5, h6')) {
      textContainer = candidate;
      break;
    }
  }
  if (!textContainer) textContainer = element;
  // Add heading(s)
  textContainer.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(h => contentParts.push(h));
  // Add paragraphs
  textContainer.querySelectorAll('p').forEach(p => contentParts.push(p));
  // Add CTA button or link (but only the *first* prominent button/link, if present)
  // Only add if it's not already part of a heading/paragraph
  const cta = textContainer.querySelector('a, button');
  if (cta) {
    // Avoid duplicates
    if (!contentParts.includes(cta)) {
      contentParts.push(cta);
    }
  }
  // If no content found, cell should be empty string
  const contentRow = [contentParts.length ? contentParts : ''];

  // 4. Compose block
  const cells = [headerRow, bgImgRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  
  // 5. REPLACE
  element.replaceWith(block);
}
