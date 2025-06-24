/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for the table
  const headerRow = ['Cards (cardsNoImages55)'];
  const cells = [headerRow];

  // Get all immediate children of the root element
  const innerDivs = element.querySelectorAll(':scope > div');

  // Find the div that has main content (the one with widget-heading/text-editor/accordion)
  let contentContainer = null;
  for (const div of innerDivs) {
    if (div.querySelector('.elementor-widget-heading, .elementor-widget-text-editor, .elementor-widget-n-accordion')) {
      contentContainer = div;
      break;
    }
  }
  if (!contentContainer) contentContainer = element;

  // Card 1: Heading + leisure items
  const card1Content = [];
  const headingWidget = contentContainer.querySelector('.elementor-widget-heading');
  if (headingWidget) {
    const innerHeading = headingWidget.querySelector('h2, h1, h3, h4, h5, h6');
    if (innerHeading) {
      card1Content.push(innerHeading);
    }
  }
  // Only the text-editor before the accordion
  const textEditors = Array.from(contentContainer.querySelectorAll('.elementor-widget-text-editor'));
  // Filter out those in accordion details
  const accordion = contentContainer.querySelector('.e-n-accordion');
  let accordionDetails = [];
  if (accordion) {
    accordionDetails = Array.from(accordion.querySelectorAll('.elementor-widget-text-editor'));
  }
  const preAccordionEditors = textEditors.filter(ed => !accordionDetails.includes(ed));
  preAccordionEditors.forEach(ed => card1Content.push(ed));
  if (card1Content.length > 0) {
    cells.push([card1Content]);
  }

  // Card 2+: Each detail in the accordion (if present)
  if (accordion) {
    const detailsList = accordion.querySelectorAll('details');
    detailsList.forEach(details => {
      const cardContent = [];
      // Use summary/title if present
      const summary = details.querySelector('summary');
      if (summary) {
        // Get text from summary, skipping SVG icons
        const titleTextDiv = summary.querySelector('.e-n-accordion-item-title-text');
        let headingText = '';
        if (titleTextDiv) {
          headingText = titleTextDiv.textContent.trim();
        } else {
          // fallback to summary text
          headingText = summary.childNodes[0] && summary.childNodes[0].textContent ? summary.childNodes[0].textContent.trim() : '';
        }
        if (headingText) {
          const h3 = document.createElement('h3');
          h3.textContent = headingText;
          cardContent.push(h3);
        }
      }
      // Find the region/div after summary (the accordion content)
      const detailsRegion = details.querySelector('[role="region"]');
      if (detailsRegion) {
        // Use all .elementor-widget-text-editor blocks inside
        const regionEditors = detailsRegion.querySelectorAll('.elementor-widget-text-editor');
        regionEditors.forEach(ed => {
          cardContent.push(ed);
        });
      }
      // Only add the card if it has content
      if (cardContent.length > 0) {
        cells.push([cardContent]);
      }
    });
  }

  // Create and replace
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
