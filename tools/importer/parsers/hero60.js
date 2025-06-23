/* global WebImporter */
export default function parse(element, { document }) {
  // The .e-con-inner is a wrapper, inside which we have the content containers
  const mainInner = element.querySelector('.e-con-inner') || element;
  const mainRows = Array.from(mainInner.querySelectorAll(':scope > .elementor-element'));

  // Find the element that contains the heading (usually with class 'elementor-widget-heading')
  let headingEl = null;
  let headingH = null;
  for (const row of mainRows) {
    const h = row.querySelector('h1, h2, h3, h4, h5, h6');
    if (h) {
      headingEl = row;
      headingH = h;
      break;
    }
  }

  // Find the element that contains the paragraph(s) (usually with class 'elementor-widget-text-editor')
  let paraEl = null;
  for (const row of mainRows) {
    // find any <p> inside this row
    if (row.querySelector('p')) {
      paraEl = row;
      break;
    }
  }

  // Find the image element (usually in a widget with class 'elementor-widget-image')
  let imageEl = null;
  for (const row of mainRows) {
    const img = row.querySelector('img');
    if (img) {
      imageEl = img;
      break;
    }
  }

  // Construct the main text cell: heading and paragraph(s)
  const textCell = [];
  if (headingH) textCell.push(headingH);
  if (paraEl) {
    const paras = paraEl.querySelectorAll('p');
    paras.forEach(p => textCell.push(p));
  }

  // Compose table: 1 column, header row, optional image row, text row
  const cells = [
    ['Hero'],
    [imageEl ? imageEl : ''],
    [textCell.length > 0 ? textCell : '']
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
