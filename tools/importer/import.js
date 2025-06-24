/*
 * Copyright 2024 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */
/* global WebImporter */
/* eslint-disable no-console */
import hero9Parser from './parsers/hero9.js';
import hero7Parser from './parsers/hero7.js';
import cards10Parser from './parsers/cards10.js';
import hero14Parser from './parsers/hero14.js';
import cards3Parser from './parsers/cards3.js';
import columns11Parser from './parsers/columns11.js';
import cards19Parser from './parsers/cards19.js';
import cards8Parser from './parsers/cards8.js';
import hero24Parser from './parsers/hero24.js';
import cards17Parser from './parsers/cards17.js';
import accordion25Parser from './parsers/accordion25.js';
import cards26Parser from './parsers/cards26.js';
import hero27Parser from './parsers/hero27.js';
import hero28Parser from './parsers/hero28.js';
import hero23Parser from './parsers/hero23.js';
import columns32Parser from './parsers/columns32.js';
import hero15Parser from './parsers/hero15.js';
import columns33Parser from './parsers/columns33.js';
import carousel21Parser from './parsers/carousel21.js';
import search4Parser from './parsers/search4.js';
import hero36Parser from './parsers/hero36.js';
import cards35Parser from './parsers/cards35.js';
import hero30Parser from './parsers/hero30.js';
import hero39Parser from './parsers/hero39.js';
import columns2Parser from './parsers/columns2.js';
import columns41Parser from './parsers/columns41.js';
import hero43Parser from './parsers/hero43.js';
import carousel20Parser from './parsers/carousel20.js';
import video42Parser from './parsers/video42.js';
import columns37Parser from './parsers/columns37.js';
import columns48Parser from './parsers/columns48.js';
import cards18Parser from './parsers/cards18.js';
import columns34Parser from './parsers/columns34.js';
import hero51Parser from './parsers/hero51.js';
import hero53Parser from './parsers/hero53.js';
import accordion44Parser from './parsers/accordion44.js';
import hero54Parser from './parsers/hero54.js';
import cardsNoImages55Parser from './parsers/cardsNoImages55.js';
import hero29Parser from './parsers/hero29.js';
import cards49Parser from './parsers/cards49.js';
import columns52Parser from './parsers/columns52.js';
import columns40Parser from './parsers/columns40.js';
import hero60Parser from './parsers/hero60.js';
import columns59Parser from './parsers/columns59.js';
import hero47Parser from './parsers/hero47.js';
import cards61Parser from './parsers/cards61.js';
import hero56Parser from './parsers/hero56.js';
import cards63Parser from './parsers/cards63.js';
import cards62Parser from './parsers/cards62.js';
import hero71Parser from './parsers/hero71.js';
import cards57Parser from './parsers/cards57.js';
import columns70Parser from './parsers/columns70.js';
import carousel45Parser from './parsers/carousel45.js';
import hero68Parser from './parsers/hero68.js';
import carousel16Parser from './parsers/carousel16.js';
import columns67Parser from './parsers/columns67.js';
import columns38Parser from './parsers/columns38.js';
import columns65Parser from './parsers/columns65.js';
import columns69Parser from './parsers/columns69.js';
import headerParser from './parsers/header.js';
import metadataParser from './parsers/metadata.js';
import cleanupTransformer from './transformers/cleanup.js';
import imageTransformer from './transformers/images.js';
import linkTransformer from './transformers/links.js';
import { TransformHook } from './transformers/transform.js';
import {
  generateDocumentPath,
  handleOnLoad,
  TableBuilder,
  mergeInventory,
} from './import.utils.js';

