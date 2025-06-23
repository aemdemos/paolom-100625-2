/* global WebImporter */
export default function parse(element, { document }) {
  // Block header as required
  const headerRow = ['Cards (cardsNoImages55)'];

  // Helper function to get all accordions (Elementor nested-accordion widgets)
  function getAccordionDetailRows(root) {
    const rows = [];
    // Find all accordion widgets
    const accordionWidgets = root.querySelectorAll('.elementor-widget-n-accordion');
    accordionWidgets.forEach(acc => {
      const detailsEls = acc.querySelectorAll('details.e-n-accordion-item');
      detailsEls.forEach(details => {
        // TITLE: from summary (".e-n-accordion-item-title-text" if present, else summary.textContent)
        let title = '';
        const summary = details.querySelector('summary');
        if (summary) {
          const t = summary.querySelector('.e-n-accordion-item-title-text');
          if (t && t.textContent.trim()) {
            title = t.textContent.trim();
          } else {
            title = summary.textContent.trim();
          }
        }
        if (!title) title = 'Detalhes';
        // CONTENT: region after summary
        let contentCell = '';
        const region = details.querySelector('[role=region]');
        if (region) {
          // Sometimes region contains a container div or several widgets
          if (region.children.length === 1) {
            contentCell = region.firstElementChild;
          } else if (region.children.length > 1) {
            contentCell = Array.from(region.children);
          } else {
            // Fallback to text content
            contentCell = region.textContent.trim();
          }
        }
        rows.push([title, contentCell]);
      });
    });
    return rows;
  }

  // Helper: extract the general introductory content (heading and descriptive text above accordion)
  function getGeneralInfoBlock(root) {
    // Find the heading (class .elementor-widget-heading -> h2)
    let heading = null;
    let headingWidget = root.querySelector('.elementor-widget-heading');
    if (headingWidget) {
      heading = headingWidget;
    }
    // All text widgets not inside .elementor-widget-n-accordion
    let infoTextEls = Array.from(root.querySelectorAll('.elementor-widget-text-editor'));
    infoTextEls = infoTextEls.filter(el => !el.closest('.elementor-widget-n-accordion'));
    // Remove any that are children of headingWidget
    if (headingWidget) {
      infoTextEls = infoTextEls.filter(el => !headingWidget.contains(el));
    }
    // Compose content: heading first, then text blocks
    const arr = [];
    if (heading) arr.push(heading);
    if (infoTextEls.length > 0) arr.push(...infoTextEls);
    // Only return if there is actual content
    if (arr.length > 0) {
      // Title can be the heading text if present, fallback to 'Ficha Técnica'
      let titleText = 'Ficha Técnica';
      if (heading) {
        const h = heading.querySelector('h1,h2,h3,h4,h5,h6');
        if (h && h.textContent.trim()) {
          titleText = h.textContent.trim();
        }
      }
      return [[titleText, arr.length === 1 ? arr[0] : arr]];
    }
    return [];
  }

  // Compose all table rows: block name header, then general info, then accordion rows
  const rows = [headerRow];

  // Add the general introductory block as the first accordion item (if present)
  const generalBlock = getGeneralInfoBlock(element);
  generalBlock.forEach(row => rows.push(row));
  // Add all accordion "details"
  getAccordionDetailRows(element).forEach(row => rows.push(row));

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
