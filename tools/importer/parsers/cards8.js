/* global WebImporter */
export default function parse(element, { document }) {
  const headerRow = ['Cards (cards8)'];
  const rows = [headerRow];
  const seen = new Set();

  // Find all card grids that contain cards
  const grids = element.querySelectorAll('.elementor-loop-container');
  grids.forEach(grid => {
    // Each card is a div[data-elementor-type="loop-item"]
    const cards = grid.querySelectorAll('[data-elementor-type="loop-item"]');
    cards.forEach(card => {
      // Create a more reliable dedupe key: image src + card title (from .card-imoveis-dados or link)
      let imgSrc = '';
      let cardTitle = '';
      const img = card.querySelector('img');
      if (img && img.src) imgSrc = img.src;
      // Try get card title from the strong, h2, h3, or link text in card-imoveis-dados
      let dados = card.querySelector('.card-imoveis-dados');
      if (dados) {
        let strong = dados.querySelector('strong');
        if (strong) cardTitle = strong.textContent.trim();
        if (!cardTitle) {
          let h = dados.querySelector('h1,h2,h3,h4,h5,h6');
          if (h) cardTitle = h.textContent.trim();
        }
        if (!cardTitle) {
          let link = dados.querySelector('a');
          if (link) cardTitle = link.textContent.trim();
        }
      }
      if (!cardTitle) {
        // Fallback to a link inside the card
        let link = card.querySelector('a');
        if (link) cardTitle = link.textContent.trim();
      }
      // Fallback to data-elementor-id and trimmed text if still nothing
      if (!cardTitle) cardTitle = (card.getAttribute('data-elementor-id') || '').trim();
      const dedupeKey = imgSrc + '||' + cardTitle;
      if (seen.has(dedupeKey)) return;
      seen.add(dedupeKey);

      // --------- Image Cell -----------
      let imgCell = '';
      if (img) imgCell = img.cloneNode(true); // Clone to avoid DOM move issues

      // --------- Text Cell -----------
      let textCell = '';
      let textContentBlock = card.querySelector('.card-imoveis-dados');
      if (textContentBlock) {
        textCell = textContentBlock.cloneNode(true); // Clone to avoid DOM move issues
      } else {
        // Fallback: grab all non-image children as a block (preserve structure, clone for safety)
        const contentDivs = [];
        card.querySelectorAll(':scope > div').forEach(div => {
          if (!div.querySelector('img')) contentDivs.push(div.cloneNode(true));
        });
        if (contentDivs.length) {
          const wrapper = document.createElement('div');
          contentDivs.forEach(e => wrapper.appendChild(e));
          textCell = wrapper;
        } else {
          // Last resort: use all text
          const fallback = document.createElement('div');
          fallback.textContent = card.textContent.trim();
          textCell = fallback;
        }
      }
      rows.push([imgCell, textCell]);
    });
  });

  if (rows.length > 1) {
    const block = WebImporter.DOMUtils.createTable(rows, document);
    element.replaceWith(block);
  }
}
