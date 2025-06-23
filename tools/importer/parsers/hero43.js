/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header as in the example
  const tableRows = [['Hero']];

  // 2. Row 2: Background image (first prominent .elementor-widget-image img)
  let bgImg = '';
  const imgEl = element.querySelector('.elementor-widget-image img') || element.querySelector('img');
  if (imgEl) bgImg = imgEl;
  tableRows.push([bgImg || '']);

  // 3. Row 3: Only main heading (h1). If not present, fallback to h2. Not both.
  let heading = element.querySelector('h1');
  if (!heading || !heading.textContent.trim()) {
    heading = element.querySelector('h2');
  }

  // Only include the heading if its text is non-empty
  let cellContent = '';
  if (heading && heading.textContent.trim()) {
    cellContent = heading;
  }
  tableRows.push([cellContent]);

  // 4. Replace element with correct table
  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(table);
}
