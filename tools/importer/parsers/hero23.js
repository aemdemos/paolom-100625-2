/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: get the content block with heading, instructions, cta etc.
  function getHeroContent(el) {
    // Heading (first heading in the block)
    const heading = el.querySelector('.elementor-widget-heading h1, .elementor-widget-heading h2, .elementor-widget-heading h3, .elementor-widget-heading h4, .elementor-widget-heading h5, .elementor-widget-heading h6');
    // Subheading: first .elementor-widget-text-editor p that is NOT an instruction (and not empty)
    const textPs = Array.from(el.querySelectorAll('.elementor-widget-text-editor p'));
    let subheading = null;
    let instructionsTitle = null;
    let mouseInstructions = [];
    textPs.forEach(p => {
      if (!subheading && p.textContent.trim() && !/Instruções de uso/i.test(p.textContent) && !/mouse/i.test(p.textContent)) {
        subheading = p;
      }
      if (/Instruções de uso/i.test(p.textContent)) instructionsTitle = p;
      if (/mouse/i.test(p.textContent)) mouseInstructions.push(p);
    });
    // For instruction icons + text (each block is .elementor-widget-image + .elementor-widget-text-editor)
    const instructionBlocks = [];
    const allImageWidgets = el.querySelectorAll('.elementor-widget-image');
    allImageWidgets.forEach(imgWidget => {
      const img = imgWidget.querySelector('img');
      // Next text widget for instruction
      let next = imgWidget;
      while (next && !(next = next.nextElementSibling).classList.contains('elementor-widget-text-editor')) {}
      if (img && next) {
        const text = next.querySelector('p');
        if (text && (/mouse/i.test(text.textContent) || /ampliar/i.test(text.textContent))) {
          const div = document.createElement('div');
          div.appendChild(img);
          div.appendChild(text);
          instructionBlocks.push(div);
        }
      }
    });
    // CTA (button)
    const cta = el.querySelector('.elementor-widget-button a');
    // Compose content
    const content = [];
    if (heading) content.push(heading);
    if (subheading) content.push(subheading);
    if (instructionsTitle) content.push(instructionsTitle);
    if (instructionBlocks.length) {
      // Place icons+instructions in a row
      const row = document.createElement('div');
      row.style.display = 'flex';
      instructionBlocks.forEach(block => {
        block.style.marginRight = '2em';
        row.appendChild(block);
      });
      content.push(row);
    }
    if (cta) content.push(cta);
    return content;
  }
  // Compose table: 1 column, 3 rows; header row is 'Hero'
  const heroContent = getHeroContent(element);
  const cells = [
    ['Hero'],
    [''],
    [heroContent]
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
