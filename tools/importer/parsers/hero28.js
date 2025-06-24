/* global WebImporter */
export default function parse(element, { document }) {
  // Table header, must match example: 'Hero'
  const headerRow = ['Hero'];

  // Second row: background image (not present in this HTML) - keep empty string
  const bgRow = [''];

  // Third row: Heading, Subheading (paragraph), CTA
  // Find the heading element
  const heading = element.querySelector('.elementor-widget-heading .elementor-heading-title');
  // Find the subheading (paragraph)
  const subheading = element.querySelector('.elementor-widget-text-editor p');
  // Find CTA: look for visible button (not inside a hidden parent)
  const buttonWidgets = element.querySelectorAll('.elementor-widget-button');
  const ctas = [];
  buttonWidgets.forEach(widget => {
    // If the widget has any 'elementor-hidden-' class, skip
    if (![...widget.classList].some(cls => cls.startsWith('elementor-hidden'))) {
      const a = widget.querySelector('a');
      if (a) ctas.push(a);
    }
  });

  // Collect all non-null presentational elements in order
  const content = [];
  if (heading) content.push(heading);
  if (subheading) content.push(subheading);
  if (ctas.length > 0) content.push(...ctas);

  // Even if content is empty, we need the row for structure
  const infoRow = [content.length > 0 ? content : ''];

  // Build table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    bgRow,
    infoRow
  ], document);

  // Replace original element with just the table
  element.replaceWith(table);
}
