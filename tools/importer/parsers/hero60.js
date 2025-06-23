/* global WebImporter */
export default function parse(element, { document }) {
  // Get the main inner container if exists
  const inner = element.querySelector('.e-con-inner') || element;
  // Find all direct child elementor containers
  const sections = inner.querySelectorAll(':scope > .elementor-element');

  // Variables for blocks
  let heading = null;
  let para = null;
  let img = null;

  // Look for heading, text, and image
  sections.forEach(sec => {
    // Heading block
    const h = sec.querySelector('.elementor-widget-heading h1, .elementor-widget-heading h2, .elementor-widget-heading h3, .elementor-widget-heading h4, .elementor-widget-heading h5, .elementor-widget-heading h6');
    if (h && !heading) heading = h;
    // Paragraph
    const p = sec.querySelector('.elementor-widget-text-editor p');
    if (p && !para) para = p;
    // Image
    const imgEl = sec.querySelector('.elementor-widget-image img');
    if (imgEl && !img) img = imgEl;
  });

  // Build block content for the last row (heading, paragraph)
  const blockContent = [];
  if (heading) blockContent.push(heading);
  if (para) blockContent.push(para);

  // Structure per Hero block convention: header, image, [text]
  const cells = [
    ['Hero'],
    [img ? img : ''],
    [blockContent.length ? blockContent : '']
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
