/* global WebImporter */
export default function parse(element, { document }) {
  const headerRow = ['Cards (cards3)'];
  const cardsContainer = element.querySelector('.elementor-loop-container') || element;
  const cardElements = Array.from(cardsContainer.querySelectorAll('[data-elementor-type="loop-item"]'));

  const rows = cardElements.map(cardEl => {
    // IMAGE CELL
    let image = null;
    const imgLink = cardEl.querySelector('.elementor-widget-theme-post-featured-image a');
    if (imgLink && imgLink.querySelector('img')) {
      image = imgLink.querySelector('img');
    }

    // TEXT CELL
    const dataBox = cardEl.querySelector('.card-imoveis-dados');
    let textCellContent = [];
    if (dataBox) {
      // 1. Status
      const statusWidget = dataBox.querySelector('.status-da-obra-card-imoveis .elementor-widget-container');
      if (statusWidget) textCellContent.push(statusWidget);
      // 2. Title
      const postInfos = dataBox.querySelectorAll('.elementor-widget-post-info');
      if (postInfos.length > 1) {
        const titleWidget = postInfos[1].querySelector('.elementor-widget-container');
        if (titleWidget) textCellContent.push(titleWidget);
      }
      // 3. Location
      if (postInfos.length > 2) {
        const locationWidget = postInfos[2].querySelector('.elementor-widget-container');
        if (locationWidget) textCellContent.push(locationWidget);
      }
      // 4. Features list(s) inside .f21a179
      const featuresBlock = dataBox.querySelector('.f21a179');
      if (featuresBlock) {
        const featuresLists = featuresBlock.querySelectorAll('.elementor-widget-post-info .elementor-widget-container ul');
        featuresLists.forEach(list => {
          textCellContent.push(list);
        });
      }
    }
    if (textCellContent.length === 0 && dataBox) {
      textCellContent = [dataBox];
    }
    return [image, textCellContent];
  });

  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
