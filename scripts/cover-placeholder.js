"use strict";

const fs = require("fs");
const path = require("path");

function pathnameOf(src) {
  if (!src) return "";
  try {
    return new URL(src, "https://local.invalid").pathname;
  } catch (error) {
    return src.split("?")[0];
  }
}

function loadPlaceholders(hexo) {
  const dir = path.join(hexo.base_dir, "assets-db/imgs");
  const map = new Map();
  if (!fs.existsSync(dir)) return map;
  for (const name of fs.readdirSync(dir)) {
    if (!name.endsWith(".json")) continue;
    let items;
    try {
      items = JSON.parse(fs.readFileSync(path.join(dir, name), "utf8"));
    } catch (error) {
      continue;
    }
    if (!Array.isArray(items)) continue;
    for (const item of items) {
      if (!item || !item.url || !item.placeholder) continue;
      map.set(pathnameOf(item.url), item.placeholder);
    }
  }
  return map;
}

function placeholderStyle(placeholder) {
  if (!placeholder || placeholder.startsWith("blurhash:")) return "";
  return /http|data:image/.test(placeholder)
    ? `background-image: url(${placeholder})`
    : placeholder;
}

function escapeAttr(value) {
  return String(value).replace(/"/g, "&quot;");
}

hexo.extend.filter.register(
  "after_render:html",
  function (str, data) {
    const placeholders = loadPlaceholders(this);
    if (!placeholders.size || !str) return str;

    const coverPh =
      data?.page?.coverPlaceholder ||
      placeholders.get(pathnameOf(data?.page?.cover || "")) ||
      "";

    if (
      coverPh &&
      str.includes('<div class="post-cover-img-wrap">') &&
      !str.includes('<div class="post-cover-img-wrap" style=')
    ) {
      str = str.replace(
        '<div class="post-cover-img-wrap">',
        `<div class="post-cover-img-wrap" style="${placeholderStyle(coverPh)}">`,
      );
    }

    return str.replace(
      /<div class="cover-img"><noscript>(<img\b[^>]*\bsrc="([^"]+)"[^>]*>)<\/noscript><span class="lazyload-wrap post-list-cover-lazy" data-content="([^"]*)"><span class="placeholder"(?: style="([^"]*)")?><\/span><\/span><\/div>/gi,
      (all, imgStr, src, content, existingStyle) => {
        if (existingStyle) return all;
        const ph = placeholders.get(pathnameOf(src));
        if (!ph) return all;
        const style = placeholderStyle(ph);
        let decoded = content;
        try {
          decoded = decodeURIComponent(content);
        } catch (error) {
          decoded = content;
        }
        const withAttr = /data-placeholderimg=/i.test(decoded)
          ? decoded
          : decoded.replace(
              /\s*\/?>$/,
              ` data-placeholderimg="${escapeAttr(ph)}">`,
            );
        const styleAttr = style ? ` style="${style}"` : "";
        return `<div class="cover-img"><noscript>${imgStr}</noscript><span class="lazyload-wrap post-list-cover-lazy" data-content="${encodeURIComponent(
          withAttr,
        )}"><span class="placeholder"${styleAttr}></span></span></div>`;
      },
    );
  },
  4,
);
