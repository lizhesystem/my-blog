"use strict";

const KEYS = [
  "photoSrc",
  "videoSrc",
  "picUrl",
  "videoUrl",
  "loop",
  "muted",
  "volume",
];

function parseArgs(args) {
  const named = {};
  const rest = [];
  for (const arg of args) {
    const matched = KEYS.find(
      (key) => arg.startsWith(`${key}:`) || arg.startsWith(`${key}=`),
    );
    if (matched) {
      named[matched] = arg.slice(matched.length + 1);
    } else {
      rest.push(arg);
    }
  }
  return {
    photoSrc: named.photoSrc || named.picUrl || rest[0] || "",
    videoSrc: named.videoSrc || named.videoUrl || rest[1] || "",
    loop: named.loop === "1" || named.loop === "true",
    muted: named.muted === "1" || named.muted === "true",
    volume: named.volume || "",
  };
}

function withRoot(path) {
  const root = String(hexo.config.root || "/");
  if (/^https?:\/\//i.test(path) || path.startsWith("//")) return path;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${root.replace(/\/$/, "")}${normalized}`;
}

hexo.extend.tag.register("live_photo", function (args) {
  const opts = parseArgs(args);
  if (!opts.photoSrc || !opts.videoSrc) return "";

  const params = new URLSearchParams({
    picUrl: withRoot(opts.photoSrc),
    videoUrl: withRoot(opts.videoSrc),
  });
  if (opts.loop) params.set("loop", "1");
  if (opts.muted) params.set("muted", "1");
  if (opts.volume) params.set("volume", String(opts.volume));

  const src = `${withRoot("/static/live-photo/")}?${params.toString()}`;
  return `<iframe src="${src}" scrolling="no" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen="true" style="width: 100%; aspect-ratio: 1920/1080;"></iframe>`;
});
