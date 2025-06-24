/* global WebImporter */
export default function parse(element, { document }) {
  // HERO block - 1 col, 3 rows, header in first row: 'Hero', second: bg image (optional), third: heading, subheading, cta, etc.

  // 1. HEADER ROW
  const headerRow = ['Hero'];

  // 2. BACKGROUND IMAGE ROW (optional)
  // There is no <img> or inline background-image here, but background may be set by CSS.
  // If you want to handle background images from inline style, add here.
  // For now, if no direct <img> or known background, this row should be blank.
  let bgRow = [''];

  // 3. CONTENT ROW: Heading, address, links, button
  const contentParts = [];

  // Heading: h1/h2/h3/h4
  const heading = element.querySelector('.elementor-widget-heading h1, .elementor-widget-heading h2, .elementor-widget-heading h3, .elementor-widget-heading h4');
  if (heading) contentParts.push(heading);

  // Addresses (all <p> under .elementor-widget-text-editor)
  element.querySelectorAll('.elementor-widget-text-editor .elementor-widget-container p').forEach(p => {
    contentParts.push(p);
  });

  // Links (Google Maps, Waze)
  // Find all lists with links (ul > li > a)
  element.querySelectorAll('.elementor-widget-icon-list ul').forEach(ul => {
    ul.querySelectorAll('a').forEach(a => {
      contentParts.push(a);
    });
  });

  // Button: .elementor-widget-button a
  const ctaButton = element.querySelector('.elementor-widget-button a');
  if (ctaButton) contentParts.push(ctaButton);

  // Compose table rows
  const cells = [
    headerRow,
    bgRow,
    [contentParts]
  ];

  // Create table and replace original element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
