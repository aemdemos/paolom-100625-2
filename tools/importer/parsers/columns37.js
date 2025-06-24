/* global WebImporter */
export default function parse(element, { document }) {
  // The header row, always single column
  const headerRow = ['Columns (columns37)'];

  // Find all direct child containers
  const topContainers = Array.from(element.querySelectorAll(':scope > div'));

  // Find the column that contains the ficha técnica content
  let leftCol = null;
  let rightCol = null;

  // There are only two direct child containers: one is the left, one is the right column
  // Let's try to detect which is which by content
  if (topContainers.length === 2) {
    // If either contains a heading, that's the ficha técnica (left column visually)
    if (topContainers[0].querySelector('.elementor-widget-heading')) {
      leftCol = topContainers[0];
      rightCol = topContainers[1];
    } else {
      leftCol = topContainers[1];
      rightCol = topContainers[0];
    }
  } else {
    // fallback: treat first as left, second as right if structure changes
    leftCol = topContainers[0] || document.createElement('div');
    rightCol = topContainers[1] || document.createElement('div');
  }

  // For this input, there is only one row of content (not two as in the markdown example)
  // So, only produce a single content row of two columns
  // If both left and right columns are empty, create empty divs to fill cells
  if (!leftCol) leftCol = document.createElement('div');
  if (!rightCol) rightCol = document.createElement('div');

  const contentRow = [leftCol, rightCol];
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);

  element.replaceWith(table);
}
