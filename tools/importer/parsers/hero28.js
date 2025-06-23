/* global WebImporter */
export default function parse(element, { document }) {
  // Get the heading (h3)
  const heading = element.querySelector('h3');
  // Get the paragraph
  const paragraph = element.querySelector('p');
  // Get the first visible CTA button with an href that isn't '#'
  let cta = null;
  const buttons = element.querySelectorAll('a.elementor-button');
  for (const btn of buttons) {
    if (btn.getAttribute('href') && btn.getAttribute('href') !== '#') {
      cta = btn;
      break;
    }
  }
  // Gather content for the 3rd row of the table
  const content = [];
  if (heading) content.push(heading);
  if (paragraph) content.push(paragraph);
  if (cta) content.push(cta);

  // Compose table rows: header, (optional bg image), content
  // No background image present in HTML so keep 2nd row empty
  const cells = [
    ['Hero'],
    [''],
    [content]
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
