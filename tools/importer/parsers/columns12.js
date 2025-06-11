/* global WebImporter */
export default function parse(element, { document }) {
  // Get the main parent container (usually the first div)
  const rootContainer = element.querySelector(':scope > div');
  if (!rootContainer) return;
  const topContainers = Array.from(rootContainer.querySelectorAll(':scope > div'));

  // Find the first boxed container (logo/text/social/copyright)
  let boxed, boxedInner;
  for (const c of topContainers) {
    if (c.classList.contains('e-con-boxed')) {
      boxed = c;
      boxedInner = boxed.querySelector('.e-con-inner') || boxed;
      break;
    }
  }
  // Fallback if not found
  boxedInner = boxedInner || rootContainer;
  // Get all direct children from the boxed inner container
  const firstRowCandidate = Array.from(boxedInner.querySelectorAll(':scope > div'));
  // Compose left cell: grab all elements with .elementor-widget-image, .elementor-widget-text-editor, .elementor-widget-social-icons from firstRowCandidate (in order), plus copyright if it is a lone text-editor after socials
  let leftCell = [];
  for (const c of firstRowCandidate) {
    const img = c.querySelector('.elementor-widget-image');
    if (img) leftCell.push(img);
    const txt = c.querySelector('.elementor-widget-text-editor');
    if (txt) leftCell.push(txt);
    const soc = c.querySelector('.elementor-widget-social-icons');
    if (soc) leftCell.push(soc);
  }
  // Sometimes copyright is another .elementor-widget-text-editor
  // Only push if not already included
  const allTextEditors = boxedInner.querySelectorAll('.elementor-widget-text-editor');
  if (allTextEditors.length > 1) {
    const lastText = allTextEditors[allTextEditors.length - 1];
    if (!leftCell.includes(lastText)) {
      leftCell.push(lastText);
    }
  }
  // Remove empties
  leftCell = leftCell.filter(Boolean);

  // Compose nav menus: All menu rows are after the first boxed container and are not elementor-hidden
  let navMenus = [];
  let boxedFound = false;
  for (const c of topContainers) {
    if (!boxedFound) {
      if (c === boxed) {
        boxedFound = true;
      }
      continue;
    }
    if (c.className.match(/elementor-hidden/)) continue;
    const navs = c.querySelectorAll('.elementor-widget-nav-menu');
    navMenus.push(...navs);
  }
  navMenus = navMenus.filter(Boolean);

  // Combine all content from leftCell and navMenus into a single cell
  const content = [...leftCell, ...navMenus];
  const headerRow = ['Columns (columns12)'];
  const cells = [headerRow, [content]];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  element.replaceWith(table);
}
