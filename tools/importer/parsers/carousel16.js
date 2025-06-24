/* global WebImporter */
export default function parse(element, { document }) {
  // Build table header
  const cells = [['Carousel (carousel16)']];

  // Find the carousel widget
  const carouselWidget = element.querySelector('[data-widget_type="media-carousel.default"]');
  if (!carouselWidget) return;
  const swiper = carouselWidget.querySelector('.swiper-wrapper');
  if (!swiper) return;

  // Get all direct children of element
  const directChildren = Array.from(element.children);
  // Find the first occurrence of the carouselWidget among children
  const carouselIdx = directChildren.findIndex(child => child.contains(carouselWidget));
  // Everything before the carousel is the left content
  let leftCellElements = [];
  if (carouselIdx > 0) {
    leftCellElements = directChildren.slice(0, carouselIdx);
  }

  // Get all unique slides (non-duplicate)
  const slides = Array.from(swiper.children).filter(slide =>
    slide.classList.contains('swiper-slide') &&
    !slide.classList.contains('swiper-slide-duplicate')
  );

  slides.forEach((slide, idx) => {
    // The image is a background-image on a div, possibly inside an <a>
    let imgDiv = slide.querySelector('.elementor-carousel-image');
    let imgUrl = null;
    let altText = '';
    if (imgDiv) {
      // Try style background-image
      const bg = imgDiv.style.backgroundImage;
      if (bg) {
        const match = bg.match(/url\(["']?(.*?)["']?\)/);
        if (match && match[1]) imgUrl = match[1];
      }
      // Fallback to data-background
      if (!imgUrl && imgDiv.dataset.background) {
        imgUrl = imgDiv.dataset.background;
      }
      if (imgDiv.getAttribute('aria-label')) {
        altText = imgDiv.getAttribute('aria-label');
      }
    }
    if (!imgUrl) return;
    // Create the image element
    const img = document.createElement('img');
    img.src = imgUrl;
    if (altText) img.alt = altText;

    // Set left cell: for first slide, reference the left content elements; otherwise, empty
    let leftCell = '';
    if (idx === 0 && leftCellElements.length > 0) {
      leftCell = leftCellElements;
    }

    cells.push([leftCell, img]);
  });

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
