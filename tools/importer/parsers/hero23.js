/* global WebImporter */
export default function parse(element, { document }) {
  // This block should precisely match the example:
  // 3 rows, 1 column. Row 1: 'Hero' (header). Row 2: (empty). Row 3: all content.
  // There is NO Section Metadata in the example, so do not add it or use <hr>.

  // Find the inner content area that contains all the text, headings, images, and CTA
  // In the given HTML, that's the second level container (not the outermost) with actual child widgets.
  // We'll look for the first non-empty div within element's direct children, and use all its children as block content.
  let contentContainer = null;
  const firstLevelDivs = Array.from(element.querySelectorAll(':scope > div'));
  for (const div of firstLevelDivs) {
    // If this div contains any heading, paragraph, or button, we consider it the main content
    if (div.querySelector('h1, h2, h3, h4, h5, h6, p, a')) {
      contentContainer = div;
      break;
    }
  }
  // Fallback: just use the first direct child div
  if (!contentContainer && firstLevelDivs.length > 0) {
    contentContainer = firstLevelDivs[0];
  }
  // Fallback: use the element itself
  if (!contentContainer) {
    contentContainer = element;
  }

  // Collect all the direct children (divs, widgets, etc.)
  const blockContent = Array.from(contentContainer.children).filter(node => {
    // Ignore empty containers
    if (node.tagName === 'DIV' && node.textContent.trim() === '' && !node.querySelector('img')) return false;
    return true;
  });

  // If the contentContainer has no children (e.g. everything is inside deeper divs), fallback to all descendants
  let finalContent = blockContent;
  if (finalContent.length === 0) {
    finalContent = Array.from(contentContainer.querySelectorAll(':scope > *'));
  }
  // Final fallback: use the contentContainer itself if it's a widget with direct content
  if (finalContent.length === 0) {
    finalContent = [contentContainer];
  }

  // Compose the table as per the markdown example
  const cells = [
    ['Hero'],
    [''],
    [finalContent]
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
