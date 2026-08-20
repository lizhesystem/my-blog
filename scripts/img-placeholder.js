"use strict";

const fs = require("fs");
const path = require("path");

function loadPlaceholders(hexo) {
  const dir = path.join(hexo.base_dir, "assets-db/imgs");
  if (!fs.existsSync(dir)) return new Map();

  const map = new Map();
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
      let pathname = item.url;
      try {
        pathname = new URL(item.url, "https://local.invalid").pathname;
      } catch (error) {
        pathname = item.url;
      }
      map.set(pathname, item.placeholder);
    }
  }
  return map;
}

function pathnameOf(src) {
  if (!src) return "";
  try {
    return new URL(src, "https://local.invalid").pathname;
  } catch (error) {
    return src.split("?")[0];
  }
}

hexo.extend.filter.register(
  "after_post_render",
  function (data) {
    if (!data.content || !/<img/i.test(data.content)) return data;
    const placeholders = loadPlaceholders(this);
    if (!placeholders.size) return data;

    data.content = data.content.replace(
      /<img\b([^>]*?)>/gi,
      (tag, attrs) => {
        if (/data-placeholderimg=/i.test(tag) || /\$placeholder=/i.test(tag)) {
          return tag;
        }
        const srcMatch = attrs.match(/\ssrc=["']([^"']+)["']/i);
        if (!srcMatch) return tag;
        const placeholder = placeholders.get(pathnameOf(srcMatch[1]));
        if (!placeholder) return tag;
        return tag.replace(
          /\s*\/?>$/,
          ` data-placeholderimg="${placeholder.replace(/"/g, "&quot;")}">`,
        );
      },
    );
    return data;
  },
  1,
);
