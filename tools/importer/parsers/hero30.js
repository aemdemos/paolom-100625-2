/* global WebImporter */
export default function parse(element, { document }) {
  // Compose the Hero block table structure
  // 1st row: block name
  // 2nd row: background image (optional)
  // 3rd row: heading, subheading, cta, etc (optional)

  // Find background image: look for img in ancestors, but in this case, there is no img in the block, so leave blank
  let backgroundImg = '';
  // If you expect to extract a background image from style attributes (eg, background-image), add code here
  // But in this HTML, there isn't one, so leave as blank

  // Extract heading and content
  const contentEls = [];
  // Heading
  const headingWidget = element.querySelector('[class*="widget-heading"]');
  if (headingWidget) {
    const heading = headingWidget.querySelector('h1,h2,h3,h4,h5,h6');
    if (heading) contentEls.push(heading);
  }
  // Description/content (text widget)
  const textWidget = element.querySelector('[class*="widget-text-editor"]');
  if (textWidget) {
    const widgetContent = textWidget.querySelector('.elementor-widget-container');
    if (widgetContent) {
      contentEls.push(widgetContent);
    }
  }
  // Accordion (technical details)
  const accordionWidget = element.querySelector('[class*="widget-n-accordion"]');
  if (accordionWidget) {
    const detailsEls = accordionWidget.querySelectorAll('details');
    for (const details of detailsEls) {
      contentEls.push(details);
    }
  }

  // If everything is empty, ensure we preserve 3 rows
  const tableRows = [];
  tableRows.push(['Hero']);
  tableRows.push([backgroundImg]); // 2nd row, background image or blank
  tableRows.push([contentEls.length ? contentEls : '']); // 3rd row, all content or blank

  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(table);
}
