/* global WebImporter */
export default function parse(element, { document }) {
  // Compose header row as per block definition
  const headerRow = ['Hero'];

  // Row 2: Background Image (not present in provided HTML, so leave blank)
  const row2 = [''];

  // Row 3: Content Cell (heading, all address blocks, CTA)
  const row3Content = [];

  // Find heading (h1-h6 under .elementor-widget-heading)
  const heading = element.querySelector('.elementor-widget-heading h1, .elementor-widget-heading h2, .elementor-widget-heading h3, .elementor-widget-heading h4, .elementor-widget-heading h5, .elementor-widget-heading h6');
  if (heading) row3Content.push(heading);

  // Find all icon lists and text blocks that are not inside buttons
  // The address/info part is typically made up of icon-lists and text-editor widgets
  // We want them in the same order as source.
  const widgets = Array.from(element.querySelectorAll('.elementor-widget'));
  widgets.forEach(widget => {
    // Skip heading and button (they are already handled)
    if ((heading && widget.contains(heading)) || widget.querySelector('.elementor-button')) {
      return;
    }
    row3Content.push(widget);
  });

  // Find the CTA button (a inside .elementor-widget-button)
  const buttonWidget = element.querySelector('.elementor-widget-button');
  if (buttonWidget) {
    const btn = buttonWidget.querySelector('a');
    if (btn) row3Content.push(btn);
  }

  // If there is no content, leave cell blank
  const row3 = [row3Content.length > 0 ? row3Content : ''];

  // Compose the block table
  const cells = [headerRow, row2, row3];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the new block
  element.replaceWith(block);
}
