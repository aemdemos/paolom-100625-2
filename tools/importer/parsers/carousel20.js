/* global WebImporter */
export default function parse(element, { document }) {
  // The header row must match the example exactly
  const headerRow = ['Carousel (carousel20)'];
  const rows = [headerRow];

  // Find the main carousel wrapper
  const swiperWrapper = element.querySelector('.swiper-wrapper');
  if (!swiperWrapper) return;

  // Track unique images to avoid slide duplicates
  const seenImages = new Set();

  // Only use slides NOT marked as swiper-slide-duplicate
  const slides = Array.from(swiperWrapper.children).filter((child) => {
    return child.classList.contains('swiper-slide') && !child.classList.contains('swiper-slide-duplicate');
  });

  // Helper for getting image URL from style or data-background
  function getImgUrl(imgDiv) {
    let url = '';
    if (imgDiv && imgDiv.style && imgDiv.style.backgroundImage) {
      const match = imgDiv.style.backgroundImage.match(/url\(["']?(.*?)["']?\)/);
      if (match && match[1]) url = match[1];
    }
    if ((!url || url === 'none') && imgDiv && imgDiv.dataset && imgDiv.dataset.background) {
      url = imgDiv.dataset.background;
    }
    return url;
  }

  // Parse each unique slide
  for (const slide of slides) {
    // The image is inside .elementor-carousel-image (may be inside an <a> or direct child)
    let imgDiv = slide.querySelector('.elementor-carousel-image');
    let imgUrl = getImgUrl(imgDiv);
    let imgAlt = imgDiv ? (imgDiv.getAttribute('aria-label') || '') : '';
    if (!imgUrl || seenImages.has(imgUrl)) continue;
    seenImages.add(imgUrl);

    // Create image element (use document so it belongs to the correct context)
    const img = document.createElement('img');
    img.src = imgUrl;
    if (imgAlt) img.alt = imgAlt;
    img.loading = 'lazy';

    // Second column: all meaningful text content from the slide
    // Start with overlay text
    let col2Content = [];
    let overlay = slide.querySelector('.elementor-carousel-image-overlay');
    if (overlay && overlay.textContent.trim()) {
      // Use heading element for semantic meaning
      const heading = document.createElement('h3');
      heading.textContent = overlay.textContent.trim();
      col2Content.push(heading);
    }

    // Add any other significant (non-whitespace) text nodes that are not from overlay
    // Exclude overlay's text node from top-level if already included
    const children = Array.from(slide.childNodes);
    for (const node of children) {
      if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
        // Don't double add overlay text
        if (!(overlay && overlay.textContent && node.textContent.trim() === overlay.textContent.trim())) {
          col2Content.push(document.createTextNode(node.textContent.trim()));
        }
      }
    }

    // Add any <a> or other block child text if present and not already in overlay
    // (Though original HTML shows only overlay, this is for resilience)
    // Also, preserve links if found in text content
    const aEls = slide.querySelectorAll(':scope a');
    for (const aEl of aEls) {
      // Skip if this <a> only wraps image (no text)
      if (aEl.querySelector('img') == null && !aEl.querySelector('.elementor-carousel-image')) {
        // If <a> has text, preserve it as a link
        if (aEl.textContent.trim()) {
          const a = document.createElement('a');
          a.href = aEl.href;
          a.textContent = aEl.textContent.trim();
          col2Content.push(a);
        }
      }
    }

    // If nothing else, keep column for layout
    if (col2Content.length === 0) col2Content = [''];
    rows.push([img, col2Content]);
  }

  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
