/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Find the relevant container for the Table of Contents
  const tocWidget = element.querySelector('.elementor-widget-table-of-contents');
  if (!tocWidget) return;

  // 2. Find the header title (accordion title)
  const headerTitle = tocWidget.querySelector('.elementor-toc__header-title');
  // Defensive: if not found, use fallback
  const titleText = headerTitle ? headerTitle.textContent.trim() : '';
  const titleElem = headerTitle || document.createElement('span');
  if (!headerTitle) titleElem.textContent = '';

  // 3. Find the content to display (the list/wrapper)
  const tocBody = tocWidget.querySelector('.elementor-toc__body');
  if (!tocBody) return;

  // The ol (the TOC list) is the main content.
  const ol = tocBody.querySelector('ol');
  // Defensive: If there is no ol, put an empty placeholder
  const tocContentElem = ol || document.createElement('div');
  if (!ol) tocContentElem.textContent = '';

  // 4. Compose the table rows as per the Accordion (accordion44) block
  // Header row (block name exactly as provided)
  const headerRow = ['Accordion (accordion44)'];
  // Next row: [title, content]
  const rows = [headerRow, [titleElem, tocContentElem]];

  // 5. Create and replace
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
