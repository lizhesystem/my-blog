"use strict";

const fs = require("fs");
const path = require("path");

function loadImageMeta(hexo) {
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
      if (!item || !item.url) continue;
      let pathname = item.url;
      try {
        pathname = new URL(item.url, "https://local.invalid").pathname;
      } catch (error) {
        pathname = item.url;
      }
      map.set(pathname, {
        placeholder: item.placeholder || "",
        width: Number(item.width) || 0,
        height: Number(item.height) || 0,
      });
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

function escapeAttr(value) {
  return String(value).replace(/"/g, "&quot;");
}

hexo.extend.filter.register(
  "after_post_render",
  function (data) {
    if (!data.content || !/<img/i.test(data.content)) return data;
    const metas = loadImageMeta(this);
    if (!metas.size) return data;

    data.content = data.content.replace(/<img\b([^>]*?)>/gi, (tag, attrs) => {
      const srcMatch = attrs.match(/\ssrc=["']([^"']+)["']/i);
      if (!srcMatch) return tag;
      const meta = metas.get(pathnameOf(srcMatch[1]));
      if (!meta) return tag;

      let next = tag;

      if (
        meta.placeholder &&
        !/data-placeholderimg=/i.test(next) &&
        !/\$placeholder=/i.test(next)
      ) {
        next = next.replace(
          /\s*\/?>$/,
          ` data-placeholderimg="${escapeAttr(meta.placeholder)}">`,
        );
      }

      if (
        meta.width > 0 &&
        meta.height > 0 &&
        !/\$aspect-ratio=/i.test(next) &&
        !/aspect-ratio\s*:/i.test(next)
      ) {
        const ratio = `${meta.width}/${meta.height}`;
        if (/\salt=["'][^"']*["']/i.test(next)) {
          next = next.replace(/\salt=(["'])([^"']*)\1/i, (m, q, alt) => {
            const merged = `${alt} $aspect-ratio=${ratio}=aspect-ratio`.trim();
            return ` alt=${q}${merged}${q}`;
          });
        } else {
          next = next.replace(
            /\s*\/?>$/,
            ` alt="$aspect-ratio=${ratio}=aspect-ratio">`,
          );
        }
      }

      return next;
    });
    return data;
  },
  1,
);
