/* global WebImporter */
export default function parse(element, { document }) {
  // Get the two main direct child containers (columns)
  const containers = Array.from(element.querySelectorAll(':scope > div'));
  if (containers.length < 2) return;

  // LEFT COLUMN: content (heading, paragraph, button)
  let leftCol = containers[0];
  let leftContent = leftCol.querySelector('.e-con-inner') || leftCol;

  // RIGHT COLUMN: image (background or img tag)
  let rightCol = containers[1];
  let rightContent = document.createTextNode('');

  // Try to find an <img> inside the right column
  const img = rightCol.querySelector('img');
  if (img) {
    rightContent = img;
  } else {
    // Try to get background-image from data-settings
    const settings = rightCol.getAttribute('data-settings');
    let bgUrl = '';
    if (settings) {
      try {
        const sObj = JSON.parse(settings.replace(/&quot;/g, '"'));
        if (sObj.background_image && sObj.background_image.url) {
          bgUrl = sObj.background_image.url;
        }
      } catch(e) {}
    }
    // Or from inline style
    if (!bgUrl && rightCol.style && rightCol.style.backgroundImage) {
      const urlMatch = rightCol.style.backgroundImage.match(/url\(["']?([^"')]+)["']?\)/);
      if (urlMatch) bgUrl = urlMatch[1];
    }
    if (bgUrl) {
      const imgEl = document.createElement('img');
      imgEl.src = bgUrl;
      rightContent = imgEl;
    }
  }

  // Final table: header then row with left + right cell
  const headerRow = ['Columns (columns65)'];
  const contentRow = [leftContent, rightContent];

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);
  element.replaceWith(table);
}
