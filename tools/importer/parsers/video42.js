/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row for the block
  const headerRow = ['Video (video42)'];

  // 2. Find the main widget (video) and extract all relevant content
  const widget = element.querySelector('[data-widget_type="video.default"]');
  let videoUrl = '';
  let posterImg = null;

  // Fallback: collect block text content
  const blockTextNodes = [];
  // Gather all element text nodes that are not hidden (for edge cases)
  element.querySelectorAll('*').forEach((el) => {
    if (el.childNodes.length === 1 && el.childNodes[0].nodeType === Node.TEXT_NODE) {
      const text = el.textContent.trim();
      if (text && !blockTextNodes.includes(text)) {
        blockTextNodes.push(text);
      }
    }
  });
  // Also check for direct text nodes on the main element
  Array.from(element.childNodes).forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent.trim();
      if (text && !blockTextNodes.includes(text)) {
        blockTextNodes.push(text);
      }
    }
  });

  if (widget) {
    // 2a. Extract video URL from data-settings attribute
    const settingsAttr = widget.getAttribute('data-settings');
    if (settingsAttr) {
      let settingsStr = settingsAttr;
      if (settingsStr.includes('&quot;')) settingsStr = settingsStr.replace(/&quot;/g, '"');
      try {
        const settings = JSON.parse(settingsStr);
        if (settings.youtube_url) videoUrl = settings.youtube_url;
        if (settings.image_overlay && settings.image_overlay.url) {
          posterImg = element.ownerDocument.createElement('img');
          posterImg.src = settings.image_overlay.url;
          posterImg.alt = settings.image_overlay.alt || '';
        }
      } catch (e) {
        // If JSON parse fails, skip
      }
    }
  }

  // 3. Compose the table cell, including all poster images, video links, and text content
  const cellContent = [];
  if (posterImg) cellContent.push(posterImg);
  if (videoUrl) {
    if (cellContent.length) cellContent.push(document.createElement('br'));
    const link = document.createElement('a');
    link.href = videoUrl;
    link.textContent = videoUrl;
    cellContent.push(link);
  }
  // Add any additional text nodes that are not already represented
  if (blockTextNodes.length) {
    if (cellContent.length) cellContent.push(document.createElement('br'));
    blockTextNodes.forEach(txt => {
      const p = document.createElement('p');
      p.textContent = txt;
      cellContent.push(p);
    });
  }

  // 4. Create and insert the table block
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    [cellContent.length ? cellContent : '']
  ], document);
  element.replaceWith(table);
}
