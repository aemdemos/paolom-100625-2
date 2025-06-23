/* global WebImporter */
export default function parse(element, { document }) {
  // Build header row as in example
  const cells = [
    ['Hero'],
  ];

  // 2nd row: Background image (none present in element, leave empty as in the example)
  cells.push(['']);

  // 3rd row: All primary content (headings, forms, text, etc.)
  // Get the innermost container that has all content
  const inner = element.querySelector('.e-con-inner') || element;

  // Get all direct children of .e-con-inner (handles headings, forms, etc.)
  // Use all content for resilience
  const contentBlocks = [];
  
  // Gather all immediate children that are not pure containers
  inner.childNodes.forEach((node) => {
    if (node.nodeType === Node.ELEMENT_NODE) {
      // If this is a widget or container holding content, get their content
      // If it's just a container, dive deeper
      if (
        node.classList.contains('elementor-widget-heading') ||
        node.classList.contains('elementor-widget-formidable') ||
        node.classList.contains('elementor-widget-container')
      ) {
        // For widgets, include their content container children
        node.childNodes.forEach((n2) => {
          if (n2.nodeType === Node.ELEMENT_NODE) {
            contentBlocks.push(n2);
          }
        });
      } else if (node.childNodes.length === 1 && node.firstChild.nodeType === Node.ELEMENT_NODE) {
        // Probably a wrapper/container, dive deeper
        contentBlocks.push(node.firstChild);
      } else {
        // otherwise, include the node
        contentBlocks.push(node);
      }
    } else if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
      // Include any non-empty text nodes
      const span = document.createElement('span');
      span.textContent = node.textContent.trim();
      contentBlocks.push(span);
    }
  });

  // If we only pulled in wrappers, flatten further to get text/heading/etc. elements
  function flattenContent(arr) {
    const out = [];
    arr.forEach(el => {
      if (el.nodeType === Node.ELEMENT_NODE &&
        (el.children.length === 1 && el.firstElementChild &&
         (el.classList.contains('e-con') || el.classList.contains('e-child') || el.classList.contains('e-con-inner'))
        )
      ) {
        // recurse deeper if typical wrapper
        out.push(...flattenContent([el.firstElementChild]));
      } else {
        out.push(el);
      }
    });
    return out;
  }
  const flatContent = flattenContent(contentBlocks);

  // Remove empty divs/spans
  const finalContent = flatContent.filter(el => {
    if (!el) return false;
    if (el.nodeType !== Node.ELEMENT_NODE) return true;
    if (
      (el.tagName === 'DIV' || el.tagName === 'SPAN') &&
      !el.textContent.trim() && el.children.length === 0
    ) {
      return false;
    }
    return true;
  });

  // If nothing found, fallback to the whole inner content
  cells.push([finalContent.length ? finalContent : [inner]]);

  // Create table and replace in DOM
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
