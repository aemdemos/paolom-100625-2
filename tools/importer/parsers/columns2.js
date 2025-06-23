/* global WebImporter */
export default function parse(element, { document }) {
  // Get the direct .e-con-inner wrapper
  const inner = element.querySelector(':scope > .e-con-inner');
  if (!inner) return;

  // Get immediate child containers (columns)
  // These are the direct children of .e-con-inner
  const columns = Array.from(inner.children).filter(
    el => el.nodeType === 1 && (
      el.classList.contains('elementor-element') ||
      el.classList.contains('e-child') ||
      el.classList.contains('e-con')
    )
  );
  if (columns.length < 2) return;

  // For each column, get its visible content
  const colCells = columns.map(col => {
    // Get the inner content of this column (usually in .e-con-inner)
    const colInner = col.querySelector(':scope > .e-con-inner');
    let chunk;
    if (colInner) {
      // Use all .e-con-inner children
      if (colInner.children.length === 1) {
        chunk = colInner.firstElementChild;
      } else {
        // Combine all children into a div for a single cell
        const wrap = document.createElement('div');
        Array.from(colInner.children).forEach(child => wrap.appendChild(child));
        chunk = wrap;
      }
    } else {
      // Use all direct children of the col
      if (col.children.length === 1) {
        chunk = col.firstElementChild;
      } else {
        const wrap = document.createElement('div');
        Array.from(col.children).forEach(child => wrap.appendChild(child));
        chunk = wrap;
      }
    }
    return chunk;
  });

  // Header row as shown in the markdown: 'Columns (columns2)'
  // It must be a single cell that spans all columns
  const headerRow = [
    {
      text: 'Columns (columns2)',
      colspan: colCells.length
    }
  ];

  // Custom createTable to support colspan in header
  function createTableWithColspan(cells, document) {
    const table = document.createElement('table');
    let maxColumns = 0;
    cells.forEach((row, rowIndex) => {
      const tr = document.createElement('tr');
      row.forEach((cell, colIndex) => {
        let th;
        if (typeof cell === 'object' && cell !== null && 'text' in cell && rowIndex === 0) {
          th = document.createElement('th');
          th.innerHTML = cell.text;
          if (cell.colspan && cell.colspan > 1) {
            th.setAttribute('colspan', cell.colspan);
          }
          tr.appendChild(th);
        } else {
          const td = document.createElement(rowIndex === 0 ? 'th' : 'td');
          if (typeof cell === 'string') {
            td.innerHTML = cell;
          } else if (Array.isArray(cell)) {
            td.append(...cell);
          } else {
            td.append(cell);
          }
          tr.appendChild(td);
        }
      });
      maxColumns = Math.max(
        maxColumns,
        row.reduce((sum, cell) => sum + ((typeof cell === 'object' && cell.colspan) ? cell.colspan : 1), 0)
      );
      table.appendChild(tr);
    });
    return table;
  }

  const tableData = [headerRow, colCells];
  const table = createTableWithColspan(tableData, document);
  element.replaceWith(table);
}
