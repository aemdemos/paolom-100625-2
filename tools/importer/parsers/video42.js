/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: must match example
  const headerRow = ['Video (video42)'];

  // Content extraction: pull all poster/image, link, and text content relevant for the video block
  let contentArr = [];

  // Get the video widget block
  const videoWidget = element.querySelector('.elementor-widget-video');
  let videoUrl = '';
  let posterImg = null;

  if (videoWidget) {
    // Parse settings for video link and overlay image
    const settingsStr = videoWidget.getAttribute('data-settings');
    let settings = {};
    if (settingsStr) {
      try {
        settings = JSON.parse(settingsStr.replace(/&quot;/g, '"'));
      } catch (e) {}
    }
    if (settings.youtube_url) {
      videoUrl = settings.youtube_url;
    }
    if (settings.image_overlay && settings.image_overlay.url) {
      posterImg = document.createElement('img');
      posterImg.src = settings.image_overlay.url;
      posterImg.alt = settings.image_overlay.alt || '';
    } else {
      // Fallback: check for overlay style
      const overlay = videoWidget.querySelector('.elementor-custom-embed-image-overlay');
      if (overlay) {
        const style = overlay.getAttribute('style') || '';
        const match = style.match(/url\(['"]?([^'")]+)['"]?\)/);
        if (match) {
          posterImg = document.createElement('img');
          posterImg.src = match[1];
          posterImg.alt = '';
        }
      }
    }
    // Grab all text content
    const textNodes = [];
    videoWidget.querySelectorAll('*').forEach((el) => {
      Array.from(el.childNodes).forEach((node) => {
        if (node.nodeType === 3 && node.textContent.trim()) {
          const span = document.createElement('span');
          span.textContent = node.textContent.trim();
          textNodes.push(span);
        }
      });
    });
    // Compose content order: poster, text, video link
    if (posterImg) contentArr.push(posterImg);
    textNodes.forEach((t) => contentArr.push(t));
    if (videoUrl) {
      if (contentArr.length) contentArr.push(document.createElement('br'));
      const link = document.createElement('a');
      link.href = videoUrl;
      link.textContent = videoUrl;
      contentArr.push(link);
    }
  }

  // Fallback: if widget missing, put all element's child content
  if (!contentArr.length) {
    contentArr = Array.from(element.childNodes);
  }

  // Compose table
  const cells = [
    headerRow,
    [contentArr.length ? contentArr : ['']]
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
