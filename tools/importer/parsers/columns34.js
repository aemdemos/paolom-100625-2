/* global WebImporter */
export default function parse(element, { document }) {
  // Get the main content area
  const pageContent = element.querySelector('.page-content');
  if (!pageContent) return;
  const elementor = pageContent.querySelector('.elementor');
  if (!elementor) return;

  // Find all top-level direct child containers in .elementor
  const containers = Array.from(elementor.querySelectorAll(':scope > div[data-element_type="container"]'));

  // Find the columns container (the one with two column children)
  let columnsRow = containers.find(cont => cont.querySelectorAll(':scope > div[data-element_type="container"]').length === 2);
  if (!columnsRow) return;
  const columnDivs = Array.from(columnsRow.querySelectorAll(':scope > div[data-element_type="container"]'));
  if (columnDivs.length !== 2) return; // Expecting 2 columns

  // Left column: heading and form
  const firstColInner = columnDivs[0].querySelector(':scope > .e-con-inner') || columnDivs[0];
  const leftColContent = [];
  const leftHeadingWidget = firstColInner.querySelector('.elementor-widget-heading');
  if (leftHeadingWidget) {
    const heading = leftHeadingWidget.querySelector('.elementor-widget-container');
    if (heading) leftColContent.push(heading);
  }
  const leftFormWidget = firstColInner.querySelector('.elementor-widget-formidable');
  if (leftFormWidget) {
    const formContainer = leftFormWidget.querySelector('.elementor-widget-container');
    if (formContainer) leftColContent.push(formContainer);
  }

  // Right column: image
  const secondColInner = columnDivs[1].querySelector(':scope > .e-con-inner') || columnDivs[1];
  let rightImg = null;
  const imageWidget = secondColInner.querySelector('.elementor-widget-image .elementor-widget-container img');
  if (imageWidget) {
    rightImg = imageWidget;
  } else {
    rightImg = secondColInner.querySelector('img');
  }

  // Compose the correct structure: header row should have one column, content row two columns
  const cells = [
    ['Columns (columns34)'],
    [leftColContent, rightImg ? rightImg : ''],
  ];

  // Create the table and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
