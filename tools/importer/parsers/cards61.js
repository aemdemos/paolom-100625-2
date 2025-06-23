/* global WebImporter */
export default function parse(element, { document }) {
  // Prepare table header row exactly as required
  const cells = [['Cards (cards61)']];

  // Find the grid with cards
  const grid = element.querySelector('.elementor-loop-container.elementor-grid');
  if (!grid) return;
  const cards = grid.querySelectorAll('[data-elementor-type="loop-item"]');

  cards.forEach(card => {
    // 1. IMAGE/ICON (left cell)
    let imgEl = null;
    const imgWidget = card.querySelector('.elementor-widget-theme-post-featured-image');
    if (imgWidget) {
      imgEl = imgWidget.querySelector('img');
    }
    // 2. TEXT CONTENT (right cell)
    const textContent = [];
    // a) Status (first .status-da-obra-card-imoveis)
    const statusWidget = card.querySelector('.status-da-obra-card-imoveis .elementor-post-info__terms-list-item');
    if (statusWidget && statusWidget.textContent.trim()) {
      const statusDiv = document.createElement('div');
      statusDiv.textContent = statusWidget.textContent.trim();
      statusDiv.style.fontWeight = 'bold';
      statusDiv.style.textTransform = 'uppercase';
      textContent.push(statusDiv);
    }
    // b) Title (next .elementor-widget-post-info with anchor, NOT the status)
    // There may be multiple, so select all and choose one with a link
    const postInfoWidgets = card.querySelectorAll('.elementor-widget-post-info');
    let foundTitle = false;
    for (let pi of postInfoWidgets) {
      const a = pi.querySelector('a');
      if (a && a.textContent.trim()) {
        const titleDiv = document.createElement('div');
        titleDiv.innerHTML = `<strong>${a.textContent.trim()}</strong>`;
        textContent.push(titleDiv);
        foundTitle = true;
        break;
      }
    }
    // c) Location (find .elementor-post-info__terms-list-item *after* title)
    // The location is the next .elementor-post-info__terms-list-item which is not status and not in the cta/features list
    // Collect all .elementor-post-info__terms-list-item elements
    const allListItems = card.querySelectorAll('.elementor-post-info__terms-list-item');
    // Find status and title values for filtering
    const statusText = statusWidget ? statusWidget.textContent.trim() : '';
    let titleText = '';
    for (let pi of postInfoWidgets) {
      const a = pi.querySelector('a');
      if (a && a.textContent.trim()) {
        titleText = a.textContent.trim();
        break;
      }
    }
    // Location is the first item that's not status or any in the last features set
    let featureStartIdx = -1;
    // Find the features list, which is the last .elementor-widget-post-info
    if (postInfoWidgets.length > 0) {
      const lastInfo = postInfoWidgets[postInfoWidgets.length - 1];
      const featuresList = lastInfo.querySelectorAll('.elementor-post-info__terms-list-item');
      if (featuresList.length > 0) {
        // Index in allListItems where features start
        featureStartIdx = Array.prototype.indexOf.call(allListItems, featuresList[0]);
      }
    }
    // Find first location candidate before the features section
    let locationFound = false;
    for (let i = 0; i < allListItems.length; i++) {
      const text = allListItems[i].textContent.trim();
      if (
        i < featureStartIdx &&
        text !== statusText &&
        text !== titleText &&
        text
      ) {
        const locDiv = document.createElement('div');
        locDiv.textContent = text;
        textContent.push(locDiv);
        locationFound = true;
        break;
      }
    }
    // d) Feature items (in last .elementor-widget-post-info)
    if (featureStartIdx >= 0) {
      for (let j = featureStartIdx; j < allListItems.length; j++) {
        const feat = allListItems[j];
        if (feat.textContent.trim()) {
          const featDiv = document.createElement('div');
          featDiv.textContent = feat.textContent.trim();
          textContent.push(featDiv);
        }
      }
    }

    // Compose the row: [image, [textContent...]]
    cells.push([imgEl, textContent]);
  });

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
