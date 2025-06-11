/* global WebImporter */
export default function parse(element, { document }) {
  // The block header should exactly match the example
  const headerRow = ['Carousel (carousel27)'];
  const rows = [headerRow];

  // Find the .swiper-slide elements (skip duplicates, only unique by data-swiper-slide-index, order matters)
  const slides = Array.from(element.querySelectorAll('.swiper-slide'));
  const seen = new Set();
  const uniqueSlides = [];
  for (const slide of slides) {
    const idx = slide.getAttribute('data-swiper-slide-index');
    if (!seen.has(idx)) {
      seen.add(idx);
      uniqueSlides.push(slide);
    }
  }

  // For each unique slide
  for (const slide of uniqueSlides) {
    // First column: image from background-image of .swiper-slide-bg
    let imgEl = null;
    const bgDiv = slide.querySelector('.swiper-slide-bg');
    if (bgDiv) {
      // Try inline style first
      let bgImgUrl = '';
      if (bgDiv.style.backgroundImage && bgDiv.style.backgroundImage !== 'none') {
        bgImgUrl = bgDiv.style.backgroundImage;
      } else {
        // Fallback: computed style if in DOM
        if (bgDiv.ownerDocument && bgDiv.ownerDocument.defaultView) {
          bgImgUrl = bgDiv.ownerDocument.defaultView.getComputedStyle(bgDiv).backgroundImage;
        }
      }
      if (bgImgUrl && bgImgUrl !== 'none') {
        // Extract URL: url("...")
        const match = bgImgUrl.match(/url\(["']?(.*?)["']?\)/);
        if (match && match[1]) {
          imgEl = document.createElement('img');
          imgEl.src = match[1];
        }
      }
    }
    // If no image, provide a blank placeholder (should not happen in this block)
    if (!imgEl) {
      imgEl = document.createElement('span');
      imgEl.textContent = '[slide image]';
    }

    // Second column: text content. Find .swiper-slide-inner > .swiper-slide-contents
    let textCellContent = [];
    let slideInner = slide.querySelector('.swiper-slide-inner');
    let slideContents = slideInner ? slideInner.querySelector('.swiper-slide-contents') : null;
    // Sometimes .swiper-slide-inner is a link (a), so check for that
    // We'll use the .swiper-slide-inner (possibly <a>) as the CTA if it's a link
    if (slideInner && slideInner.tagName === 'A' && slideInner.href) {
      // If .swiper-slide-contents is inside the link, use its content for text
      slideContents = slideInner.querySelector('.swiper-slide-contents');
    }
    if (slideContents) {
      // Gather heading if present
      const heading = slideContents.querySelector('h1, h2, h3, h4, h5, h6');
      if (heading) textCellContent.push(heading);
      // Gather all paragraphs
      const paras = slideContents.querySelectorAll('p');
      if (paras.length > 0) {
        paras.forEach(p => textCellContent.push(p));
      } else {
        // If no <p>, but content exists, add as a span
        const txt = slideContents.textContent.trim();
        if (txt.length > 0 && !heading) {
          const span = document.createElement('span');
          span.textContent = txt;
          textCellContent.push(span);
        }
      }
      // If .swiper-slide-inner is a link (for CTA), but not just empty
      if (slideInner && slideInner.tagName === 'A' && slideInner.href) {
        // If it has some text (e.g., a button styled link)
        if (slideInner.textContent.trim()) {
          textCellContent.push(slideInner);
        }
      } else {
        // Also add any CTA link or button found inside the text area
        const cta = slideContents.querySelector('a, button');
        if (cta && !textCellContent.includes(cta)) textCellContent.push(cta);
      }
    } else if (slideInner && slideInner.tagName === 'A' && slideInner.href) {
      // If no .swiper-slide-contents, but the link has text, include it
      if (slideInner.textContent.trim()) {
        textCellContent.push(slideInner);
      }
    }
    if (textCellContent.length === 0) textCellContent = [''];
    rows.push([imgEl, textCellContent]);
  }

  // Create the table and replace the original element
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
