/* global WebImporter */
export default function parse(element, { document }) {
  // Table header
  const headerRow = ['Cards (cards3)'];

  // Find the grid container with the card items
  const grid = element.querySelector('.elementor-loop-container');
  if (!grid) return;
  const cardNodes = Array.from(grid.querySelectorAll('[data-elementor-type="loop-item"]'));

  const rows = [headerRow];

  cardNodes.forEach(card => {
    // --- Image Cell ---
    let imgCell = null;
    const imgContainer = card.querySelector('.elementor-widget-theme-post-featured-image .elementor-widget-container');
    if (imgContainer) {
      const img = imgContainer.querySelector('img');
      if (img) {
        imgCell = img;
      }
    }

    // --- Content Cell ---
    const contentCellItems = [];
    // Extract the data box (background color area)
    const detailsBox = card.querySelector('.card-imoveis-dados .e-con-inner') || card.querySelector('.card-imoveis-dados');
    if (detailsBox) {
      // Status (normally 'Em obras')
      const statusWidget = detailsBox.querySelector('.status-da-obra-card-imoveis .elementor-widget-container');
      if (statusWidget && statusWidget.textContent.trim()) {
        const statusP = document.createElement('p');
        statusP.textContent = statusWidget.textContent.trim().toUpperCase();
        contentCellItems.push(statusP);
      }

      // Title block (Sensia La Vie, etc, with link)
      const titleLi = detailsBox.querySelector('.elementor-element-8fba482 ul li a');
      if (titleLi) {
        const strong = document.createElement('strong');
        strong.textContent = titleLi.textContent.trim();
        // Link, with href
        const link = document.createElement('a');
        link.href = titleLi.getAttribute('href');
        link.appendChild(strong);
        // Render as a paragraph
        const p = document.createElement('p');
        p.appendChild(link);
        contentCellItems.push(p);
      }

      // Location (e.g. Chapada | Manaus | AM), keep icon as is
      const locationWidget = detailsBox.querySelector('.elementor-element-b41a2d1 .elementor-widget-container ul');
      if (locationWidget) {
        contentCellItems.push(locationWidget);
      }

      // The divider is present visually, but can be omitted (not in markdown example as table cell)

      // Key attributes: quartos, area, preco, etc., as a list
      const infoList = detailsBox.querySelector('.elementor-element-c9e3915 .elementor-widget-container ul');
      if (infoList) {
        contentCellItems.push(infoList);
      }
    }

    // Fallback: If no content assembled, just use the .card-imoveis-dados area
    if (!contentCellItems.length) {
      const fallback = card.querySelector('.card-imoveis-dados');
      if (fallback) contentCellItems.push(fallback);
    }

    rows.push([
      imgCell,
      contentCellItems.length === 1 ? contentCellItems[0] : contentCellItems
    ]);
  });
  
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
