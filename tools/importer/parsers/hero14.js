/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: get all direct children divs for robust structure
  const children = Array.from(element.querySelectorAll(':scope > div'));
  let contentDiv = null;
  for (const child of children) {
    if (child.querySelector('.e-con-inner')) {
      contentDiv = child.querySelector('.e-con-inner');
      break;
    }
  }
  if (!contentDiv) contentDiv = element;

  // Gather widget containers
  const widgets = Array.from(contentDiv.children);

  let heading = null;
  let paragraph = null;
  let cta = null;
  let backgroundImgEl = null;

  // Find heading, paragraph, cta, and image overlay
  for (const widget of widgets) {
    // Heading
    const h = widget.querySelector('.elementor-heading-title');
    if (h && !heading) heading = h;
    // Text paragraph
    const p = widget.querySelector('p');
    if (p && !paragraph) paragraph = p;
    // CTA
    const a = widget.querySelector('a');
    if (a && !cta) cta = a;
    // Background image from video overlay
    if (
      widget.classList.contains('elementor-widget-video') &&
      !backgroundImgEl
    ) {
      // Try to get overlay image from style
      const overlayDiv = widget.querySelector('.elementor-custom-embed-image-overlay');
      if (overlayDiv && overlayDiv.style && overlayDiv.style.backgroundImage) {
        const bgUrlMatch = overlayDiv.style.backgroundImage.match(/url\(["']?(.*?)["']?\)/);
        if (bgUrlMatch && bgUrlMatch[1]) {
          backgroundImgEl = document.createElement('img');
          backgroundImgEl.src = bgUrlMatch[1];
          backgroundImgEl.alt = '';
        }
      }
    }
  }

  // Compose the bottom cell (may have heading, para, CTA)
  const contentFragment = document.createDocumentFragment();
  if (heading) contentFragment.appendChild(heading);
  if (paragraph) contentFragment.appendChild(paragraph);
  if (cta) contentFragment.appendChild(cta);

  // The Hero table always has a header row: 'Hero', then bg image, then content.
  const rows = [
    ['Hero'],
    [backgroundImgEl ? backgroundImgEl : ''],
    [contentFragment]
  ];

  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
