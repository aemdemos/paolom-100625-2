/* global WebImporter */
export default function parse(element, { document }) {
  // Compose header row, matching the example exactly
  const headerRow = ['Hero'];
  // Compose background image row - no image in this HTML block
  const backgroundRow = [''];

  // Find the content container (the one with heading, text, cta)
  // Prefer the deepest div containing a heading
  let contentRoot = null;
  const candidates = Array.from(element.querySelectorAll('div'));
  for (const div of candidates) {
    if (div.querySelector('h1, h2, h3, h4, h5, h6')) {
      contentRoot = div;
      break;
    }
  }
  if (!contentRoot) contentRoot = element;

  // Collect all direct content elements (headings, paragraphs, buttons) in DOM order
  const contentParts = [];
  // Use all headings (in DOM order)
  contentRoot.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(h => contentParts.push(h));
  // Use all paragraphs (in DOM order)
  contentRoot.querySelectorAll('p').forEach(p => contentParts.push(p));
  // Add all CTA links that are not already included due to previous selection
  contentRoot.querySelectorAll('a').forEach(a => {
    if (!contentParts.includes(a)) contentParts.push(a);
  });

  // Filter only those that are children or descendants (avoid duplicates)
  // (They are already descendants, just avoid potential duplication)
  // If no elements found, fallback to all textContent
  const contentRow = [contentParts.length ? contentParts : contentRoot.textContent.trim()];

  // Compose the table as per the example: header, background, content
  const cells = [
    headerRow,
    backgroundRow,
    contentRow
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
