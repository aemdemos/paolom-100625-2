/* global WebImporter */
export default function parse(element, { document }) {
  // Hero block table header per example
  const headerRow = ['Hero'];

  // Find background image (if any)
  let backgroundImageElem = null;

  // Try to find an <img> element inside the block
  const img = element.querySelector('img');
  if (img) {
    backgroundImageElem = img;
  } else {
    // Try to get background-image from style attribute
    let bgUrl = null;
    const styleAttr = element.getAttribute('style');
    if (styleAttr) {
      const match = styleAttr.match(/background-image:\s*url\(['"]?([^'"]+)['"]?\)/i);
      if (match) {
        bgUrl = match[1];
      }
    }
    // Try data-settings background_image.url (elementor)
    if (!bgUrl && element.dataset && element.dataset.settings) {
      try {
        const settings = JSON.parse(element.dataset.settings);
        if (settings.background_image && settings.background_image.url) {
          bgUrl = settings.background_image.url;
        }
      } catch(e) {}
    }
    if (bgUrl) {
      backgroundImageElem = document.createElement('img');
      backgroundImageElem.src = bgUrl;
      backgroundImageElem.loading = 'lazy';
    }
  }

  // Gather hero content: heading(s) and paragraph(s)
  const heroContent = [];
  // Heading (h1/h2/h3 or .elementor-heading-title)
  const heading = element.querySelector('h1, h2, h3, .elementor-heading-title');
  if (heading) {
    heroContent.push(heading);
  }
  // Subheading/paragraph (from .elementor-widget-text-editor)
  const textWidget = element.querySelector('.elementor-widget-text-editor');
  if (textWidget) {
    // Try to find a <p> inside
    const p = textWidget.querySelector('p');
    if (p) {
      heroContent.push(p);
    } else {
      heroContent.push(textWidget);
    }
  }

  // Ensure the structure is always 3 rows, 1 column
  const cells = [
    headerRow,
    [backgroundImageElem || ''],
    [heroContent.length ? heroContent : ''],
  ];
  
  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the original element
  element.replaceWith(block);
}
