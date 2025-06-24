/* global WebImporter */
export default function parse(element, { document }) {
  // Get the main container of interest, considering nested .e-con-inner
  const inner = element.querySelector(':scope > .e-con-inner') || element;
  const children = Array.from(inner.children);

  // 1. Find the heading (title)
  let headingEl = null;
  const headingWidget = children.find(el => el.classList.contains('elementor-widget-heading'));
  if (headingWidget) {
    headingEl = headingWidget.querySelector('h1, h2, h3, h4, h5, h6');
  }

  // 2. Find all text editor widgets
  const textEditorWidgets = children.filter(el => el.classList.contains('elementor-widget-text-editor'));
  // subheading: first
  let subheadingEl = textEditorWidgets[0] ? textEditorWidgets[0].querySelector('p') : null;
  // after video paragraph: second
  let afterVideoTextEl = textEditorWidgets[1] ? textEditorWidgets[1].querySelector('p') : null;
  // disclaimer: third
  let disclaimerEl = textEditorWidgets[2] ? textEditorWidgets[2].querySelector('p') : null;

  // 3. Find background image (from video overlay)
  let backgroundImgEl = null;
  const videoWidget = children.find(el => el.classList.contains('elementor-widget-video'));
  if (videoWidget) {
    const overlayDiv = videoWidget.querySelector('.elementor-custom-embed-image-overlay');
    if (overlayDiv) {
      const style = overlayDiv.getAttribute('style');
      if (style) {
        const match = style.match(/url\(([^)]+)\)/);
        if (match && match[1]) {
          backgroundImgEl = document.createElement('img');
          backgroundImgEl.src = match[1];
          backgroundImgEl.alt = '';
        }
      }
    }
  }

  // 4. Find the button CTA (if available)
  let ctaEl = null;
  const buttonWidget = children.find(el => el.classList.contains('elementor-widget-button'));
  if (buttonWidget) {
    const link = buttonWidget.querySelector('a');
    if (link) {
      ctaEl = link;
    }
  }

  // Compose third row content (preserving order as seen in screenshot/HTML)
  // Heading, subheading, after video text, CTA, disclaimer
  const content = [];
  if (headingEl) content.push(headingEl);
  if (subheadingEl) content.push(subheadingEl);
  if (afterVideoTextEl) content.push(afterVideoTextEl);
  if (ctaEl) content.push(ctaEl);
  if (disclaimerEl) content.push(disclaimerEl);

  // Compose the table. Header is 'Hero', second row is background image (or empty), third is content
  const table = WebImporter.DOMUtils.createTable([
    ['Hero'],
    [backgroundImgEl ? backgroundImgEl : ''],
    [content.length > 0 ? content : '']
  ], document);

  element.replaceWith(table);
}
