/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: block name
  const headerRow = ['Cards (cards21)'];

  // Find the carousel widget
  const carouselWidget = element.querySelector('.elementor-widget-media-carousel');
  if (!carouselWidget) return;

  const swiperWrapper = carouselWidget.querySelector('.swiper-wrapper');
  if (!swiperWrapper) return;

  // Get all non-duplicate slides
  let slides = Array.from(swiperWrapper.querySelectorAll('.swiper-slide'));
  slides = slides.filter(slide => !slide.className.match(/swiper-slide-duplicate/));
  if (!slides.length) slides = Array.from(swiperWrapper.querySelectorAll('.swiper-slide'));

  // Compose rows for each slide
  const rows = slides.map(slide => {
    let imageCell = '';
    let textCell = '';

    // Extract the image from background-image style (preferred)
    const a = slide.querySelector('a');
    if (a) {
      const bgDiv = a.querySelector('[style*="background-image"]');
      if (bgDiv) {
        const bg = bgDiv.style.backgroundImage;
        const urlMatch = bg.match(/url\(["']?(.+?)["']?\)/);
        if (urlMatch) {
          const img = document.createElement('img');
          img.src = urlMatch[1];
          img.alt = bgDiv.getAttribute('aria-label') || '';
          imageCell = img;
        }
      } else if (a.href) {
        // fallback, use href as image src
        const img = document.createElement('img');
        img.src = a.href;
        img.alt = '';
        imageCell = img;
      }
    }

    // Extract text: title, description, anchor text, or other visible text
    let textFragments = [];
    if (a) {
      // Title (as h3)
      const title = a.getAttribute('data-elementor-lightbox-title');
      if (title) {
        const h3 = document.createElement('h3');
        h3.textContent = title;
        textFragments.push(h3);
      }
      // Description (as paragraph)
      const desc = a.getAttribute('data-elementor-lightbox-description');
      if (desc) {
        const p = document.createElement('p');
        p.textContent = desc;
        textFragments.push(p);
      }
      // Anchor text if visible and not just whitespace
      if (a.textContent && a.textContent.trim().length > 0) {
        // Only add if it's not already included
        const text = a.textContent.trim();
        if ((!title || title !== text) && (!desc || desc !== text)) {
          const span = document.createElement('span');
          span.textContent = text;
          textFragments.push(span);
        }
      }
    }
    // If nothing extracted, leave blank
    if (textFragments.length) {
      textCell = textFragments;
    } else {
      textCell = '';
    }

    return [imageCell, textCell];
  });

  // Compose the table data and create the block
  const tableArr = [headerRow, ...rows];
  const block = WebImporter.DOMUtils.createTable(tableArr, document);

  // Replace the original block element
  element.replaceWith(block);
}
