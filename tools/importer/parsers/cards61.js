/* global WebImporter */
export default function parse(element, { document }) {
  // Header row exactly as required
  const headerRow = ['Cards (cards61)'];

  // Find the main grid of cards
  const cardsContainer = element.querySelector('.elementor-loop-container.elementor-grid');
  if (!cardsContainer) return;

  // Each card is a [data-elementor-type="loop-item"]
  const cardElements = Array.from(cardsContainer.querySelectorAll('[data-elementor-type="loop-item"]'));

  // For each card, extract [img, text content]
  const rows = cardElements.map(card => {
    // --- First cell: Image ---
    let img = null;
    const imgWidget = card.querySelector('.elementor-widget-theme-post-featured-image');
    if (imgWidget) {
      img = imgWidget.querySelector('img');
    }

    // --- Second cell: Text Content ---
    // We'll use a single block-level <div> to hold all text parts in sequence
    const contentDiv = document.createElement('div');

    // Status (Lançamento, Obras iniciadas, etc)
    const status = card.querySelector('.status-da-obra-card-imoveis .elementor-post-info__terms-list-item');
    if (status && status.textContent.trim()) {
      const statusDiv = document.createElement('div');
      statusDiv.textContent = status.textContent.trim();
      statusDiv.style.fontWeight = 'bold';
      contentDiv.appendChild(statusDiv);
    }

    // Title with optional link (Sensia Jardim, etc.)
    const titleLinkLi = card.querySelector('.elementor-repeater-item-1315aa1');
    let titleText = '';
    let titleLink = null;
    if (titleLinkLi) {
      const titleA = titleLinkLi.querySelector('a');
      if (titleA) {
        // Remove icon if any
        const icon = titleA.querySelector('.elementor-icon-list-icon');
        if (icon) icon.remove();
        // Use the existing anchor element; keep its href and text
        titleLink = titleA;
      } else {
        // Fallback, just use text
        const textSpan = titleLinkLi.querySelector('.elementor-post-info__item');
        if (textSpan && textSpan.textContent.trim()) {
          titleText = textSpan.textContent.trim();
        }
      }
    }
    if (titleLink) {
      // Put title in bold
      const strong = document.createElement('strong');
      strong.appendChild(titleLink);
      contentDiv.appendChild(strong);
    } else if (titleText) {
      const strong = document.createElement('strong');
      strong.textContent = titleText;
      contentDiv.appendChild(strong);
    }

    // Location (Maringá | Paraná | PR)
    const loc = card.querySelector('.elementor-repeater-item-c4a5a20 .elementor-post-info__terms-list-item');
    if (loc && loc.textContent.trim()) {
      const locDiv = document.createElement('div');
      locDiv.textContent = loc.textContent.trim();
      contentDiv.appendChild(locDiv);
    }

    // Bulleted feature list: under the green area, after divider
    // Get the feature list (all li in .elementor-element-c9e3915)
    const featureLis = card.querySelectorAll('.elementor-element-c9e3915 .elementor-post-info > li');
    featureLis.forEach(li => {
      const feature = li.querySelector('.elementor-post-info__terms-list-item');
      if (feature && feature.textContent.trim()) {
        // Each feature as a <div>
        const featDiv = document.createElement('div');
        featDiv.textContent = feature.textContent.trim();
        contentDiv.appendChild(featDiv);
      }
    });

    return [img, contentDiv];
  });

  // Assemble the final table: header + all card rows
  const tableArr = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(tableArr, document);
  element.replaceWith(table);
}
