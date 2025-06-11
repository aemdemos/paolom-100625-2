/* global WebImporter */
export default function parse(element, { document }) {
  // Find the card grid container
  const grid = element.querySelector('.elementor-loop-container.elementor-grid');
  if (!grid) return;
  const cards = grid.querySelectorAll('[data-elementor-type="loop-item"]');
  const cells = [];
  // Table header row: block name exactly as example
  cells.push(['Cards (cards40)']);
  // For each card, extract image and text content
  cards.forEach(card => {
    // --- Left cell: image ---
    let img = null;
    const imgLink = card.querySelector('.elementor-widget-theme-post-featured-image a');
    if (imgLink) {
      img = imgLink.querySelector('img');
    }
    // --- Right cell: text content ---
    const dataBox = card.querySelector('.card-imoveis-dados');
    const contentElements = [];
    let titleText = '';
    if (dataBox) {
      // Status (usually upper-case): first .status-da-obra-card-imoveis .elementor-post-info__terms-list-item
      const statusLi = dataBox.querySelector('.status-da-obra-card-imoveis .elementor-post-info__terms-list-item');
      if (statusLi) {
        const divStatus = document.createElement('div');
        divStatus.textContent = statusLi.textContent.trim();
        contentElements.push(divStatus);
      }
      // Title: the text node inside .elementor-post-info__item--type-custom (which is inside an <a>)
      const titleEl = dataBox.querySelector('.elementor-post-info__item--type-custom');
      if (titleEl) {
        titleText = titleEl.textContent.trim();
        const strong = document.createElement('strong');
        strong.textContent = titleText;
        const divTitle = document.createElement('div');
        divTitle.appendChild(strong);
        contentElements.push(divTitle);
      }
      // Location: find .elementor-post-info__item--type-terms inside the next .elementor-inline-items
      const allLocationLis = dataBox.querySelectorAll('.elementor-post-info__item--type-terms .elementor-post-info__terms-list-item');
      for (let i = 0; i < allLocationLis.length; i++) {
        const txt = allLocationLis[i].textContent.trim();
        // Avoid status (already grabbed) and avoid duplicate title
        if ((!(statusLi && txt === statusLi.textContent.trim())) && txt !== titleText) {
          const divLoc = document.createElement('div');
          divLoc.textContent = txt;
          contentElements.push(divLoc);
        }
      }
      // Features (li's inside the second ul, if present)
      const uls = dataBox.querySelectorAll('ul.elementor-post-info');
      if (uls.length > 1) {
        const featuresLis = uls[1].querySelectorAll('li');
        featuresLis.forEach(li => {
          // Remove icon
          const icon = li.querySelector('.elementor-icon-list-icon');
          if (icon) icon.remove();
          const text = li.textContent.trim();
          // Avoid duplicate title
          if (text && text !== titleText) {
            const div = document.createElement('div');
            div.textContent = text;
            contentElements.push(div);
          }
        });
      } else if (uls.length === 1) {
        const featureLis = Array.from(uls[0].querySelectorAll('li'));
        featureLis.forEach((li, idx) => {
          if (featureLis.length > 2 && idx > 1) {
            const icon = li.querySelector('.elementor-icon-list-icon');
            if (icon) icon.remove();
            const text = li.textContent.trim();
            if (text && text !== titleText) {
              const div = document.createElement('div');
              div.textContent = text;
              contentElements.push(div);
            }
          } else if (featureLis.length <= 2 && idx > 0) {
            const icon = li.querySelector('.elementor-icon-list-icon');
            if (icon) icon.remove();
            const text = li.textContent.trim();
            if (text && text !== titleText) {
              const div = document.createElement('div');
              div.textContent = text;
              contentElements.push(div);
            }
          }
        });
      }
    } else {
      const fallbackText = card.textContent.trim();
      if (fallbackText) {
        const div = document.createElement('div');
        div.textContent = fallbackText;
        contentElements.push(div);
      }
    }
    // Push this card row
    cells.push([img, contentElements]);
  });
  // Replace element with the table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
