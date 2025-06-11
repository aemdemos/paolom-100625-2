/* global WebImporter */
export default function parse(element, { document }) {
  // Table structure per the example:
  // Row 1: ['Hero']
  // Row 2: [Background Image (optional; none in this HTML)]
  // Row 3: [Heading(s), subheading(s), and paragraph(s)]

  // Find all direct children containers
  const children = Array.from(element.querySelectorAll(':scope > div'));

  // Extract heading (h1-h6)
  let heading = null;
  let paragraphs = [];

  children.forEach((child) => {
    // Find heading in any widget container
    const headingWidget = child.querySelector('.elementor-widget-heading .elementor-widget-container');
    if (headingWidget) {
      const headingEl = headingWidget.querySelector('h1, h2, h3, h4, h5, h6');
      if (headingEl && !heading) heading = headingEl;
    }
    // Find paragraphs in a text editor widget (that is NOT the breadcrumbs)
    if (child.querySelector('.elementor-widget-text-editor')) {
      if (!child.querySelector('.sensia-breadcrumbs')) {
        const textWidget = child.querySelector('.elementor-widget-text-editor .elementor-widget-container');
        if (textWidget) {
          // Accept all element nodes except empty divs
          Array.from(textWidget.childNodes).forEach(n => {
            if (n.nodeType === 1) { // 1 = ELEMENT_NODE
              // ignore empty divs
              if (!(n.tagName === 'DIV' && n.innerHTML.trim() === '')) {
                paragraphs.push(n);
              }
            } else if (n.nodeType === 3 && n.textContent.trim() !== '') { // 3 = TEXT_NODE
              // wrap text node in a <span> for valid DOM usage
              const span = document.createElement('span');
              span.textContent = n.textContent;
              paragraphs.push(span);
            }
          });
        }
      }
    }
  });

  // Compose the content cell: heading (if present) + all paragraphs/divs
  const contentCell = [];
  if (heading) contentCell.push(heading);
  if (paragraphs.length > 0) contentCell.push(...paragraphs);

  const cells = [
    ['Hero'],
    [''],
    [contentCell]
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
