const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { resolve } = require("node:path");
const { test } = require("node:test");
const { runInNewContext } = require("node:vm");

const html = readFileSync(
  resolve(__dirname, "../source/static/live-photo/index.html"),
  "utf8",
);
const script = html.match(/<script>([\s\S]*?)<\/script>/)[1];

function createPlayer({ hover = false, search } = {}) {
  function element() {
    const listeners = new Map();
    const classes = new Set();
    return {
      attributes: {},
      classList: {
        add: (...names) => names.forEach((name) => classes.add(name)),
        remove: (...names) => names.forEach((name) => classes.delete(name)),
        contains: (name) => classes.has(name),
      },
      addEventListener(name, listener) {
        if (!listeners.has(name)) listeners.set(name, []);
        listeners.get(name).push(listener);
      },
      emit(name, event = {}) {
        for (const listener of listeners.get(name) || []) listener(event);
      },
      setAttribute(name, value) {
        this.attributes[name] = value;
      },
      hasListener: (name) => listeners.has(name),
    };
  }

  const wrap = element();
  const trigger = element();
  const img = element();
  const video = element();
  const messages = [];
  video.loads = 0;
  video.plays = 0;
  video.load = function () {
    assert.ok(this.hasListener("error"));
    assert.ok(this.hasListener("canplay"));
    this.loads += 1;
  };
  video.play = function () {
    this.plays += 1;
    return Promise.resolve();
  };
  video.pause = () => video.emit("pause");
  const elements = {
    ".live-photo": wrap,
    ".live-trigger": trigger,
    ".live-img": img,
    ".live-video": video,
  };
  runInNewContext(script, {
    URLSearchParams,
    location: {
      search: search || "?picUrl=cover.webp&videoUrl=clip.MOV",
    },
    document: {
      getElementById: () => ({ querySelector: (name) => elements[name] }),
    },
    window: {
      matchMedia: () => ({ matches: hover }),
      location: { origin: "https://jiaozhe.me" },
      top: { postMessage: (...args) => messages.push(args) },
    },
  });
  const click = () => trigger.emit("click", {
    preventDefault() {},
    stopPropagation() {},
  });
  const clickCover = () => wrap.emit("click", {
    target: { closest: () => null },
  });
  return { wrap, trigger, img, video, messages, click, clickCover };
}

test("cover loads first; touch iframe preloads video without playing", () => {
  const { img, video, wrap } = createPlayer();
  assert.equal(img.src, "cover.webp");
  assert.equal(video.src, undefined);
  img.emit("load");
  assert.equal(video.src, "clip.MOV");
  assert.equal(video.preload, "auto");
  assert.equal(video.loads, 1);
  assert.equal(video.plays, 0);
  video.emit("canplay");
  assert.ok(wrap.classList.contains("is-image-ready"));
  assert.ok(!wrap.classList.contains("is-playing"));
  assert.ok(!wrap.classList.contains("is-loading"));
});

test("hover and repeated cover load do not reload prepared video", () => {
  const { wrap, img, video } = createPlayer({ hover: true });
  wrap.emit("pointerenter");
  img.emit("load");
  wrap.emit("pointerenter");
  assert.equal(video.loads, 1);
  assert.equal(video.plays, 0);
});

test("cover failure still prepares video and permits playback", () => {
  const { img, video, wrap } = createPlayer();
  img.emit("error");
  video.emit("loadedmetadata");
  assert.equal(video.loads, 1);
  assert.ok(wrap.classList.contains("is-ready"));
});

test("click calls play synchronously; video is revealed only when playing", () => {
  const { click, video, wrap } = createPlayer();
  click();
  assert.equal(video.loads, 1);
  assert.equal(video.plays, 1);
  assert.equal(video.volume, 1);
  assert.ok(wrap.classList.contains("is-loading"));
  video.emit("canplay");
  assert.equal(video.plays, 1);
  assert.ok(!wrap.classList.contains("is-playing"));
  video.emit("playing");
  assert.ok(wrap.classList.contains("is-playing"));
  assert.ok(wrap.classList.contains("is-running"));
  assert.ok(!wrap.classList.contains("is-loading"));
});

test("pause/resume, buffering and end preserve expected visual states", () => {
  const { img, click, video, wrap } = createPlayer();
  img.emit("load");
  click();
  video.emit("playing");
  click();
  assert.ok(!wrap.classList.contains("is-running"));
  assert.ok(wrap.classList.contains("is-playing"));
  click();
  assert.equal(video.plays, 2);
  video.emit("playing");
  video.emit("waiting");
  assert.ok(wrap.classList.contains("is-loading"));
  assert.ok(!wrap.classList.contains("is-running"));
  video.emit("playing");
  video.emit("ended");
  for (const name of ["is-playing", "is-running", "is-loading"]) {
    assert.ok(!wrap.classList.contains(name));
  }
});

