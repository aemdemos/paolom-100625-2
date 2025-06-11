/* global WebImporter */
export default function parse(element, { document }) {
  const headerRow = ['Cards (cards29)'];
  const grid = element.querySelector('.elementor-loop-container.elementor-grid');
  if (!grid) return;
  const cardEls = Array.from(grid.querySelectorAll('div[data-elementor-type="loop-item"]'));

  function extractCardText(box) {
    // Extract status (first li in first ul inside .status-da-obra-card-imoveis)
    let status = null;
    const statusLi = box.querySelector('.status-da-obra-card-imoveis li');
    if (statusLi && statusLi.textContent.trim()) {
      status = statusLi.textContent.trim();
    }
    // Extract title (from .elementor-post-info__item--type-custom)
    let title = null;
    let link = null;
    const titleSpan = box.querySelector('.elementor-post-info__item--type-custom');
    if (titleSpan) {
      title = titleSpan.textContent.trim();
      const a = titleSpan.closest('a');
      if (a) link = a.getAttribute('href');
    }
    // Extract location (first .elementor-post-info__item--type-terms after status block)
    let location = null;
    let locationFound = false;
    const infoItems = Array.from(box.querySelectorAll('.elementor-post-info__item--type-terms'));
    for (const item of infoItems) {
      // Only take location if not status and not in the last ul (features)
      // Check if inside status block
      if (item.closest('.status-da-obra-card-imoveis')) continue;
      // Check if inside the last ul (feature list)
      const parentUl = item.closest('ul');
      const allUls = Array.from(box.querySelectorAll('ul'));
      if (parentUl && allUls.length && parentUl === allUls[allUls.length - 1]) continue;
      // Only pick the first suitable location
      if (!locationFound) {
        location = item.textContent.trim();
        locationFound = true;
      }
    }
    // Extract features/description (the lis in the last ul)
    let descLis = [];
    const allUls = Array.from(box.querySelectorAll('ul'));
    if (allUls.length) {
      const lastUl = allUls[allUls.length-1];
      descLis = Array.from(lastUl.querySelectorAll('li')).map(li => li.textContent.trim()).filter(Boolean);
    }
    // Remove possible status/location duplicates from descLis
    descLis = descLis.filter(text => {
      if (status && text === status) return false;
      if (location && text === location) return false;
      return true;
    });
    // Compose as per example: status, title, location, description(s)
    const frag = document.createDocumentFragment();
    if (status) {
      const p = document.createElement('p');
      p.textContent = status;
      frag.appendChild(p);
    }
    if (title) {
      const strong = document.createElement('strong');
      if (link) {
        const a = document.createElement('a');
        a.href = link;
        a.textContent = title;
        strong.appendChild(a);
      } else {
        strong.textContent = title;
      }
      frag.appendChild(strong);
      frag.appendChild(document.createElement('br'));
    }
    if (location) {
      const span = document.createElement('span');
      span.textContent = location;
      frag.appendChild(span);
      frag.appendChild(document.createElement('br'));
    }
    if (descLis.length > 0) {
      descLis.forEach(desc => {
        const span = document.createElement('span');
        span.textContent = desc;
        frag.appendChild(span);
        frag.appendChild(document.createElement('br'));
      });
    }
    return frag;
  }

  const rows = cardEls.map(card => {
    // Image (first cell)
    let img = card.querySelector('.elementor-widget-theme-post-featured-image img');
    if (!img) img = card.querySelector('img');
    // Text (second cell)
    const textBox = card.querySelector('.card-imoveis-dados');
    let textCell = null;
    if (textBox) {
      textCell = extractCardText(textBox);
    } else {
      textCell = document.createTextNode('');
    }
    return [img, textCell];
  });

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);
  element.replaceWith(table);
}
