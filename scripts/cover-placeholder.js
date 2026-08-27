"use strict";

function pathnameOf(src) {
  if (!src) return "";
  try {
    return new URL(src, "https://local.invalid").pathname;
  } catch (error) {
    return String(src).split("?")[0];
  }
}

function placeholderStyle(placeholder) {
  if (!placeholder || String(placeholder).startsWith("blurhash:")) return "";
  if (/^(https?:|data:image)/i.test(placeholder)) {
    return `background-image: url(${placeholder})`;
  }
  if (/^(linear|radial|conic)-gradient\(/i.test(placeholder) || /^url\(/i.test(placeholder)) {
    return `background-image: ${placeholder}`;
  }
  return placeholder;
}

function escapeAttr(value) {
  return String(value).replace(/"/g, "&quot;");
}

function coverPlaceholdersFromPosts(hexo) {
  const map = new Map();
  const posts = hexo.locals.get("posts");
  if (!posts) return map;
  posts.forEach((post) => {
    if (!post.coverPlaceholder) return;
    const cover = post.thumbnail || post.cover;
    if (!cover) return;
    map.set(pathnameOf(cover), post.coverPlaceholder);
  });
  return map;
}

hexo.extend.filter.register(
  "after_render:html",
  function (str, data) {
    if (!str) return str;

    const coverPhByPath = coverPlaceholdersFromPosts(this);
    const pageCoverPh = data?.page?.coverPlaceholder || "";

    if (pageCoverPh && /class="post-cover-img-wrap"/.test(str)) {
      const style = placeholderStyle(pageCoverPh);
      str = str.replace(
        /<div class="post-cover-img-wrap"(?: style="[^"]*")?>/,
        `<div class="post-cover-img-wrap"${style ? ` style="${style}"` : ""}>`,
      );
    }

    return str.replace(
      /<div class="cover-img"><noscript>(<img\b[^>]*\bsrc="([^"]+)"[^>]*>)<\/noscript><span class="lazyload-wrap post-list-cover-lazy" data-content="([^"]*)"><span class="placeholder"(?: style="[^"]*")?><\/span><\/span><\/div>/gi,
      (all, imgStr, src, content) => {
        const ph = coverPhByPath.get(pathnameOf(src));
        let decoded = content;
        try {
          decoded = decodeURIComponent(content);
        } catch (error) {
          decoded = content;
        }
        const stripped = decoded.replace(/\sdata-placeholderimg="[^"]*"/i, "");

        if (!ph) {
          return `<div class="cover-img"><noscript>${imgStr}</noscript><span class="lazyload-wrap post-list-cover-lazy" data-content="${encodeURIComponent(
            stripped,
          )}"><span class="placeholder"></span></span></div>`;
        }

        const withAttr = stripped.replace(
          /\s*\/?>$/,
          ` data-placeholderimg="${escapeAttr(ph)}">`,
        );
        const style = placeholderStyle(ph);
        const styleAttr = style ? ` style="${style}"` : "";
        return `<div class="cover-img"><noscript>${imgStr}</noscript><span class="lazyload-wrap post-list-cover-lazy" data-content="${encodeURIComponent(
          withAttr,
        )}"><span class="placeholder"${styleAttr}></span></span></div>`;
      },
    );
  },
  4,
);
