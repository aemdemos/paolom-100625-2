/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the cards container (loop-grid/post widget)
  const loopContainer = element.querySelector('.elementor-loop-container');
  if (!loopContainer) return;

  // Find all direct child cards
  const cardNodes = Array.from(loopContainer.querySelectorAll(':scope > div[data-elementor-type="loop-item"]'));

  const rows = [
    ['Cards (cards49)']
  ];

  cardNodes.forEach(card => {
    // IMAGE CELL: Look for .card-imoveis-item then the first <img> inside
    let imageCell = null;
    const imageBox = card.querySelector('.card-imoveis-item');
    if (imageBox) {
      const img = imageBox.querySelector('img');
      if (img) imageCell = img;
    }
    // Fallback: any <img> directly under the card
    if (!imageCell) {
      const img = card.querySelector('img');
      if (img) imageCell = img;
    }

    // TEXT CELL: Use the .card-imoveis-dados .e-con-inner block if present, else .card-imoveis-dados itself
    let textCell = null;
    const dados = card.querySelector('.card-imoveis-dados');
    if (dados) {
      const inner = dados.querySelector('.e-con-inner');
      textCell = inner ? inner : dados;
    }

    // If for some reason no image or text, provide a placeholder so the row isn't empty
    rows.push([
      imageCell || document.createTextNode(''),
      textCell || document.createTextNode('')
    ]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
