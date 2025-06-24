/* global WebImporter */
export default function parse(element, { document }) {
  const headerRow = ['Cards (cards3)'];
  const grid = element.querySelector('.elementor-loop-container');
  if (!grid) return;
  const cards = Array.from(grid.querySelectorAll('.e-loop-item'));
  const rows = [headerRow];
  cards.forEach(card => {
    // IMAGE (first cell)
    let imageCell = '';
    const cardImageContainer = card.querySelector('.card-imoveis-item');
    if (cardImageContainer) {
      const img = cardImageContainer.querySelector('img');
      if (img) imageCell = img;
    }
    // TEXT CONTENT (second cell)
    const textParts = [];
    const dataBox = card.querySelector('.card-imoveis-dados');
    if (dataBox) {
      // Status (uppercased)
      const statusWidget = dataBox.querySelector('.status-da-obra-card-imoveis .elementor-widget-container');
      if (statusWidget && statusWidget.textContent.trim()) {
        const p = document.createElement('p');
        p.textContent = statusWidget.textContent.trim();
        p.style.textTransform = 'uppercase';
        textParts.push(p);
      }
      // Title (with link, bold)
      const titleLink = dataBox.querySelector('.elementor-align-left .elementor-widget-container ul li a');
      if (titleLink) {
        // Use the original element (do not clone)
        // Remove icons (if any)
        Array.from(titleLink.querySelectorAll('i,svg')).forEach(icon => icon.remove());
        // Make bold
        const titleText = titleLink.textContent.trim();
        titleLink.textContent = '';
        const strong = document.createElement('strong');
        strong.textContent = titleText;
        titleLink.appendChild(strong);
        titleLink.style.display = 'block';
        textParts.push(titleLink);
      }
      // Location
      const locationLi = dataBox.querySelector('li.elementor-repeater-item-c4a5a20');
      if (locationLi) {
        // Remove icons
        Array.from(locationLi.querySelectorAll('svg')).forEach(icon => icon.remove());
        const locText = locationLi.textContent.trim();
        if (locText) {
          const p = document.createElement('p');
          p.textContent = locText;
          textParts.push(p);
        }
      }
      // Features (list items)
      // Find the last .elementor-post-info in the dataBox (the features)
      const featureUls = dataBox.querySelectorAll('ul.elementor-post-info');
      // The last ul is the features
      if (featureUls.length > 1) {
        const featuresUl = featureUls[featureUls.length - 1];
        Array.from(featuresUl.children).forEach(li => {
          // Remove icons
          Array.from(li.querySelectorAll('svg')).forEach(icon => icon.remove());
          const txt = li.textContent.trim();
          if (txt) {
            const p = document.createElement('p');
            p.textContent = txt;
            textParts.push(p);
          }
        });
      }
    }
    // Compose row
    rows.push([imageCell, textParts]);
  });
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
