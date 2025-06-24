/* global WebImporter */
export default function parse(element, { document }) {
  // Get the main loop container (which includes the columns)
  const loopContainer = element.querySelector('.elementor-loop-container');
  if (!loopContainer) return;

  // Get the first .elementor child inside the loop (which is the main content container)
  const mainElementor = loopContainer.querySelector('.elementor');
  if (!mainElementor) return;

  // The main columns are immediate children with .e-con.e-child
  const colContainers = Array.from(mainElementor.children).filter(
    (node) => node.classList && node.classList.contains('e-con') && node.classList.contains('e-child')
  );
  if (colContainers.length < 2) return;

  // Reference each column's content as a fragment of its immediate children
  const col1Fragment = document.createDocumentFragment();
  Array.from(colContainers[0].children).forEach((child) => {
    col1Fragment.appendChild(child);
  });

  const col2Fragment = document.createDocumentFragment();
  Array.from(colContainers[1].children).forEach((child) => {
    col2Fragment.appendChild(child);
  });

  // Construct the table
  const headerRow = ['Columns (columns32)'];
  const contentRow = [col1Fragment, col2Fragment];
  const cells = [headerRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
