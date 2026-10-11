"use strict";

const SUBSCRIBE_COL_RE = /<div class="footerLinkCol">\s*<h4>(?:订阅|Subscribe)<\/h4>[\s\S]*?<\/div>/g;

hexo.extend.filter.register("after_render:html", (html) =>
  html.replace(SUBSCRIBE_COL_RE, "")
);