const parsers = {
  metadata: metadataParser,
  hero9: hero9Parser,
  hero7: hero7Parser,
  cards10: cards10Parser,
  hero14: hero14Parser,
  cards3: cards3Parser,
  columns11: columns11Parser,
  cards19: cards19Parser,
  cards8: cards8Parser,
  hero24: hero24Parser,
  cards17: cards17Parser,
  accordion25: accordion25Parser,
  cards26: cards26Parser,
  hero27: hero27Parser,
  hero28: hero28Parser,
  hero23: hero23Parser,
  columns32: columns32Parser,
  hero15: hero15Parser,
  columns33: columns33Parser,
  carousel21: carousel21Parser,
  search4: search4Parser,
  hero36: hero36Parser,
  cards35: cards35Parser,
  hero30: hero30Parser,
  hero39: hero39Parser,
  columns2: columns2Parser,
  columns41: columns41Parser,
  hero43: hero43Parser,
  carousel20: carousel20Parser,
  video42: video42Parser,
  columns37: columns37Parser,
  columns48: columns48Parser,
  cards18: cards18Parser,
  columns34: columns34Parser,
  hero51: hero51Parser,
  hero53: hero53Parser,
  accordion44: accordion44Parser,
  hero54: hero54Parser,
  cardsNoImages55: cardsNoImages55Parser,
  hero29: hero29Parser,
  cards49: cards49Parser,
  columns52: columns52Parser,
  columns40: columns40Parser,
  hero60: hero60Parser,
  columns59: columns59Parser,
  hero47: hero47Parser,
  cards61: cards61Parser,
  hero56: hero56Parser,
  cards63: cards63Parser,
  cards62: cards62Parser,
  hero71: hero71Parser,
  cards57: cards57Parser,
  columns70: columns70Parser,
  carousel45: carousel45Parser,
  hero68: hero68Parser,
  carousel16: carousel16Parser,
  columns67: columns67Parser,
  columns38: columns38Parser,
  columns65: columns65Parser,
  columns69: columns69Parser,
};

const transformers = {
  cleanup: cleanupTransformer,
  images: imageTransformer,
  links: linkTransformer,
};

WebImporter.Import = {
  findSiteUrl: (instance, siteUrls) => (
    siteUrls.find(({ id }) => id === instance.urlHash)
  ),
  transform: (hookName, element, payload) => {
    // perform any additional transformations to the page
    Object.entries(transformers).forEach(([, transformerFn]) => (
      transformerFn.call(this, hookName, element, payload)
    ));
  },
  getParserName: ({ name, key }) => key || name,
  getElementByXPath: (document, xpath) => {
    const result = document.evaluate(
      xpath,
      document,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null,
    );
    return result.singleNodeValue;
  },
  getFragmentXPaths: (
    { urls = [], fragments = [] },
    sourceUrl = '',
  ) => (fragments.flatMap(({ instances = [] }) => instances)
    .filter((instance) => {
      // find url in urls array
      const siteUrl = WebImporter.Import.findSiteUrl(instance, urls);
      if (!siteUrl) {
        return false;
      }
      return siteUrl.url === sourceUrl;
    })
    .map(({ xpath }) => xpath)),
};

const pageElements = [{ name: 'metadata' }];

/**
* Page transformation function
*/
function transformPage(main, { inventory, ...source }) {
  const { urls = [], blocks: inventoryBlocks = [] } = inventory;
  const { document, params: { originalURL } } = source;

  // get fragment elements from the current page
  const fragmentElements = WebImporter.Import.getFragmentXPaths(inventory, originalURL)
    .map((xpath) => WebImporter.Import.getElementByXPath(document, xpath))
    .filter((el) => el);

  // get dom elements for each block on the current page
  const blockElements = inventoryBlocks
    .flatMap((block) => block.instances
      .filter((instance) => WebImporter.Import.findSiteUrl(instance, urls)?.url === originalURL)
      .map((instance) => ({
        ...block,
        element: WebImporter.Import.getElementByXPath(document, instance.xpath),
      })))
    .filter((block) => block.element);

  // remove fragment elements from the current page
  fragmentElements.forEach((element) => {
    if (element) {
      element.remove();
    }
  });

  // before page transform hook
  WebImporter.Import.transform(TransformHook.beforePageTransform, main, { ...source });

  const tableBuilder = TableBuilder(WebImporter.DOMUtils.createTable);
  // transform all block elements using parsers
  [...pageElements, ...blockElements].forEach(({ element = main, ...pageBlock }) => {
    const parserName = WebImporter.Import.getParserName(pageBlock);
    const parserFn = parsers[parserName];
    if (!parserFn) return;
    try {
      // before parse hook
      WebImporter.Import.transform(TransformHook.beforeParse, element, { ...source });
      // parse the element
      WebImporter.DOMUtils.createTable = tableBuilder.build(parserName);
      parserFn.call(this, element, { ...source });
      WebImporter.DOMUtils.createTable = tableBuilder.restore();
      // after parse hook
      WebImporter.Import.transform(TransformHook.afterParse, element, { ...source });
    } catch (e) {
      console.warn(`Failed to parse block: ${pageBlock.key}`, e);
    }
  });
}

