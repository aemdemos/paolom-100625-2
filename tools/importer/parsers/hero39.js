/* global WebImporter */
export default function parse(element, { document }) {
  // Compose header for the Hero block
  const headerRow = ['Hero'];

  // Try to extract a background image from style attributes, even if not as <img>
  let imageEl = null;

  // Try immediate children for style background-image
  const candidates = [element, ...element.querySelectorAll('*')];
  for (const el of candidates) {
    // Check for style attribute with background-image
    const style = el.getAttribute('style');
    if (style) {
      const urlMatch = style.match(/background-image\s*:\s*url\(["']?([^"')]+)["']?\)/i);
      if (urlMatch) {
        const url = urlMatch[1];
        imageEl = document.createElement('img');
        imageEl.src = url;
        break;
      }
    }
    // Also check for data attributes e.g. data-background-image
    for (const attr of el.getAttributeNames()) {
      if (/background.*image/i.test(attr)) {
        const val = el.getAttribute(attr);
        if (val && /^https?:\/\//.test(val)) {
          imageEl = document.createElement('img');
          imageEl.src = val;
          break;
        }
      }
    }
    if (imageEl) break;
  }

  // Also check for an <img> tag (normal case)
  if (!imageEl) {
    const img = element.querySelector('img');
    if (img) imageEl = img;
  }

  // Find the content (heading, subheading, CTA, etc.)
  let contentEl = null;
  // Try to find any child with a heading (h1-h6)
  const headingWidget = element.querySelector('.elementor-widget-heading');
  if (headingWidget) {
    contentEl = headingWidget;
  } else {
    // Fallback: any heading
    const heading = element.querySelector('h1,h2,h3,h4,h5,h6');
    if (heading) {
      contentEl = heading;
    }
  }
  // Fallback: if no heading found, try to include all non-image, non-empty children
  if (!contentEl) {
    const contentCandidates = Array.from(element.children).filter(child =>
      child.querySelector('h1,h2,h3,h4,h5,h6,p,a')
    );
    if (contentCandidates.length) {
      contentEl = document.createElement('div');
      contentCandidates.forEach(c => contentEl.appendChild(c));
    }
  }

  // Compose rows for table: header, image, content
  const rows = [
    headerRow,
    [imageEl ? imageEl : ''],
    [contentEl ? contentEl : ''],
  ];

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
