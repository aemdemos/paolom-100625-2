/* global WebImporter */
export default function parse(element, { document }) {
  const headerRow = ['Accordion (accordion21)'];
  const rows = [];

  // Get the widget container
  const widgetContainer = element.querySelector('.elementor-widget-container');
  if (!widgetContainer) return;

  // Find the TOC <ol> list, which holds the items
  const tocOl = widgetContainer.querySelector('ol.elementor-toc__list-wrapper');
  if (!tocOl) return;

  // Each <li> is an accordion item: title from the anchor, content is empty
  const tocItems = tocOl.querySelectorAll(':scope > li');
  tocItems.forEach((li) => {
    // Attempt to find the anchor inside each item
    const anchor = li.querySelector('a');
    if (anchor) {
      // Use the anchor text as the title, or anchor element if formatting desired
      // For maximum resilience, use the anchor element to preserve content/formatting
      rows.push([anchor, '']);
    }
  });

  if (rows.length === 0) return;

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);
  element.replaceWith(table);
}
