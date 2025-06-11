/* global WebImporter */
export default function parse(element, { document }) {
  // Get all direct children in the .e-con-inner div if present
  const inner = element.querySelector('.e-con-inner') || element;
  // There are two direct children, the left (text) and the right (image)
  const left = inner.children[0];
  const right = inner.children[1];

  // Get heading from left
  let heading = null;
  if (left) {
    const h = left.querySelector('h1,h2,h3,h4,h5,h6');
    if (h) heading = h;
  }
  // Get all paragraphs from left
  let paragraphs = [];
  if (left) {
    paragraphs = Array.from(left.querySelectorAll('p'));
  }

  // Get image from right (if present)
  let imageEl = null;
  if (right) {
    const img = right.querySelector('img');
    if (img) imageEl = img;
  }

  // Table construction: 1 column, 3 rows: [header], [image], [text/heading]
  const headerRow = ['Hero'];
  const imageRow = [imageEl ? imageEl : ''];
  // Compose heading and all paragraphs into a single cell as per example
  const contentArr = [];
  if (heading) contentArr.push(heading);
  if (paragraphs.length > 0) contentArr.push(...paragraphs);
  const contentRow = [contentArr.length > 0 ? contentArr : ''];

  const cells = [
    headerRow,
    imageRow,
    contentRow,
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
