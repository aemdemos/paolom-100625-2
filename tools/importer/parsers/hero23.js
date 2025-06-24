/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Find main heading
  const heading = element.querySelector('h1, h2, h3, h4, h5, h6, .elementor-heading-title');

  // 2. Find .e-con-inner that contains the instruction icon+text pairs
  const instructionInner = element.querySelector('.e-con-inner');

  // 3. Find all intro paragraphs (text not inside instructionInner)
  const allTextPs = Array.from(element.querySelectorAll('.elementor-widget-text-editor .elementor-widget-container > p'));
  let introParagraphs = allTextPs.filter(p => !instructionInner || !instructionInner.contains(p));

  // 4. For instruction pairs, group img and its paragraph as a div, in order
  let instructionPairs = [];
  if (instructionInner) {
    // Each pair is in a direct child .e-con-full
    const rows = Array.from(instructionInner.querySelectorAll(':scope > .e-con-full'));
    rows.forEach(row => {
      const img = row.querySelector('img');
      const p = row.querySelector('.elementor-widget-text-editor p');
      if (img && p) {
        const div = document.createElement('div');
        div.appendChild(img);
        div.appendChild(p);
        instructionPairs.push(div);
      } else if (img) {
        instructionPairs.push(img);
      } else if (p) {
        instructionPairs.push(p);
      }
    });
  }

  // 5. Find CTA button
  const button = element.querySelector('.elementor-widget-button a');
  let buttonP = null;
  if (button) {
    buttonP = document.createElement('p');
    buttonP.appendChild(button);
  }

  // Compose content: heading, intro paragraphs, instruction pairs, button
  const mainContent = [];
  if (heading) mainContent.push(heading);
  introParagraphs.forEach(p => mainContent.push(p));
  instructionPairs.forEach(div => mainContent.push(div));
  if (buttonP) mainContent.push(buttonP);

  // Build table
  const table = WebImporter.DOMUtils.createTable([
    ['Hero'],
    [''],
    [mainContent]
  ], document);
  element.replaceWith(table);
}
