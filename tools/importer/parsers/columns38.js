/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get all direct child containers (columns)
  function getColumnGroups(root) {
    return Array.from(root.children).filter(
      (child) => child.classList && child.classList.contains('e-con')
    );
  }
  // Helper to extract a block (1-5) content as an array of its widgets
  function extractBlockContent(col) {
    const widgets = col.querySelectorAll('.elementor-widget-container');
    const nodes = [];
    widgets.forEach(widget => {
      Array.from(widget.childNodes).forEach(node => {
        if (node.nodeType === Node.ELEMENT_NODE && node.textContent.trim()) nodes.push(node);
        else if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) nodes.push(node);
      });
    });
    return nodes;
  }

  // Gather all top-level blocks/columns
  const columns = getColumnGroups(element); // 5 top-level blocks
  // Defensive: Only use columns if we have at least 5
  if (columns.length < 5) return;
  // Group blocks into first cell: blocks 1-3, second cell: blocks 4-5
  const col1 = [];
  for (let i = 0; i < 3; i++) {
    col1.push(...extractBlockContent(columns[i]));
  }
  const col2 = [];
  for (let i = 3; i < 5; i++) {
    col2.push(...extractBlockContent(columns[i]));
  }
  // Compose table
  const cells = [
    ['Columns (columns38)'],
    [col1, col2]
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
