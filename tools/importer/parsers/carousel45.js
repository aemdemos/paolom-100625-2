/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main slides wrapper
  const slidesWrapper = element.querySelector('.elementor-slides-wrapper, .swiper-wrapper');
  if (!slidesWrapper) return;

  // Find all unique slides
  const slideElsAll = Array.from(slidesWrapper.children).filter((el) => el.classList.contains('swiper-slide'));
  const seen = new Set();
  const slides = [];
  slideElsAll.forEach((el) => {
    const idx = el.getAttribute('data-swiper-slide-index');
    if (idx !== null && !seen.has(idx)) {
      seen.add(idx);
      slides.push(el);
    }
  });
  if (slides.length === 0) return;

  // Helper: Extract image from slide (only if present and real)
  function getSlideImage(slideEl) {
    // Try to get <img>
    const img = slideEl.querySelector('img');
    if (img) return img;
    // Try inline style background-image
    const bgDiv = slideEl.querySelector('.swiper-slide-bg');
    if (bgDiv && bgDiv.style && bgDiv.style.backgroundImage) {
      const match = bgDiv.style.backgroundImage.match(/url\(["']?(.*?)["']?\)/);
      if (match && match[1]) {
        const imgEl = document.createElement('img');
        imgEl.src = match[1];
        return imgEl;
      }
    }
    // Try data-background attribute
    if (bgDiv && bgDiv.hasAttribute('data-background')) {
      const imgEl = document.createElement('img');
      imgEl.src = bgDiv.getAttribute('data-background');
      return imgEl;
    }
    return null;
  }

  // Helper: Extract text content from slide (only if present and real)
  function getSlideText(slideEl) {
    // .swiper-slide-inner can be a <a> or <div>
    let inner = slideEl.querySelector('.swiper-slide-inner');
    if (inner) {
      // Look for .swiper-slide-contents inside .swiper-slide-inner
      const content = inner.querySelector('.swiper-slide-contents');
      if (content && content.childNodes.length > 0 && content.textContent.trim()) {
        return content;
      }
      // If inner itself has visible text (rare)
      if (inner.childNodes.length > 0 && inner.textContent.trim()) {
        return inner;
      }
    }
    // Fallback: direct .swiper-slide-contents
    const content = slideEl.querySelector('.swiper-slide-contents');
    if (content && content.childNodes.length > 0 && content.textContent.trim()) {
      return content;
    }
    // Otherwise, return null (don't invent)
    return null;
  }

  const cells = [
    ['Carousel (carousel45)']
  ];

  slides.forEach((slideEl) => {
    const img = getSlideImage(slideEl);
    const text = getSlideText(slideEl);
    // Only add a row if at least one of img or text is present
    if (img || text) {
      cells.push([
        img || '',
        text || ''
      ]);
    }
  });

  // Only create the table if there is at least 1 row of content (besides header)
  if (cells.length > 1) {
    const block = WebImporter.DOMUtils.createTable(cells, document);
    element.replaceWith(block);
  }
}
