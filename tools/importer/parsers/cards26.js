/* global WebImporter */
export default function parse(element, { document }) {
  // Find cards container
  const grid = element.querySelector('.elementor-loop-container.elementor-grid');
  if (!grid) return;
  const cards = Array.from(grid.querySelectorAll('[data-elementor-type="loop-item"]'));
  const cells = [];
  cells.push(['Cards (cards26)']); // Exact header

  cards.forEach(card => {
    // Image cell
    let img = card.querySelector('.card-imoveis-item img');
    // Text cell
    const textParts = [];

    // Status (top highlight row)
    const statusLi = card.querySelector('.status-da-obra-card-imoveis .elementor-post-info__terms-list-item');
    if (statusLi) {
      const statusDiv = document.createElement('div');
      statusDiv.textContent = statusLi.textContent.trim();
      statusDiv.style.textTransform = 'uppercase';
      statusDiv.style.fontWeight = 'bold';
      textParts.push(statusDiv);
    }

    // Title: from name link (always bold, usually after status)
    const titleLink = card.querySelector('.elementor-element-8fba482 .elementor-post-info__item--type-custom');
    if (titleLink) {
      // Use <strong> to match bold
      const titleStrong = document.createElement('strong');
      // Some titles are inside <a><span> Title </span></a>
      titleStrong.textContent = titleLink.textContent.trim();
      textParts.push(titleStrong);
    }

    // Location
    const location = card.querySelector('.elementor-element-b41a2d1 .elementor-post-info__terms-list-item');
    if (location) {
      const locDiv = document.createElement('div');
      locDiv.textContent = location.textContent.trim();
      textParts.push(locDiv);
    }

    // Property highlights (list after divider)
    const featuresList = card.querySelector(
      '.elementor-element-c9e3915 .elementor-widget-container ul.elementor-post-info'
    );
    if (featuresList) {
      featuresList.querySelectorAll('li').forEach(li => {
        const feature = li.querySelector('.elementor-post-info__terms-list-item');
        if (feature) {
          const featP = document.createElement('p');
          featP.textContent = feature.textContent.trim();
          textParts.push(featP);
        }
      });
    }

    // Compose one row per card: [image, [content]]
    cells.push([
      img,
      textParts
    ]);
  });

  // Create table and replace the original block
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
