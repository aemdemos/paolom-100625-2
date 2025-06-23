/* global WebImporter */
export default function parse(element, { document }) {
  // Table header exactly matches example
  const rows = [['Cards (cards17)']];

  // Find the main card grid
  const loopContainer = element.querySelector('.elementor-loop-container.elementor-grid');
  if (!loopContainer) return;

  // Each card is a direct child div[data-elementor-type="loop-item"]
  const cards = Array.from(loopContainer.querySelectorAll(':scope > div[data-elementor-type="loop-item"]'));
  cards.forEach(card => {
    // --- Column 1: Image ---
    let image = null;
    const imgContainer = card.querySelector('.card-imoveis-item');
    if (imgContainer) {
      const img = imgContainer.querySelector('img');
      if (img) image = img;
    }
    // If no image, fallback to null (empty cell)

    // --- Column 2: Text ---
    // Use an array to collect blocks in order
    const textCellParts = [];
    const dados = card.querySelector('.card-imoveis-dados');
    if (dados) {
      // 1. Status (usually first post-info, no link, all-caps)
      const statusWidget = dados.querySelector('.status-da-obra-card-imoveis');
      if (statusWidget) {
        const li = statusWidget.querySelector('li');
        if (li) {
          const status = document.createElement('div');
          status.textContent = li.textContent.trim();
          status.style.fontWeight = 'bold';
          textCellParts.push(status);
        }
      }

      // 2. Title (linked)
      // Find post-info .elementor-widget-post-info that contains a link
      const postInfoWidgets = Array.from(dados.querySelectorAll('.elementor-widget-post-info'));
      let foundTitle = false;
      for (const widget of postInfoWidgets) {
        const a = widget.querySelector('a');
        if (a && a.href) {
          // Use the existing link and its text
          const titleDiv = document.createElement('div');
          // Bold styling for title
          const strong = document.createElement('strong');
          strong.textContent = a.textContent.trim();
          const link = a; // Reference existing link (do not clone)
          // Remove any icon children (e.g. <i>)
          Array.from(link.querySelectorAll('i')).forEach(i => i.remove());
          // Set only the text as child
          while (link.firstChild) {
            link.removeChild(link.firstChild);
          }
          link.appendChild(strong);
          titleDiv.appendChild(link);
          textCellParts.push(titleDiv);
          foundTitle = true;
          break;
        }
      }

      // 3. Location (has |, no area/suite/price keywords)
      const locLi = Array.from(dados.querySelectorAll('li')).find(li => {
        const txt = li.textContent.trim();
        return /\|/.test(txt) && !/suite|área|area|Aptos|Apartamentos|dormitórios|quartos/i.test(txt);
      });
      if (locLi) {
        const locDiv = document.createElement('div');
        locDiv.textContent = locLi.textContent.trim();
        textCellParts.push(locDiv);
      }

      // 4. Details List (usually bottom post-info block)
      // This is the *last* .elementor-widget-post-info in the card block
      const detailsWidget = postInfoWidgets[postInfoWidgets.length - 1];
      if (detailsWidget) {
        // Use the existing UL but remove SVG icons for clarity
        const ul = detailsWidget.querySelector('ul');
        if (ul) {
          // Only include those li's whose text match known detail patterns
          const lis = Array.from(ul.querySelectorAll('li')).filter(li => {
            const t = li.textContent.trim();
            return /quartos|dormitórios|área|area|Aptos|apartamento|preço|vagas|m²|suite/i.test(t);
          });
          if (lis.length > 0) {
            const newUl = document.createElement('ul');
            lis.forEach(li => {
              // Remove SVG icons
              Array.from(li.querySelectorAll('svg')).forEach(svg => svg.remove());
              newUl.appendChild(li);
            });
            textCellParts.push(newUl);
          }
        }
      }
    }
    rows.push([
      image || '',
      textCellParts.length ? textCellParts : ''
    ]);
  });

  // Render the block table and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
