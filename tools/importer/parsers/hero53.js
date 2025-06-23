/* global WebImporter */
export default function parse(element, { document }) {
  // Select the inner containers (for logical left/right columns)
  const colContainers = element.querySelectorAll(':scope > .e-con-inner > .e-con');

  // Left: logo and tagline (subheading)
  let logo = null;
  let tagline = null;
  if (colContainers[0]) {
    // logo
    const logoImg = colContainers[0].querySelector('img');
    if (logoImg) logo = logoImg;
    // tagline (first .elementor-widget-text-editor)
    const taglineWidget = colContainers[0].querySelector('.elementor-widget-text-editor .elementor-widget-container');
    if (taglineWidget) {
      // Only non-empty nodes
      const taglineNodes = Array.from(taglineWidget.childNodes).filter(n => {
        if (n.nodeType === Node.ELEMENT_NODE && n.tagName === 'DIV' && n.innerHTML.includes('&nbsp;') && n.textContent.trim() === '') {
          return false;
        }
        // skip pure whitespace nodes
        if (n.nodeType === Node.TEXT_NODE && n.textContent.trim() === '') {
          return false;
        }
        return true;
      });
      if (taglineNodes.length === 1) {
        tagline = taglineNodes[0];
      } else if (taglineNodes.length > 1) {
        const d = document.createElement('div');
        taglineNodes.forEach(node => d.append(node));
        tagline = d;
      }
    }
  }

  // Right: heading and paragraph
  let heading = null;
  let body = null;
  if (colContainers[1]) {
    // heading
    const headingWidget = colContainers[1].querySelector('.elementor-widget-heading .elementor-widget-container');
    if (headingWidget) {
      const h = headingWidget.querySelector('h1, h2, h3, h4, h5, h6');
      if (h) heading = h;
    }
    // body (first .elementor-widget-text-editor)
    const bodyWidget = colContainers[1].querySelector('.elementor-widget-text-editor .elementor-widget-container');
    if (bodyWidget) {
      // Only non-empty nodes
      const bodyNodes = Array.from(bodyWidget.childNodes).filter(n => {
        if (n.nodeType === Node.ELEMENT_NODE && n.tagName === 'DIV' && n.innerHTML.includes('&nbsp;') && n.textContent.trim() === '') {
          return false;
        }
        if (n.nodeType === Node.TEXT_NODE && n.textContent.trim() === '') {
          return false;
        }
        return true;
      });
      if (bodyNodes.length === 1) {
        body = bodyNodes[0];
      } else if (bodyNodes.length > 1) {
        const d = document.createElement('div');
        bodyNodes.forEach(node => d.append(node));
        body = d;
      }
    }
  }

  // Compose text block (heading, tagline, body)
  const textBlock = document.createElement('div');
  if (heading) textBlock.appendChild(heading);
  if (tagline) textBlock.appendChild(tagline);
  if (body) textBlock.appendChild(body);

  // Compose the table: [header], [image], [text]
  const cells = [
    ['Hero'],
    [logo ? logo : ''],
    [textBlock]
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
