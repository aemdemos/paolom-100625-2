/* global WebImporter */
export default function parse(element, { document }) {
  // Get the container for columns
  const columnsWrapper = element.querySelector('.e-con-inner') || element;
  // Get all immediate layout columns
  const columnEls = Array.from(columnsWrapper.children).filter(
    el => el.classList.contains('e-con') && el.classList.contains('e-child')
  );
  const effectiveColumns = columnEls.length ? columnEls : Array.from(columnsWrapper.children);

  // Extract content for each column as a cell
  const colContents = effectiveColumns.map(col => {
    // Only direct widget children
    const widgets = Array.from(col.children).filter(child => child.classList.contains('elementor-element'));
    if (widgets.length === 0) return col;
    if (widgets.length === 1) return widgets[0];
    const wrapper = document.createElement('div');
    widgets.forEach(w => wrapper.appendChild(w));
    return wrapper;
  });

  // Build 2x2 rows after the header
  const row1 = [colContents[0] || '', colContents[1] || ''];
  const row2 = [colContents[2] || '', colContents[3] || ''];

  const headerRow = ['Columns (columns67)'];
  const cells = [headerRow, row1, row2];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
