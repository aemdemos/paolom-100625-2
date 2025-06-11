/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Find the main header (not the sticky spacer)
  const headers = Array.from(element.querySelectorAll('header.elementor-element'));
  let mainHeader = headers.find(h => !h.classList.contains('elementor-sticky__spacer'));
  if (!mainHeader) mainHeader = headers[0];
  if (!mainHeader) return;

  // Left column: logo, heading, form
  let leftColumn = [];
  // 1a. Logo (desktop)
  const desktopLogoImg = mainHeader.querySelector('.elementor-element-a857470 img');
  if (desktopLogoImg) {
    const logoWidget = desktopLogoImg.closest('.elementor-widget-image');
    leftColumn.push(logoWidget);
  }
  // 1b. Heading 'Imóveis em'
  const headingWidget = mainHeader.querySelector('.elementor-element-8cf6559');
  if (headingWidget) leftColumn.push(headingWidget);
  // 1c. Form
  const formWidget = mainHeader.querySelector('.elementor-element-d2beb24');
  if (formWidget) leftColumn.push(formWidget);

  // Right column: nav menu (desktop), search button
  let rightColumn = [];
  // 2a. Nav menu (desktop)
  const desktopNavWidget = mainHeader.querySelector('#main-menu-meusensia');
  if (desktopNavWidget) {
    const navWidget = desktopNavWidget.closest('.elementor-widget-nav-menu');
    if (navWidget) rightColumn.push(navWidget);
  }
  // 2b. Search button
  const searchButtonWidget = mainHeader.querySelector('.elementor-element-8ab8496');
  if (searchButtonWidget) rightColumn.push(searchButtonWidget);

  // Only create a single content row, 2 columns
  const cells = [
    ['Columns (columns14)'],
    [leftColumn, rightColumn],
  ];

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
