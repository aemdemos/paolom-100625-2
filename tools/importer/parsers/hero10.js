/* global WebImporter */
export default function parse(element, { document }) {
  // The Hero block has 1 column and 3 rows:
  // 1. Header row: 'Hero'
  // 2. Background image (optional), in this case there is none extracted from HTML
  // 3. Content (heading and CTA, etc)

  // Try to find the heading/title (should be in h1/h2/h3)
  let title = '';
  const headingWidget = element.querySelector('[data-widget_type="heading.default"] .elementor-widget-container');
  if (headingWidget) {
    // There might be a heading element inside
    const h = headingWidget.querySelector('h1, h2, h3, h4, h5, h6');
    if (h) {
      title = h;
    } else {
      // fallback to the whole widget container if no heading
      title = headingWidget;
    }
  }

  // There is no background image in an <img> or similar. The background is likely CSS.
  // So per spec, leave the background row blank.

  // Build the rows for the Hero block as shown in the example
  const rows = [
    ['Hero'],
    [''],
    [title || ''],
  ];

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
