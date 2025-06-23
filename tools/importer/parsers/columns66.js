/* global WebImporter */
export default function parse(element, { document }) {
  // Find the two main column containers
  const columnDivs = element.querySelectorAll(':scope > div');
  if (columnDivs.length !== 2) return;

  // LEFT COLUMN: Collect all widgets/content
  const leftWidgets = columnDivs[0].querySelectorAll(':scope > div');
  const leftContent = [];
  leftWidgets.forEach((widget) => {
    const widgetContainer = widget.querySelector('.elementor-widget-container');
    if (widgetContainer) {
      // If single element inside, unwrap
      if (widgetContainer.childElementCount === 1) {
        leftContent.push(widgetContainer.firstElementChild);
      } else {
        // Multiple children, push all
        Array.from(widgetContainer.childNodes).forEach((node) => {
          if (node.nodeType === 1) {
            leftContent.push(node);
          } else if (node.nodeType === 3 && node.textContent.trim()) {
            // If text node is not just whitespace
            const span = document.createElement('span');
            span.textContent = node.textContent;
            leftContent.push(span);
          }
        });
      }
    }
  });

  // RIGHT COLUMN: Get the image in the widget
  let rightContent = null;
  const rightWidget = columnDivs[1].querySelector('.elementor-widget-container');
  if (rightWidget) {
    const img = rightWidget.querySelector('img');
    if (img) {
      rightContent = img;
    } else {
      // fallback in case the structure is different
      if (rightWidget.childElementCount === 1) {
        rightContent = rightWidget.firstElementChild;
      } else {
        rightContent = rightWidget;
      }
    }
  }

  // Header row as per instructions
  const headerRow = ['Columns (columns66)'];
  const cells = [
    headerRow,
    [leftContent, rightContent]
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
