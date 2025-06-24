/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as per the example, exactly matching 'Search (search4)'
  const headerRow = ['Search (search4)'];

  // For this block, the second row should contain all block-relevant content.
  // According to instructions, reference existing elements directly in the table when possible.
  // We'll gather relevant immediate child elements, preserving heading structure and text.

  // Get all relevant content from inside the element
  // We'll use :scope > * to get all immediate children
  const contentContainer = document.createElement('div');
  // Gather all visible child elements (skip those with only whitespace, or empty)
  const childNodes = Array.from(element.childNodes);
  childNodes.forEach((node) => {
    // If element node
    if (node.nodeType === Node.ELEMENT_NODE) {
      contentContainer.appendChild(node);
    } else if (node.nodeType === Node.TEXT_NODE) {
      // If text node with non-whitespace
      if (node.textContent && node.textContent.trim()) {
        const span = document.createElement('span');
        span.textContent = node.textContent.trim();
        contentContainer.appendChild(span);
      }
    }
  });
  // If there is no significant content (i.e. only whitespace), fall back to default sample URL as a link
  let secondRowCell;
  if (contentContainer.textContent.trim().length) {
    secondRowCell = contentContainer;
  } else {
    const indexUrl = 'https://main--helix-block-collection--adobe.hlx.page/block-collection/sample-search-data/query-index.json';
    const link = document.createElement('a');
    link.href = indexUrl;
    link.textContent = indexUrl;
    secondRowCell = link;
  }

  // Construct the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    [secondRowCell],
  ], document);

  // Replace the original element with the new table
  element.replaceWith(table);
}
