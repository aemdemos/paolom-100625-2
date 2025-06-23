/* global WebImporter */
export default function parse(element, { document }) {
  // Find the loop container holding the cards
  const loopContainer = element.querySelector('.elementor-loop-container');
  if (!loopContainer) return;
  
  // Find all cards (each is a div[data-elementor-type="loop-item"])
  const cardItems = loopContainer.querySelectorAll('[data-elementor-type="loop-item"]');

  const cells = [['Cards (cards17)']];

  cardItems.forEach(card => {
    // --- COLUMN 1: IMAGE ---
    let img = null;
    const imgContainer = card.querySelector('.card-imoveis-item');
    if (imgContainer) {
      // Find the first img inside this block
      const foundImg = imgContainer.querySelector('img');
      if (foundImg) img = foundImg;
    }

    // --- COLUMN 2: TEXT ---
    // This will collect the text block for the card
    const textNodes = [];
    // 1. Status (e.g. Em construção, Lançamento, Obras iniciadas)
    let statusText = '';
    const statusLi = card.querySelector('.status-da-obra-card-imoveis .elementor-post-info__terms-list-item');
    if (statusLi) {
      const strong = document.createElement('strong');
      strong.textContent = statusLi.textContent.trim();
      textNodes.push(strong);
    }
    // 2. Project Name (may be linked)
    const nameA = card.querySelector('.elementor-repeater-item-1315aa1 a');
    if (nameA) {
      // Get the plain text (project name)
      let nameText = nameA.textContent.trim();
      if (nameText) {
        textNodes.push(document.createElement('br'));
        const strong = document.createElement('strong');
        strong.textContent = nameText;
        textNodes.push(strong);
      }
    }
    // 3. Location (plain text, e.g. Cocó | Fortaleza | CE)
    const locSpan = card.querySelector('.elementor-repeater-item-c4a5a20 .elementor-post-info__terms-list-item');
    if (locSpan) {
      textNodes.push(document.createElement('br'));
      const locDiv = document.createElement('div');
      locDiv.textContent = locSpan.textContent.trim();
      textNodes.push(locDiv);
    }
    // 4. Features (as list, each as a new line)
    // They are in the ul after the divider (the last .elementor-widget-post-info)
    // Let's grab all .elementor-widget-post-info ul, and take the last
    const allInfoUls = card.querySelectorAll('.elementor-widget-post-info ul.elementor-post-info');
    if (allInfoUls.length > 1) {
      const featuresUl = allInfoUls[allInfoUls.length-1];
      const featureLis = featuresUl.querySelectorAll('li');
      if (featureLis.length) {
        textNodes.push(document.createElement('br'));
        featureLis.forEach(li => {
          const feat = li.querySelector('.elementor-post-info__terms-list-item');
          if (feat && feat.textContent.trim()) {
            const featDiv = document.createElement('div');
            featDiv.textContent = feat.textContent.trim();
            textNodes.push(featDiv);
          }
        });
      }
    }

    // Fallback: If no textNodes, use the main data box
    if (textNodes.length === 0) {
      const fallbackData = card.querySelector('.card-imoveis-dados');
      if (fallbackData) textNodes.push(fallbackData);
    }

    cells.push([
      img,
      textNodes
    ]);
  });
  
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
