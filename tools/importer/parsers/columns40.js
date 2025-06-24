/* global WebImporter */
export default function parse(element, { document }) {
  // Find immediate child sections (likely each is a block/div)
  const sections = Array.from(element.querySelectorAll(':scope > div'));

  // Find heading+breadcrumbs section and grid section
  let headingSection = null;
  let gridSection = null;

  for (const sec of sections) {
    if (!headingSection && (sec.querySelector('.sensia-breadcrumbs') || sec.querySelector('h1, .elementor-heading-title'))) {
      headingSection = sec;
    }
    if (!gridSection && sec.querySelector('.elementor-widget-loop-grid')) {
      gridSection = sec;
    }
  }

  // Per spec: header is one column, then two rows with two columns each
  const headerRow = ['Columns (columns40)'];
  const row1 = [headingSection || '', ''];
  const row2 = ['', gridSection || ''];
  const cells = [headerRow, row1, row2];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
