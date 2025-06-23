/* global WebImporter */
export default function parse(element, { document }) {
  // Helper function to get all immediate content from a block in DOM order
  function getContentBlockElements(container) {
    // Get all relevant content inside this container in order
    const items = [];
    // Find all headings
    const headings = Array.from(container.querySelectorAll('.elementor-widget-heading .elementor-heading-title, h1, h2, h3'));
    // Find all text paragraphs/content
    const textParts = Array.from(container.querySelectorAll('.elementor-widget-text-editor .elementor-widget-container > *, .elementor-widget-text-editor > * , .elementor-widget-text-editor p, p'));
    // Find all buttons
    const buttons = Array.from(container.querySelectorAll('.elementor-widget-button a, a.elementor-button'));
    // We want to preserve order, so collect in DOM order from direct descendants
    const childEls = Array.from(container.querySelectorAll(':scope > *'));
    for (const el of childEls) {
      // Try to push each meaningful bit maintaining order
      if (el.querySelector('.elementor-widget-heading .elementor-heading-title, h1, h2, h3')) {
        // Grab all headings inside
        headings.forEach(h=>{ if (h.parentElement.closest('[data-id]')===el || h.parentElement===el) items.push(h); });
      }
      if (el.querySelector('.elementor-widget-text-editor')) {
        // Grab all text pieces inside
        textParts.forEach(t => { if(t.closest('[data-id]')===el || t.parentElement===el) items.push(t); });
      }
      if (el.querySelector('.elementor-widget-button a, a.elementor-button')) {
        // Grab all buttons inside
        buttons.forEach(b=>{ if (b.closest('[data-id]')===el || b.parentElement===el) items.push(b); });
      }
    }
    // If nothing found, fallback to headings, text, then button (in order of appearance)
    if (items.length === 0) {
      items.push(...headings, ...textParts, ...buttons);
    }
    // Remove duplicates while preserving order
    return Array.from(new Set(items));
  }

  // Find content container that contains heading and text
  function findContentContainer(root) {
    // Try all descendant containers
    const containers = Array.from(root.querySelectorAll(':scope > div'));
    for (const cont of containers) {
      if (
        cont.querySelector('.elementor-widget-heading .elementor-heading-title, h1, h2, h3') &&
        cont.querySelector('.elementor-widget-text-editor, p')
      ) {
        return cont;
      }
      // Sometimes nested .e-con-inner used
      const inner = cont.querySelector(':scope > .e-con-inner');
      if (inner && inner.querySelector('.elementor-widget-heading .elementor-heading-title, h1, h2, h3') && inner.querySelector('.elementor-widget-text-editor, p')) {
        return inner;
      }
    }
    // fallback: whole root
    return root;
  }

  const contentContainer = findContentContainer(element);
  const contentBlockEls = getContentBlockElements(contentContainer);

  // Build the table per spec: header, image (optional, empty here), content
  const table = WebImporter.DOMUtils.createTable([
    ['Hero'],
    [''],
    [contentBlockEls]
  ], document);

  element.replaceWith(table);
}
