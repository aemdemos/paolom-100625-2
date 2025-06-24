/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: Find first heading
  function findHeading(el) {
    const h = el.querySelector('h1, h2, h3, h4, h5, h6');
    return h || null;
  }

  // Helper: Try to get background image from style, data-settings, or child img
  function getBackgroundImage(el) {
    // 1. Inline style
    if (el.style && el.style.backgroundImage) {
      const match = el.style.backgroundImage.match(/url\(["']?(.*?)["']?\)/);
      if (match) {
        const imgEl = document.createElement('img');
        imgEl.src = match[1];
        return imgEl;
      }
    }
    // 2. Elementor data-settings
    if (el.dataset && el.dataset.settings) {
      try {
        const settings = JSON.parse(el.dataset.settings.replace(/&quot;/g, '"'));
        if (settings.background_image && settings.background_image.url) {
          const imgEl = document.createElement('img');
          imgEl.src = settings.background_image.url;
          return imgEl;
        }
      } catch (e) {}
    }
    // 3. Descendant with backgroundImage style
    const bgDiv = el.querySelector('[style*="background-image"]');
    if (bgDiv && bgDiv.style.backgroundImage) {
      const match = bgDiv.style.backgroundImage.match(/url\(["']?(.*?)["']?\)/);
      if (match) {
        const imgEl = document.createElement('img');
        imgEl.src = match[1];
        return imgEl;
      }
    }
    // 4. First <img>
    const img = el.querySelector('img');
    if (img && img.src) {
      return img;
    }
    // 5. No image found
    return '';
  }

  // Helper: Extract content block (heading, paragraphs, lists, cta)
  function getContentBlock(el) {
    const nodes = [];
    // Heading (VISITE NOSSA LOJA)
    const heading = findHeading(el);
    if (heading) nodes.push(heading);
    // Paragraphs
    el.querySelectorAll('p').forEach((p) => {
      if (p.textContent.trim()) nodes.push(p);
    });
    // Icon lists (map, waze links)
    el.querySelectorAll('ul.elementor-icon-list-items').forEach(list => {
      // Only include if there is at least one list-item
      if (list.children.length) nodes.push(list);
    });
    // Button (Agende uma visita)
    const button = el.querySelector('a.elementor-button, .elementor-button-wrapper a');
    if (button) nodes.push(button);
    return nodes;
  }

  // Compose output table
  const cells = [
    ['Hero'],
    [getBackgroundImage(element)],
    [getContentBlock(element)]
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
