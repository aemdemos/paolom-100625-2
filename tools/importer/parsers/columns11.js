/* global WebImporter */
export default function parse(element, { document }) {
  // Collect top-level columns (children of .e-con-inner)
  const inner = element.querySelector(':scope > .e-con-inner');
  let columns = [];
  if (inner) {
    columns = Array.from(inner.children);
  } else {
    columns = Array.from(element.children); // fallback
  }
  // Prepare columns content array
  const cols = [];

  // Column 1: Find the image (do NOT create or clone)
  let col1Img = null;
  if (columns[0]) {
    col1Img = columns[0].querySelector('img');
    if (col1Img) {
      cols.push(col1Img);
    } else {
      cols.push('');
    }
  } else {
    cols.push('');
  }

  // Column 2: heading + paragraphs (preserve structure, reference existing nodes)
  const col2Content = [];
  if (columns[1]) {
    // Heading
    const heading = columns[1].querySelector('h2');
    if (heading) col2Content.push(heading);
    // All paragraphs from text editor widgets
    const editors = columns[1].querySelectorAll('.elementor-widget-text-editor .elementor-widget-container');
    editors.forEach(container => {
      Array.from(container.childNodes).forEach(node => {
        if (node.nodeType === Node.ELEMENT_NODE || (node.nodeType === Node.TEXT_NODE && node.textContent.trim())) {
          col2Content.push(node);
        }
      });
    });
    cols.push(col2Content.length === 1 ? col2Content[0] : col2Content);
  } else {
    cols.push('');
  }

  // Build the table cells
  const cells = [
    ['Columns (columns11)'],
    cols
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
