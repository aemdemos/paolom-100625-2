/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as in the requirements
  const headerRow = ['Carousel (carousel34)'];
  const rows = [headerRow];

  // Find the swiper wrapper with slides
  const swiperWrapper = element.querySelector('.swiper-wrapper');
  if (!swiperWrapper) return;

  // To avoid duplicates, only use the first occurrence of each data-swiper-slide-index
  const seenIndexes = new Set();
  const slides = [];
  swiperWrapper.querySelectorAll(':scope > .swiper-slide').forEach((slide) => {
    const idx = slide.getAttribute('data-swiper-slide-index');
    if (idx !== null && !seenIndexes.has(idx)) {
      seenIndexes.add(idx);
      slides.push(slide);
    }
  });

  slides.forEach((slide) => {
    // Each slide is structured as <a><div.image/><div.overlay/></a>
    const link = slide.querySelector('a');

    // Image extraction
    let imgUrl = '';
    let imgAlt = '';
    if (link) {
      const imgDiv = link.querySelector('.elementor-carousel-image');
      if (imgDiv) {
        let bg = imgDiv.style.backgroundImage;
        if (!bg && imgDiv.hasAttribute('data-background')) {
          bg = `url(${imgDiv.getAttribute('data-background')})`;
        }
        let urlMatch = bg && bg.match(/url\(["']?(.*?)["']?\)/);
        if (urlMatch && urlMatch[1]) {
          imgUrl = urlMatch[1];
        }
        imgAlt = imgDiv.getAttribute('aria-label') || '';
      }
    }
    let imgEl = undefined;
    if (imgUrl) {
      imgEl = document.createElement('img');
      imgEl.src = imgUrl;
      if (imgAlt) imgEl.alt = imgAlt;
    }

    // Text extraction
    let textCellContent = '';
    if (link) {
      const overlay = link.querySelector('.elementor-carousel-image-overlay');
      if (overlay) {
        // Create a heading element for the overlay text
        const heading = document.createElement('h2');
        heading.textContent = overlay.textContent.trim();
        textCellContent = heading;
      }
    }

    rows.push([
      imgEl || '',
      textCellContent || ''
    ]);
  });

  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
