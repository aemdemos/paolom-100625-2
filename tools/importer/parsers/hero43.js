/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header row, exactly as in the example
  const headerRow = ['Hero'];

  // 2. Image row: find the most prominent/first image in the section
  let imgEl = null;
  // Try to find the first <img> that is not decorative or hidden
  const imgs = Array.from(element.querySelectorAll('img'));
  if (imgs.length > 0) {
    imgEl = imgs[0];
  }
  const imageRow = [imgEl ? imgEl : ''];

  // 3. Content row: gather all heading and paragraph content in source order,
  // excluding breadcrumbs and purely visual elements
  const content = [];

  // Gather all elements that are headings or paragraphs, but not inside breadcrumbs
  const mainContentElements = [];
  const isBreadcrumb = (el) => el.closest('.sensia-breadcrumbs, .breadcrumbs, nav[aria-label="Breadcrumb"]');

  // Collect all headings (h1-h6) and paragraphs, in DOM order, not duplicating
  element.querySelectorAll('h1, h2, h3, h4, h5, h6, p').forEach((el) => {
    if (!isBreadcrumb(el) && el.textContent.trim().length > 0) {
      mainContentElements.push(el);
    }
  });

  // For extra flexibility: if no headings or paragraphs, look for divs with text
  if (mainContentElements.length === 0) {
    element.querySelectorAll('div').forEach((el) => {
      if (!isBreadcrumb(el) && el.textContent.trim().length > 0 && el.children.length === 0) {
        mainContentElements.push(el);
      }
    });
  }

  // Push all content elements into content array preserving their reference
  mainContentElements.forEach((el) => content.push(el));

  // Compose the content cell
  const contentCell = content.length === 0 ? '' : (content.length === 1 ? content[0] : content);

  // Compose rows for the table
  const rows = [
    headerRow,
    imageRow,
    [contentCell]
  ];
  
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element with the new table
  element.replaceWith(block);
}
