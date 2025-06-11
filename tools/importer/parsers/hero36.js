/* global WebImporter */
export default function parse(element, { document }) {
  // Find the core container (Elementor structure)
  const inner = element.querySelector('.e-con-inner') || element;

  // 1. Extract possible hero media (background image/video overlay as an <img>)
  let heroMedia = null;

  // Check for Elementor video overlay background image
  const overlay = inner.querySelector('.elementor-custom-embed-image-overlay');
  if (overlay) {
    const style = overlay.getAttribute('style') || '';
    const match = style.match(/background-image\s*:\s*url\(([^)]+)\)/i);
    if (match && match[1]) {
      // Use the real element if any existing <img> with this src exists
      let foundImg = Array.from(inner.querySelectorAll('img')).find(img => img.src === match[1]);
      if (foundImg) {
        heroMedia = foundImg;
      } else {
        const img = document.createElement('img');
        img.src = match[1];
        img.alt = '';
        heroMedia = img;
      }
    }
  }
  // fallback: no overlay, look for any <img> in the block
  if (!heroMedia) {
    const img = inner.querySelector('img');
    if (img) heroMedia = img;
  }

  // 2. Extract content: heading, paragraphs, CTA button, and other text
  let contentEls = [];
  // Find the first heading (for Hero title)
  const heading = inner.querySelector('h1, h2, h3, h4, h5, h6');
  if (heading) contentEls.push(heading);

  // Find all paragraphs (excluding those inside .elementor-spacer)
  const paragraphs = Array.from(inner.querySelectorAll('p')).filter(p => !p.closest('.elementor-spacer'));
  // Only add paragraphs that are not already included (e.g. if a heading is also a p, though unlikely)
  paragraphs.forEach(p => {
    if (!contentEls.includes(p)) {
      contentEls.push(p);
    }
  });

  // Find the CTA button (elementor button)
  const button = inner.querySelector('a.elementor-button');
  if (button && !contentEls.includes(button)) {
    contentEls.push(button);
  }

  // Also include any notes or disclaimers at the end (as p)
  // They are likely in additional <p> elements (already included above)

  // 3. Build the table per the block specification:
  // 1 column, 3 rows: header, background image (optional), content
  const rows = [
    ['Hero'],
    [heroMedia || ''], // Media row can be empty if no image is found
    [contentEls],      // Content row: all the extracted elements
  ];
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // 4. Replace original element with the new table
  element.replaceWith(table);
}
