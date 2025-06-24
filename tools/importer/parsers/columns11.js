/* global WebImporter */
export default function parse(element, { document }) {
  // Get the inner container, or fallback to element itself
  const inner = element.querySelector('.e-con-inner') || element;
  // Get all immediate children that are columns
  const columns = Array.from(inner.children).filter(child => child.classList.contains('e-con'));

  // Gather content for each column
  const colCells = columns.map(col => {
    // Find all widgets in this column
    const widgets = Array.from(col.children).filter(w => w.classList.contains('elementor-element'));
    // Collect all nodes from .elementor-widget-container in DOM order
    const nodes = [];
    widgets.forEach(widget => {
      const container = widget.querySelector('.elementor-widget-container');
      if (container) {
        nodes.push(...Array.from(container.childNodes));
      }
    });
    // Remove empty text nodes
    const meaningfulNodes = nodes.filter(n => !(n.nodeType === Node.TEXT_NODE && !n.textContent.trim()));
    if (meaningfulNodes.length === 1) return meaningfulNodes[0];
    if (meaningfulNodes.length > 1) return meaningfulNodes;
    // fallback: if nothing is found, return an empty string
    return '';
  });
  // Header row: always one column, even for multi-column tables
  const header = ['Columns (columns11)'];
  // Compose the cells for the table
  const cells = [header, colCells];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
