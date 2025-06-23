/* global WebImporter */
export default function parse(element, { document }) {
  // Header must match exactly
  const headerRow = ['Carousel (carousel21)'];

  // Find the carousel widget (with slides)
  const carouselWidget = element.querySelector('.elementor-widget-media-carousel, .elementor-skin-carousel');
  if (!carouselWidget) return;
  const swiperWrapper = carouselWidget.querySelector('.swiper-wrapper');
  if (!swiperWrapper) return;

  // Get all non-duplicate slides; fallback to all if none
  let allSlides = Array.from(swiperWrapper.children).filter(el => el.classList.contains('swiper-slide'));
  let slides = allSlides.filter(el => !el.classList.contains('swiper-slide-duplicate'));
  if (slides.length === 0) slides = allSlides;
  if (slides.length === 0) return;

  // Compose each row for each slide
  function getSlideImage(slide) {
    const bg = slide.querySelector('.elementor-carousel-image');
    let imgUrl = '';
    let alt = '';
    if (bg) {
      // Try style (background-image)
      const style = bg.getAttribute('style') || '';
      const m = style.match(/background-image:\s*url\(["']?([^"')]+)["']?\)/);
      if (m) {
        imgUrl = m[1];
      } else if (bg.hasAttribute('data-background')) {
        imgUrl = bg.getAttribute('data-background');
      }
      alt = bg.getAttribute('aria-label') || '';
    }
    if (!imgUrl) {
      const img = slide.querySelector('img');
      if (img) {
        imgUrl = img.src;
        alt = img.alt || '';
      }
    }
    if (!imgUrl) return '';
    const imgElem = document.createElement('img');
    imgElem.src = imgUrl;
    imgElem.alt = alt;
    imgElem.loading = 'eager';
    return imgElem;
  }

  function getSlideText(slide) {
    // Try to get title and description from the anchor attributes
    const link = slide.querySelector('a');
    let title = '', desc = '';
    if (link) {
      title = link.getAttribute('data-elementor-lightbox-title') || '';
      desc = link.getAttribute('data-elementor-lightbox-description') || '';
    }
    // Fallback: aria-label on .elementor-carousel-image
    if (!title) {
      const bg = slide.querySelector('.elementor-carousel-image');
      if (bg) title = bg.getAttribute('aria-label') || '';
    }
    // Compose as semantic HTML: heading and paragraph if available
    const content = [];
    if (title) {
      const h3 = document.createElement('h3');
      h3.textContent = title;
      content.push(h3);
    }
    if (desc) {
      const p = document.createElement('p');
      p.textContent = desc;
      content.push(p);
    }
    // If no content, return empty string to ensure cell is not missing
    return content.length > 0 ? content : '';
  }

  // Compose rows for each slide
  const rows = slides.map(slide => {
    return [getSlideImage(slide), getSlideText(slide)];
  });

  // Build the cell matrix
  // Check for heading/text content blocks above the carousel, and preserve them
  // (If not part of the carousel block, do NOT add them per the example markdown)
  const cells = [headerRow, ...rows];
  
  // Create and replace
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
