/* global WebImporter */
export default function parse(element, { document }) {
  // Table header must match example
  const headerRow = ['Video (video24)'];

  // Look for the widget with video settings
  const widget = element.querySelector('[data-widget_type="video.default"]');
  let videoUrl = '';
  let posterImgUrl = '';

  if (widget) {
    let settings = {};
    try {
      settings = JSON.parse(widget.getAttribute('data-settings') || '{}');
    } catch(e) {
      settings = {};
    }
    videoUrl = settings.youtube_url || '';
    posterImgUrl = (settings.image_overlay && settings.image_overlay.url) || '';
  }

  // Prepare poster image element if available
  let posterImg = null;
  if (posterImgUrl) {
    posterImg = document.createElement('img');
    posterImg.src = posterImgUrl;
    posterImg.alt = '';
  }

  // Prepare the video url as a link if available
  let videoLink = null;
  if (videoUrl) {
    videoLink = document.createElement('a');
    videoLink.href = videoUrl;
    videoLink.textContent = videoUrl;
  }

  // Compose the content row, matching the example structure (image, then link)
  const contentRowItems = [];
  if (posterImg) contentRowItems.push(posterImg);
  if (videoLink) {
    if (contentRowItems.length) {
      contentRowItems.push(document.createElement('br'));
    }
    contentRowItems.push(videoLink);
  }
  // If both are missing, ensure at least an empty cell so table structure is correct
  if (!contentRowItems.length) contentRowItems.push('');

  const cells = [
    headerRow,
    [contentRowItems.length === 1 ? contentRowItems[0] : contentRowItems],
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
