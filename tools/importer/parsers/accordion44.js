/* global WebImporter */
export default function parse(element, { document }) {
  // Find the Table of Contents widget
  const tocWidget = element.querySelector('.elementor-widget-table-of-contents');
  if (!tocWidget) return;

  // Header (the accordion label/title)
  const tocHeader = tocWidget.querySelector('.elementor-toc__header-title');
  // Body: list of contents (ol)
  const tocList = tocWidget.querySelector('.elementor-toc__body .elementor-toc__list-wrapper');

  // Prepare the rows for the Accordion block
  // Header row: should be a single column
  const rows = [
    ['Accordion (accordion44)']
  ];

  // Only add the row if there's a title for the accordion (the TOC heading)
  // and some list content
  if (tocHeader || tocList) {
    // Compose the content cell
    // Use tocHeader as the title cell, tocList as the content cell
    // Ensure both are not null, if missing, use an empty div
    const titleCell = tocHeader || document.createElement('div');
    const contentCell = tocList || document.createElement('div');
    rows.push([
      titleCell,
      contentCell
    ]);
  }

  // Create the table and replace the original element
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
