/* global WebImporter */
export default function parse(element, { document }) {
  // Find the carousel widget within the element
  const slidesWidget = element.querySelector('.elementor-widget-slides .elementor-widget-container');
  if (!slidesWidget) return;
  // Find the slides wrapper
  const slidesWrapper = slidesWidget.querySelector('.elementor-slides-wrapper, .swiper-wrapper');
  if (!slidesWrapper) return;
  // Collect unique slides (ignore duplicates by key)
  const slideKeySet = new Set();
  const slides = [];
  slidesWrapper.querySelectorAll('.swiper-slide').forEach((slide) => {
    // Use data-swiper-slide-index + repeater id to prevent duplicate slides
    const repeaterId = slide.className.match(/elementor-repeater-item-([a-z0-9]+)/i)?.[1] || '';
    const slideIdx = slide.getAttribute('data-swiper-slide-index');
    const key = repeaterId + ':' + slideIdx;
    if (!slideKeySet.has(key)) {
      slides.push(slide);
      slideKeySet.add(key);
    }
  });

  // Helper to extract background image from a slide (elementor puts it in inline style)
  function getSlideImage(slide) {
    const bgDiv = slide.querySelector('.swiper-slide-bg');
    if (bgDiv) {
      // backgroundImage is usually set as a style, but fallback to HTML attribute if not
      let bgUrl = '';
      if (bgDiv.style && bgDiv.style.backgroundImage) {
        const urlMatch = bgDiv.style.backgroundImage.match(/url\(["']?(.*?)["']?\)/i);
        if (urlMatch && urlMatch[1]) bgUrl = urlMatch[1];
      } else if (bgDiv.getAttribute('style')) {
        const urlMatch = bgDiv.getAttribute('style').match(/background-image:\s*url\(["']?(.*?)["']?\)/i);
        if (urlMatch && urlMatch[1]) bgUrl = urlMatch[1];
      }
      if (bgUrl) {
        const img = document.createElement('img');
        img.src = bgUrl;
        img.alt = '';
        return img;
      }
    }
    // Try to find direct img element
    const img = slide.querySelector('img');
    if (img) return img;
    return null;
  }

  // Helper to extract text content from the slide
  function getSlideText(slide) {
    // .swiper-slide-contents is a common wrapper for all textual content
    const contents = slide.querySelector('.swiper-slide-contents');
    if (contents && contents.childNodes.length) {
      return contents;
    }
    // If contents are within an <a> .swiper-slide-inner, use it (for CTA links)
    const innerLink = slide.querySelector('a.swiper-slide-inner');
    if (innerLink) {
      const linkContents = innerLink.querySelector('.swiper-slide-contents');
      if (linkContents && linkContents.childNodes.length) return linkContents;
      // If not, return the link itself if it has content
      if (innerLink.childNodes.length > 0) return innerLink;
    }
    // Fallback to .swiper-slide-inner
    const innerDiv = slide.querySelector('.swiper-slide-inner');
    if (innerDiv && innerDiv.childNodes.length > 0) {
      // Exclude the .swiper-slide-bg background div if accidentally included
      if (
        innerDiv.childNodes.length === 1 &&
        innerDiv.firstElementChild &&
        innerDiv.firstElementChild.classList.contains('swiper-slide-bg')
      ) {
        return null;
      }
      return innerDiv;
    }
    return null;
  }

  // Compose the table rows
  const rows = [];
  // Header row matches example exactly
  rows.push(['Carousel (carousel45)']);
  // For each slide, build a row with [image, text] or [image] if no text
  slides.forEach((slide) => {
    const img = getSlideImage(slide);
    const textContent = getSlideText(slide);
    if (img && textContent) {
      rows.push([img, textContent]);
    } else if (img) {
      rows.push([img]);
    } else if (textContent) {
      rows.push([textContent]);
    }
  });
  // Only create if there's at least one slide row
  if (rows.length > 1) {
    const block = WebImporter.DOMUtils.createTable(rows, document);
    element.replaceWith(block);
  }
}
