/* global WebImporter */
export default function parse(element, { document }) {
  // Find the inner container that holds the columns
  const inner = element.querySelector('.e-con-inner');
  let leftContent = null;
  let rightContent = null;

  if (inner) {
    // Expect two main children (columns):
    // left = heading, right = text/editor
    const columns = Array.from(inner.children).filter(child => child.classList.contains('e-con'));
    if (columns.length >= 2) {
      // LEFT COLUMN: heading
      const headingWidget = columns[0].querySelector('.elementor-widget-heading .elementor-widget-container');
      leftContent = headingWidget ? headingWidget : columns[0];
      // RIGHT COLUMN: text editor content
      const textWidget = columns[1].querySelector('.elementor-widget-text-editor .elementor-widget-container');
      rightContent = textWidget ? textWidget : columns[1];
    } else {
      // Fallback: treat the entire element as one cell if not enough columns
      leftContent = element;
    }
  } else {
    // Fallback: treat the entire element as one cell if no inner found
    leftContent = element;
  }

  let table;
  // If both columns exist, create two columns and a header cell spanning both
  if (leftContent && rightContent) {
    // Create table element manually to control colspan
    table = document.createElement('table');
    // Header row
    const trHead = document.createElement('tr');
    const th = document.createElement('th');
    th.textContent = 'Columns (columns59)';
    th.colSpan = 2;
    trHead.appendChild(th);
    table.appendChild(trHead);
    // Content row
    const trContent = document.createElement('tr');
    const td1 = document.createElement('td');
    td1.appendChild(leftContent);
    const td2 = document.createElement('td');
    td2.appendChild(rightContent);
    trContent.appendChild(td1);
    trContent.appendChild(td2);
    table.appendChild(trContent);
  } else {
    // Fallback: single column table
    table = WebImporter.DOMUtils.createTable([
      ['Columns (columns59)'],
      [leftContent],
    ], document);
  }
  element.replaceWith(table);
}