test("play rejection restores cover, permits gallery and retries without reload", async () => {
  const { img, click, clickCover, messages, video, wrap, trigger } = createPlayer();
  img.emit("load");
  video.play = () => Promise.reject(new Error("NotAllowedError"));
  click();
  await Promise.resolve();
  for (const name of ["is-playing", "is-running", "is-loading"]) {
    assert.ok(!wrap.classList.contains(name));
  }
  assert.match(trigger.title, /retry/);
  clickCover();
  assert.deepEqual(messages, [["cover.webp", "https://jiaozhe.me"]]);
  video.play = () => Promise.resolve();
  click();
  video.emit("playing");
  assert.equal(video.loads, 1);
  assert.equal(trigger.title, "");
  assert.ok(wrap.classList.contains("is-running"));
});

test("media errors remain handled after playback starts and retry reloads", () => {
  const { img, click, video, wrap } = createPlayer();
  img.emit("load");
  click();
  video.emit("playing");
  video.emit("error");
  for (const name of ["is-playing", "is-running", "is-loading"]) {
    assert.ok(!wrap.classList.contains(name));
  }
  click();
  assert.equal(video.loads, 2);
  video.emit("playing");
  assert.ok(wrap.classList.contains("is-running"));
});

test("background preload failure does not loop and explicit click retries", () => {
  const { img, click, video, wrap } = createPlayer();
  img.emit("load");
  video.emit("error");
  assert.equal(video.loads, 1);
  assert.equal(video.plays, 0);
  assert.ok(!wrap.classList.contains("is-loading"));
  click();
  assert.equal(video.loads, 2);
  assert.equal(video.plays, 1);
});

test("stale play rejection cannot reset a newer playback request", async () => {
  const { img, click, video, wrap } = createPlayer();
  img.emit("load");
  let reject;
  video.play = () => new Promise((resolve, fail) => { reject = fail; });
  click();
  video.emit("error");
  video.play = () => Promise.resolve();
  click();
  video.emit("playing");
  reject(new Error("AbortError"));
  await Promise.resolve();
  assert.ok(wrap.classList.contains("is-running"));
});

test("pausing invalidates a pending play rejection without hiding frozen frame", async () => {
  const { click, video, wrap } = createPlayer();
  let reject;
  video.play = () => new Promise((resolve, fail) => { reject = fail; });
  click();
  video.emit("playing");
  click();
  reject(new Error("AbortError"));
  await Promise.resolve();
  assert.ok(wrap.classList.contains("is-playing"));
  assert.ok(!wrap.classList.contains("is-running"));
});

test("synchronous play exceptions restore cover and permit retry", () => {
  const { click, video, wrap } = createPlayer();
  video.play = () => { throw new Error("Playback failed"); };
  click();
  assert.ok(!wrap.classList.contains("is-loading"));
  video.play = () => Promise.resolve();
  click();
  video.emit("playing");
  assert.ok(wrap.classList.contains("is-running"));
});

test("loop, muted, volume and PhotoSwipe message remain supported", () => {
  const { click, video, clickCover, messages } = createPlayer({
    search: "?photoSrc=cover.webp&videoSrc=clip.mp4&loop=1&muted=1&volume=25",
  });
  assert.equal(video.loop, true);
  assert.equal(video.muted, true);
  clickCover();
  assert.equal(messages.length, 1);
  click();
  clickCover();
  assert.equal(messages.length, 1);
  const audible = createPlayer({
    search: "?picUrl=cover.webp&videoUrl=clip.mp4&volume=25",
  });
  audible.click();
  assert.equal(audible.video.volume, 0.25);
});

test("Hexo tag retains lazy iframe, root, URLs and aspect ratio", () => {
  let render;
  runInNewContext(readFileSync(resolve(__dirname, "../scripts/live-photo.js"), "utf8"), {
    URLSearchParams,
    hexo: {
      config: { root: "/blog/" },
      extend: { tag: { register: (name, handler) => { render = handler; } } },
    },
  });
  const output = render([
    "photoSrc:/cover.webp",
    "videoSrc:https://img.jiaozhe.me/clip.MOV",
    "muted:true",
  ]);
  assert.match(output, /loading="lazy"/);
  assert.match(output, /aspect-ratio: 1920\/1080/);
  const url = new URL(output.match(/src="([^"]+)"/)[1], "https://jiaozhe.me");
  assert.equal(url.pathname, "/blog/static/live-photo/");
  assert.equal(url.searchParams.get("picUrl"), "/blog/cover.webp");
  assert.equal(url.searchParams.get("videoUrl"), "https://img.jiaozhe.me/clip.MOV");
  assert.equal(url.searchParams.get("muted"), "1");
});