/**
* Fragment transformation function
*/
function transformFragment(main, { fragment, inventory, ...source }) {
  const { document, params: { originalURL } } = source;

  if (fragment.name === 'nav') {
    const navEl = document.createElement('div');

    // get number of blocks in the nav fragment
    const navBlocks = Math.floor(fragment.instances.length / fragment.instances.filter((ins) => ins.uuid.includes('-00-')).length);
    console.log('navBlocks', navBlocks);

    for (let i = 0; i < navBlocks; i += 1) {
      const { xpath } = fragment.instances[i];
      const el = WebImporter.Import.getElementByXPath(document, xpath);
      if (!el) {
        console.warn(`Failed to get element for xpath: ${xpath}`);
      } else {
        navEl.append(el);
      }
    }

    // body width
    const bodyWidthAttr = document.body.getAttribute('data-hlx-imp-body-width');
    const bodyWidth = bodyWidthAttr ? parseInt(bodyWidthAttr, 10) : 1000;

    try {
      const headerBlock = headerParser(navEl, {
        ...source, document, fragment, bodyWidth,
      });
      main.append(headerBlock);
    } catch (e) {
      console.warn('Failed to parse header block', e);
    }
  } else {
    const tableBuilder = TableBuilder(WebImporter.DOMUtils.createTable);

    (fragment.instances || [])
      .filter((instance) => {
        const siteUrl = WebImporter.Import.findSiteUrl(instance, inventory.urls);
        if (!siteUrl) {
          return false;
        }
        return `${siteUrl.url}#${fragment.name}` === originalURL;
      })
      .map(({ xpath }) => ({
        xpath,
        element: WebImporter.Import.getElementByXPath(document, xpath),
      }))
      .filter(({ element }) => element)
      .forEach(({ xpath, element }) => {
        main.append(element);

        const fragmentBlock = inventory.blocks
          .find(({ instances }) => instances.find((instance) => {
            const siteUrl = WebImporter.Import.findSiteUrl(instance, inventory.urls);
            return `${siteUrl.url}#${fragment.name}` === originalURL && instance.xpath === xpath;
          }));

        if (!fragmentBlock) return;
        const parserName = WebImporter.Import.getParserName(fragmentBlock);
        const parserFn = parsers[parserName];
        if (!parserFn) return;
        try {
          WebImporter.DOMUtils.createTable = tableBuilder.build(parserName);
          parserFn.call(this, element, source);
          WebImporter.DOMUtils.createTable = tableBuilder.restore();
        } catch (e) {
          console.warn(`Failed to parse block: ${fragmentBlock.key}, with xpath: ${xpath}`, e);
        }
      });
  }
}

export default {
  onLoad: async (payload) => {
    await handleOnLoad(payload);
  },

  transform: async (source) => {
    const { document, params: { originalURL } } = source;

    // sanitize the original URL
    /* eslint-disable no-param-reassign */
    source.params.originalURL = new URL(originalURL).href;

    /* eslint-disable-next-line prefer-const */
    let publishUrl = window.location.origin;
    // $$publishUrl = '{{{publishUrl}}}';

    let inventory = null;
    // $$inventory = {{{inventory}}};
    if (!inventory) {
      const siteUrlsUrl = new URL('/tools/importer/site-urls.json', publishUrl);
      const inventoryUrl = new URL('/tools/importer/inventory.json', publishUrl);
      try {
        // fetch and merge site-urls and inventory
        const siteUrlsResp = await fetch(siteUrlsUrl.href);
        const inventoryResp = await fetch(inventoryUrl.href);
        const siteUrls = await siteUrlsResp.json();
        inventory = await inventoryResp.json();
        inventory = mergeInventory(siteUrls, inventory, publishUrl);
      } catch (e) {
        console.error('Failed to merge site-urls and inventory');
      }
      if (!inventory) {
        return [];
      }
    }

    let main = document.body;

    // before transform hook
    WebImporter.Import.transform(TransformHook.beforeTransform, main, { ...source, inventory });

    // perform the transformation
    let path = null;
    const sourceUrl = new URL(originalURL);
    const fragName = sourceUrl.hash ? sourceUrl.hash.substring(1) : '';
    if (fragName) {
      // fragment transformation
      const fragment = inventory.fragments.find(({ name }) => name === fragName);
      if (!fragment) {
        return [];
      }
      main = document.createElement('div');
      transformFragment(main, { ...source, fragment, inventory });
      path = fragment.path;
    } else {
      // page transformation
      transformPage(main, { ...source, inventory });
      path = generateDocumentPath(source, inventory);
    }

    // after transform hook
    WebImporter.Import.transform(TransformHook.afterTransform, main, { ...source, inventory });

    return [{
      element: main,
      path,
    }];
  },
};
