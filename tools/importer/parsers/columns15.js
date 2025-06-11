/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Get all top-level child containers
  const topContainers = Array.from(element.querySelectorAll(':scope > div'));

  // 2. Identify the desktop banner (container with a big desktop image)
  let bannerDiv = null;
  let bannerImg = null;
  for (const div of topContainers) {
    const img = div.querySelector('img');
    if (img && img.src.match(/desktop/i) && parseInt(img.width, 10) >= 1000) {
      bannerDiv = div;
      bannerImg = img;
      break;
    }
    // fallback: large image
    if (!bannerDiv && img && parseInt(img.width, 10) >= 1000) {
      bannerDiv = div;
      bannerImg = img;
    }
  }

  // 3. Identify the promo/cta content: the sibling after the bannerDiv that is NOT a hidden/mobile/image-only block
  let promoDiv = null;
  let foundBanner = false;
  for (const div of topContainers) {
    if (div === bannerDiv) {
      foundBanner = true;
      continue;
    }
    if (!foundBanner) continue;
    // skip mobile image blocks
    const promoImg = div.querySelector('img');
    const promoText = (div.textContent || '').trim();
    if (promoImg && !promoText) continue;
    // skip empty/hidden blocks
    if (!promoText) continue;
    // Must contain headline, paragraph or button/text
    if (
      div.querySelector('h1, h2, h3, h4, h5, h6, button, a, strong, p, [role=button]') ||
      promoText.length > 0
    ) {
      promoDiv = div;
      break;
    }
  }

  // 4. Compose left column: desktop banner (prefer link if present)
  let leftCell = '';
  if (bannerDiv) {
    const a = bannerDiv.querySelector('a');
    leftCell = a ? a : (bannerImg ? bannerImg : '');
  }

  // 5. Compose right column: promo/cta section
  let rightCell = '';
  if (promoDiv) {
    rightCell = promoDiv;
  }

  // 6. Find breadcrumbs and heading for third row (below hero)
  let breadcrumbs = null;
  let headingDiv = null;
  for (const div of topContainers) {
    if (div === bannerDiv || div === promoDiv) continue;
    const bcrumb = div.querySelector('.sensia-breadcrumbs');
    if (bcrumb && !breadcrumbs) breadcrumbs = bcrumb.closest('div');
    const heading = div.querySelector('h1, h2, h3, h4, h5, h6');
    if (heading && !headingDiv) headingDiv = heading.closest('div');
  }
  // Compose third row if content exists
  let thirdRow;
  if (breadcrumbs || headingDiv) {
    const arr = [];
    if (breadcrumbs) arr.push(breadcrumbs);
    if (headingDiv && headingDiv !== breadcrumbs) arr.push(headingDiv);
    thirdRow = [arr];
  }

  // 7. Compose table structure
  const cells = [
    ['Columns (columns15)'],
    [leftCell, rightCell],
  ];
  if (thirdRow) cells.push(thirdRow);

  // 8. Replace with table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
