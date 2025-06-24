/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for the block
  const rows = [['Carousel (carousel21)']];

  // Get .e-con-inner if present; otherwise use main element
  const inner = element.querySelector('.e-con-inner') || element;

  // Gather all nodes before the carousel for intro text (heading, paragraph, etc.)
  const nodes = Array.from(inner.children);
  let carouselIdx = nodes.findIndex(n =>
    (n.querySelector && n.querySelector('.elementor-widget-media-carousel')) || (n.classList && n.classList.contains('elementor-widget-media-carousel'))
  );
  // fallback if it is a child container with the carousel
  if (carouselIdx === -1) {
    carouselIdx = nodes.findIndex(n =>
      n.querySelector && n.querySelector('.swiper-wrapper')
    );
  }
  let introNodes = [];
  if (carouselIdx !== -1 && carouselIdx > 0) {
    introNodes = nodes.slice(0, carouselIdx);
  }

  // If there is any intro content (headings, paragraphs), add as a full-width row
  if (introNodes.length) {
    const wrapper = document.createElement('div');
    introNodes.forEach(node => wrapper.appendChild(node));
    rows.push([[wrapper]]); // single cell, full-width row
  }

  // Find carousel widget
  const carouselWidget = element.querySelector('.elementor-widget-media-carousel');
  if (carouselWidget) {
    const swiperWrapper = carouselWidget.querySelector('.swiper-wrapper');
    if (swiperWrapper) {
      // Only unique slides by data-swiper-slide-index
      const seenIndexes = new Set();
      const slides = Array.from(swiperWrapper.children).filter(slide => {
        if (!slide.classList.contains('swiper-slide')) return false;
        const idx = slide.getAttribute('data-swiper-slide-index');
        if (seenIndexes.has(idx)) return false;
        seenIndexes.add(idx);
        return true;
      });
      slides.forEach(slide => {
        // --- IMAGE ---
        let imgEl = null;
        let slideLink = slide.querySelector('a');
        if (slideLink) {
          let imgDiv = slideLink.querySelector('.elementor-carousel-image');
          let imageUrl = '';
          if (imgDiv) {
            if (imgDiv.style.backgroundImage && imgDiv.style.backgroundImage.startsWith('url(')) {
              imageUrl = imgDiv.style.backgroundImage.slice(4, -1).replace(/^"|"$/g, '');
            } else if (imgDiv.getAttribute('data-background')) {
              imageUrl = imgDiv.getAttribute('data-background');
            }
            if (imageUrl) {
              imgEl = document.createElement('img');
              imgEl.src = imageUrl;
              imgEl.loading = 'lazy';
              const alt = imgDiv.getAttribute('aria-label') || slideLink.getAttribute('data-elementor-lightbox-title') || '';
              if (alt) imgEl.alt = alt;
            }
          }
        }
        // --- TEXT ---
        let textCell = '';
        let textContent = [];
        if (slideLink) {
          // Use data-elementor-lightbox-title as heading (if present)
          const title = slideLink.getAttribute('data-elementor-lightbox-title');
          if (title) {
            const h3 = document.createElement('h3');
            h3.textContent = title;
            textContent.push(h3);
          }
          // Use data-elementor-lightbox-description as paragraph (if present)
          const desc = slideLink.getAttribute('data-elementor-lightbox-description');
          if (desc) {
            const p = document.createElement('p');
            p.textContent = desc;
            textContent.push(p);
          }
        }
        if (textContent.length) {
          const wrapper = document.createElement('div');
          textContent.forEach(n => wrapper.appendChild(n));
          textCell = wrapper;
        }
        if (imgEl) {
          rows.push([imgEl, textCell]);
        }
      });
    }
  }
  // Output the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
