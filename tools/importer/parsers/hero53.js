/* global WebImporter */
export default function parse(element, { document }) {
  // Get the deepest meaningful containers: the immediate children of .e-con-inner
  const inner = element.querySelector('.e-con-inner');
  let containers = [];
  if (inner) {
    containers = inner.querySelectorAll(':scope > div');
  } else {
    // fallback: use immediate children
    containers = element.querySelectorAll(':scope > div');
  }

  // Defensive: at least 2 main containers expected
  // First: logo and subtitle; Second: heading(s) and text
  let backgroundContent = [];
  if (containers[0]) {
    // find all widget containers inside the first block (logo and subheading)
    const bgWidgets = containers[0].querySelectorAll(':scope > div');
    if (bgWidgets.length > 0) {
      backgroundContent = Array.from(bgWidgets);
    } else {
      // fallback, just use the whole container
      backgroundContent = [containers[0]];
    }
  }

  let contentContent = [];
  if (containers[1]) {
    // find all widget containers inside the second block (headings and paragraph)
    const contentWidgets = containers[1].querySelectorAll(':scope > div');
    if (contentWidgets.length > 0) {
      contentContent = Array.from(contentWidgets);
    } else {
      // fallback, just use the whole container
      contentContent = [containers[1]];
    }
  }

  // Example: single table, header row is 'Hero', 2 more rows
  const cells = [
    ['Hero'],
    [backgroundContent],
    [contentContent],
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
