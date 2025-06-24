/* global WebImporter */
export default function parse(element, { document }) {
  // Find the slides wrapper
  const swiperWrapper = element.querySelector('.swiper-wrapper, .elementor-slides');
  if (!swiperWrapper) return;

  // Get all direct swiper-slide children (ignore duplicate slides except for the main sequence)
  const rawSlides = Array.from(swiperWrapper.children).filter((slide) => slide.classList.contains('swiper-slide'));

  // To prevent duplicate slide rows (from Swiper's infinite carousel), keep only the first occurrence of each data-swiper-slide-index
  const seenIndices = new Set();
  const slides = rawSlides.filter((slide) => {
    const idx = slide.getAttribute('data-swiper-slide-index');
    if (idx == null) return true;
    if (seenIndices.has(idx)) return false;
    seenIndices.add(idx);
    return true;
  });

  const rows = slides.map((slide) => {
    // IMAGE: Try to get image from bg <div> style or <img>
    let imageUrl = '';
    let width = '';
    let height = '';
    const bgDiv = slide.querySelector('.swiper-slide-bg');
    if (bgDiv) {
      // Try style.backgroundImage
      const bgImg = bgDiv.style.backgroundImage;
      if (bgImg && bgImg !== 'none') {
        const match = bgImg.match(/url\(["']?(.*?)["']?\)/);
        if (match && match[1]) {
          imageUrl = match[1];
        }
      }
      // Some implementations use data-bg
      if (!imageUrl && bgDiv.dataset && bgDiv.dataset.swiperSlideBg) {
        imageUrl = bgDiv.dataset.swiperSlideBg;
      }
    }
    if (!imageUrl) {
      // Try <img> element
      const img = slide.querySelector('img');
      if (img) {
        imageUrl = img.src;
        width = img.width;
        height = img.height;
      }
    }
    let imgEl = '';
    if (imageUrl) {
      imgEl = document.createElement('img');
      imgEl.src = imageUrl;
      if (width) imgEl.setAttribute('width', width);
      if (height) imgEl.setAttribute('height', height);
      imgEl.loading = 'lazy';
    }
    // TEXT CONTENT: grab direct contents of .swiper-slide-inner > .swiper-slide-contents, or both
    let textContent = '';
    let inner = slide.querySelector('.swiper-slide-inner');
    let contents = inner ? inner.querySelector('.swiper-slide-contents') : null;
    let container = contents || inner;
    if (container) {
      // Collect only element nodes with meaningful content
      const meaningfulNodes = Array.from(container.childNodes).filter(n => {
        if (n.nodeType === 1) return true;
        if (n.nodeType === 3 && n.textContent.trim()) return true;
        return false;
      });
      if (meaningfulNodes.length > 0) {
        // Instead of cloning, move nodes (if not in dom elsewhere)
        // But for safety, reference the container itself if possible
        textContent = container;
      }
    }
    return [imgEl, textContent];
  }).filter(row => row[0]); // only keep slides with image

  // Compose the table rows per block spec
  const cells = [
    ['Carousel (carousel45)'],
    ...rows
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
