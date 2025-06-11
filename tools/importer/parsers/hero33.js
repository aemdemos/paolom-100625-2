/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as in the example
  const headerRow = ['Hero'];

  // Attempt to extract the background image (from video overlay)
  let backgroundImg = '';
  const videoWidget = element.querySelector('.elementor-widget-video');
  if (videoWidget) {
    const overlayDiv = videoWidget.querySelector('.elementor-custom-embed-image-overlay');
    if (overlayDiv && overlayDiv.style.backgroundImage) {
      const bg = overlayDiv.style.backgroundImage;
      const urlMatch = bg.match(/url\(['"]?([^'")]+)['"]?\)/);
      if (urlMatch && urlMatch[1]) {
        backgroundImg = document.createElement('img');
        backgroundImg.src = urlMatch[1];
      }
    }
  }

  // Gather all content elements for the third row
  const contentElements = [];

  // Title (heading)
  const headingWidget = element.querySelector('.elementor-widget-heading .elementor-widget-container');
  if (headingWidget) {
    const h2 = headingWidget.querySelector('h2');
    if (h2) contentElements.push(h2);
  }

  // Subheading/paragraph(s)
  const textWidget = element.querySelector('.elementor-widget-text-editor .elementor-widget-container');
  if (textWidget) {
    const ps = textWidget.querySelectorAll('p');
    ps.forEach(p => contentElements.push(p));
  }

  // Video: represent as a link to the video (if present)
  if (videoWidget) {
    const settingsJSON = videoWidget.getAttribute('data-settings');
    if (settingsJSON) {
      try {
        const settings = JSON.parse(settingsJSON.replace(/&quot;/g,'"'));
        if (settings.youtube_url) {
          const videoLink = document.createElement('a');
          videoLink.href = settings.youtube_url;
          videoLink.textContent = 'Ver vídeo';
          contentElements.push(videoLink);
        }
      } catch (e) {}
    }
  }

  // Call-to-action button (link)
  const buttonWidget = element.querySelector('.elementor-widget-button .elementor-widget-container');
  if (buttonWidget) {
    const a = buttonWidget.querySelector('a');
    if (a) contentElements.push(a);
  }

  // Compose the block table as in the example: 1 column, 3 rows
  const cells = [
    headerRow,
    [backgroundImg ? backgroundImg : ''],
    [contentElements.length ? contentElements : '']
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
