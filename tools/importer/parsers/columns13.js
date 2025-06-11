/* global WebImporter */
export default function parse(element, { document }) {
  // Find the loop container (main content block)
  const loopContainer = element.querySelector('.elementor-loop-container');
  if (!loopContainer) return;

  // Try to extract the two main columns
  // The first is the left (location name + subtext), the second is right (details)
  let leftCol = null;
  let rightCol = null;
  // Find all immediate children
  const topLevelChildren = loopContainer.querySelectorAll(':scope > div');
  if (topLevelChildren.length >= 2) {
    leftCol = topLevelChildren[0];
    rightCol = topLevelChildren[1];
  } else {
    // Fallback: try getting first .elementor-element-7ff4075b and .elementor-element-7f81c541
    leftCol = loopContainer.querySelector('.elementor-element-7ff4075b') || null;
    rightCol = loopContainer.querySelector('.elementor-element-7f81c541') || null;
    if (!leftCol || !rightCol) return; // If still not found, give up
  }

  // Compose the block table
  const headerRow = ['Columns (columns13)'];
  const contentRow = [leftCol, rightCol];
  const cells = [headerRow, contentRow];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
