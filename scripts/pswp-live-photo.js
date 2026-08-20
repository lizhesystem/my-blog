"use strict";

hexo.extend.filter.register(
  "after_render:html",
  function (html) {
    if (!html.includes("lightbox.addFilter('itemData'")) return html;
    if (html.includes("live-photo-gallery-item')) return false")) return html;
    return html.replace(
      "lightbox.addFilter('itemData', (itemData) => {",
      `lightbox.addFilter('isContentZoomable', (isZoomable, content) => {
    const el = content && content.data && content.data.element;
    if (el && el.classList && el.classList.contains('live-photo-gallery-item')) {
      return false;
    }
    return isZoomable;
  });
  lightbox.addFilter('itemData', (itemData) => {`,
    );
  },
  20,
);
