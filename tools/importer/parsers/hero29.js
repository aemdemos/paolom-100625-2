/* global WebImporter */
export default function parse(element, { document }) {
  // Compose the Hero block as a table: 1 col, 3 rows (header, bg, content)
  // Header row must be exactly 'Hero'

  // Determine the most likely container with actual content (not just spacing)
  // Prefer the first container with a heading, or .e-con-inner for mobile
  let mainContentContainer = element.querySelector('.e-con-inner');
  if (!mainContentContainer) {
    // find first child div with a heading (desktop)
    mainContentContainer = Array.from(element.querySelectorAll(':scope > div')).find(div => div.querySelector('h1, h2, h3, h4, h5, h6'));
  }
  if (!mainContentContainer) {
    // fallback to whole element
    mainContentContainer = element;
  }

  // The content cell should include all headings, paragraphs, and CTA's in order
  // Get all headings (h1-h6), paragraphs (p), and anchor buttons in this container, in order
  const contentNodes = [];
  // We want to retain order, so query for all direct and indirect children that are h1-h6, p, or a
  // But we only want those that are actually visible content, not wrappers
  const contentSelectors = 'h1, h2, h3, h4, h5, h6, p, a.elementor-button, a.elementor-button-link';
  // Use TreeWalker to keep document order and avoid wrappers
  const walker = document.createTreeWalker(mainContentContainer, NodeFilter.SHOW_ELEMENT, {
    acceptNode(node) {
      if (node.matches(contentSelectors)) {
        // Only accept nodes with non-empty text or children
        if (node.textContent && node.textContent.trim() !== '') return NodeFilter.FILTER_ACCEPT;
      }
      return NodeFilter.FILTER_SKIP;
    }
  });
  let node;
  while((node = walker.nextNode())) {
    contentNodes.push(node);
  }

  // If nothing found, fallback to any non-empty text in mainContentContainer
  if (contentNodes.length === 0 && mainContentContainer.textContent && mainContentContainer.textContent.trim() !== '') {
    const span = document.createElement('span');
    span.textContent = mainContentContainer.textContent.trim();
    contentNodes.push(span);
  }

  // Build the table rows
  const rows = [
    ['Hero'],
    [''],
    [contentNodes]
  ];

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
