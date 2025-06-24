/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block header row
  const headerRow = ['Accordion (accordion25)'];

  // Find the loop container of accordion items
  const loopContainer = element.querySelector('.elementor-loop-container');
  if (!loopContainer) return;

  // Each loop item represents an accordion entry
  const items = Array.from(loopContainer.querySelectorAll('div[data-elementor-type="loop-item"]'));
  const rows = [];
  items.forEach(item => {
    // Title extraction: get the year/month and title link
    const postInfoEl = item.querySelector('.elementor-widget-post-info');
    let dateString = '';
    if (postInfoEl) {
      const terms = postInfoEl.querySelectorAll('.elementor-post-info__terms-list-item');
      if (terms.length >= 2) {
        dateString = `${terms[0].textContent.trim()} ${terms[1].textContent.trim()}`;
      } else if (terms.length === 1) {
        dateString = terms[0].textContent.trim();
      }
    }

    // Title link
    let titleLink = null;
    const titleHeading = item.querySelector('.elementor-widget-theme-post-title .elementor-heading-title');
    if (titleHeading && titleHeading.querySelector('a')) {
      titleLink = titleHeading.querySelector('a');
    }

    // Compose the title cell using existing document elements, not clones
    const titleCellFragment = document.createDocumentFragment();
    if (dateString) {
      const strong = document.createElement('strong');
      strong.textContent = dateString;
      titleCellFragment.appendChild(strong);
      titleCellFragment.appendChild(document.createTextNode(' '));
    }
    if (titleLink) {
      titleCellFragment.appendChild(titleLink);
    } else if (titleHeading) {
      // fallback: use heading as is
      titleCellFragment.appendChild(titleHeading);
    }

    // Content cell: both action buttons, keep exact semantic/formatting, reference existing elements
    // Find all button links inside the item
    const buttonLinks = Array.from(item.querySelectorAll('.elementor-widget-button .elementor-button'));
    const contentCellFragment = document.createDocumentFragment();
    buttonLinks.forEach((btn, i) => {
      contentCellFragment.appendChild(btn);
      if (i < buttonLinks.length - 1) {
        contentCellFragment.appendChild(document.createTextNode(' ')); // space between buttons
      }
    });

    rows.push([
      titleCellFragment.childNodes.length ? Array.from(titleCellFragment.childNodes) : '',
      contentCellFragment.childNodes.length ? Array.from(contentCellFragment.childNodes) : ''
    ]);
  });

  const table = WebImporter.DOMUtils.createTable([headerRow, ...rows], document);
  element.replaceWith(table);
}
