/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as in the example
  const header = ['Hero'];
  // Background row (blank)
  const backgroundRow = [''];

  // Find the main content area (.e-con-inner or fallback to element)
  const inner = element.querySelector('.e-con-inner') || element;

  // ---
  // Collect logo image, headline, and location (in the screenshot, all inside the dark overlay box)

  // 1. Logo image
  let logoImg = inner.querySelector('img');

  // 2. Find all text blocks
  // Get all <p> inside .elementor-widget-text-editor, skip empty ones
  let intro = null, title = null;
  const allTextPs = inner.querySelectorAll('.elementor-widget-text-editor p');
  for (const p of allTextPs) {
    const txt = p.textContent.trim();
    if (txt === 'Breve Lançamento' && !intro) {
      intro = p;
    } else if (txt && txt !== 'Breve Lançamento' && !title) {
      // The marketing title
      title = p;
    }
  }

  // 3. Find the location list (in screenshot, under the title, with location icon)
  // Use the actual <ul> for semantic purposes
  let locationUl = inner.querySelector('.elementor-widget-post-info ul');

  // Compose the content cell for row 3, in the screenshot order
  const cellContent = [];
  if (intro) cellContent.push(intro);
  if (logoImg) cellContent.push(logoImg);
  if (title) {
    // Use a heading, matching the example's semantic meaning
    const h1 = document.createElement('h1');
    h1.textContent = title.textContent.trim();
    cellContent.push(h1);
  }
  if (locationUl) cellContent.push(locationUl);

  // Compose the table data
  const contentRow = [cellContent.length ? cellContent : ''];
  const rows = [header, backgroundRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the new table
  element.replaceWith(table);
}
