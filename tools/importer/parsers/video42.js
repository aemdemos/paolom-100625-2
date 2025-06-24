/* global WebImporter */
export default function parse(element, { document }) {
  // The block name, exactly matching the example
  const headerRow = ['Video (video42)'];

  // Locate the elementor-widget-video container
  const videoWidget = element.querySelector('.elementor-widget-video');

  // Prepare poster image, video link, and any visible text content
  let posterImgEl = null;
  let videoLinkEl = null;
  let overlayText = [];

  if (videoWidget) {
    // Extract settings for video URL and poster image
    const settings = videoWidget.getAttribute('data-settings');
    if (settings) {
      try {
        const settingsObj = JSON.parse(settings);
        // Video URL
        if (settingsObj.youtube_url) {
          videoLinkEl = document.createElement('a');
          videoLinkEl.href = settingsObj.youtube_url;
          videoLinkEl.textContent = settingsObj.youtube_url;
        }
        // Poster image
        if (settingsObj.image_overlay && settingsObj.image_overlay.url) {
          posterImgEl = document.createElement('img');
          posterImgEl.src = settingsObj.image_overlay.url;
          posterImgEl.alt = '';
        }
      } catch(e) { /* fail silently */ }
    }
    // Find overlay text in the widget (for accessibility or titles)
    const overlay = videoWidget.querySelector('.elementor-custom-embed-image-overlay');
    if (overlay) {
      // Gather text nodes or text content from children (e.g. headings, divs)
      // Ignore play button
      overlay.childNodes.forEach(node => {
        if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
          overlayText.push(document.createTextNode(node.textContent.trim()));
        } else if (node.nodeType === Node.ELEMENT_NODE && node.className !== 'elementor-custom-embed-play') {
          const text = node.textContent.trim();
          if (text) {
            overlayText.push(document.createTextNode(text));
          }
        }
      });
    }
  }

  // Compose the cell content: poster image, overlay text, and link (in order)
  const cellContent = [];
  if (posterImgEl) cellContent.push(posterImgEl);
  if (overlayText.length) {
    if (posterImgEl) cellContent.push(document.createElement('br'));
    overlayText.forEach(t => { cellContent.push(t); cellContent.push(document.createElement('br')); });
  }
  if (videoLinkEl) {
    if (cellContent.length) cellContent.push(document.createElement('br'));
    cellContent.push(videoLinkEl);
  }

  // If there's no poster image, overlay text, or link, fallback to including all content
  if (cellContent.length === 0) {
    // Reference all child elements, preserving structure and text
    cellContent.push(...Array.from(element.childNodes));
  }

  // Build the table: header and content row
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    [cellContent],
  ], document);

  // Replace the original element
  element.replaceWith(table);
}
