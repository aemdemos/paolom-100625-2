/* global WebImporter */
export default function parse(element, { document }) {
  // Get the inner element
  const inner = element.querySelector('.e-con-inner');
  let logo = null, subtitle = null, heading = null, paragraph = null;

  if (inner) {
    const containers = inner.querySelectorAll(':scope > .e-con');
    // LEFT container: logo and subtitle
    if (containers[0]) {
      // Logo image
      const logoImg = containers[0].querySelector('.elementor-widget-image img');
      if (logoImg) logo = logoImg;
      // Subtitle (first .elementor-widget-text-editor p)
      const subtitleP = containers[0].querySelector('.elementor-widget-text-editor p');
      if (subtitleP) subtitle = subtitleP;
    }
    // RIGHT container: heading and paragraph
    if (containers[1]) {
      // Heading (any heading inside .elementor-widget-heading)
      const headingEl = containers[1].querySelector('.elementor-widget-heading h1, .elementor-widget-heading h2, .elementor-widget-heading h3, .elementor-widget-heading h4, .elementor-widget-heading h5, .elementor-widget-heading h6');
      if (headingEl) heading = headingEl;
      // Paragraph (first .elementor-widget-text-editor p)
      const paraP = containers[1].querySelector('.elementor-widget-text-editor p');
      if (paraP) paragraph = paraP;
    }
  }

  // Compose the info cell in correct order
  const infoCell = [];
  if (logo) infoCell.push(logo);
  if (subtitle) infoCell.push(subtitle);
  if (heading) infoCell.push(heading);
  if (paragraph) infoCell.push(paragraph);

  const cells = [
    ['Hero'],
    [''],
    [infoCell]
  ];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
