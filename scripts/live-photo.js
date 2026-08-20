"use strict";

const PLAYER = "https://lynanbreeze.github.io/live-photo/";
const KEYS = [
  "photoSrc",
  "videoSrc",
  "picUrl",
  "videoUrl",
  "loop",
  "muted",
  "volume",
  "useApple",
];

function parseArgs(args) {
  const named = {};
  const rest = [];
  for (const arg of args) {
    const matched = KEYS.find(
      (key) =>
        arg.startsWith(`${key}:`) || arg.startsWith(`${key}=`),
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
    volume: named.volume || "100",
    useApple: named.useApple === "1" || named.useApple === "true",
  };
}

function escapeAttr(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function toAbs(src) {
  if (!src || /^https?:\/\//i.test(src) || src.startsWith("//")) {
    return src;
  }
  const url = String(hexo.config.url || "").replace(/\/$/, "");
  const path = src.startsWith("/") ? src : `/${src}`;
  return `${url}${path}`;
}

function renderIframe(opts) {
  const params = new URLSearchParams({
    photoSrc: toAbs(opts.photoSrc),
    videoSrc: toAbs(opts.videoSrc),
  });
  if (opts.loop) params.set("loop", "1");
  if (opts.muted) params.set("muted", "1");
  if (opts.volume) params.set("volume", String(opts.volume));
  if (opts.useApple) params.set("useApple", "1");
  return `<iframe class="live-photo-embed" src="${PLAYER}?${params.toString()}" scrolling="no" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen="true" style="width:100%;aspect-ratio:16/9;border:0;display:block;"></iframe>`;
}

function renderNative(opts) {
  return `<div class="live-photo" data-live-photo data-loop="${opts.loop ? "1" : ""}" data-muted="${opts.muted ? "1" : ""}" data-volume="${escapeAttr(opts.volume)}"><button class="live-trigger" type="button"><span class="trigger-icon"></span><span class="trigger-text">LIVE</span></button><img class="live-img" no-lazy src="${escapeAttr(opts.photoSrc)}" alt=""><video class="live-video" playsinline webkit-playsinline ${opts.loop ? "loop" : ""} ${opts.muted ? "muted" : ""} src="${escapeAttr(opts.videoSrc)}"></video></div>`;
}

hexo.extend.tag.register("live_photo", function (args) {
  const opts = parseArgs(args);
  if (!opts.photoSrc || !opts.videoSrc) return "";
  return opts.useApple ? renderIframe(opts) : renderNative(opts);
});

hexo.extend.filter.register("after_post_render", function (data) {
  if (!data.content || !data.content.includes("data-live-photo")) return data;
  if (data.content.includes("data-live-photo-inited")) return data;
  data.content += `<style data-live-photo-inited>.live-photo{position:relative;width:100%;aspect-ratio:16/9;cursor:pointer;overflow:hidden;border-radius:4px}.live-trigger{width:90px;height:40px;background:rgba(255,255,255,.7);backdrop-filter:blur(5px);position:absolute;top:10px;left:10px;border:0;border-radius:4px;z-index:3;display:flex;justify-content:center;align-items:center;cursor:pointer;opacity:0;transition:opacity .3s ease}.live-photo.is-ready .live-trigger{opacity:1}.live-trigger .trigger-icon{width:30px;height:30px;margin-right:5px;background:url("data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMTAyNCAxMDI0IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Ik01MjAuMTQ5MzMzIDg1My4yNDhhNDIuNjY2NjY3IDQyLjY2NjY2NyAwIDEgMSAyLjAwNTMzNCA4NS4zMzMzMzNMNTEyIDkzOC42NjY2NjdsLTEwLjE1NDY2Ny0wLjEyOGE0Mi42NjY2NjcgNDIuNjY2NjY3IDAgMSAxIDIuMDA1MzM0LTg1LjMzMzMzNEw1MTIgODUzLjMzMzMzM2w4LjE0OTMzMy0wLjA4NTMzM3ogbTE2OS40NzItNDkuNzA2NjY3YTQyLjY2NjY2NyA0Mi42NjY2NjcgMCAxIDEgNDQuNTAxMzM0IDcyLjgzMiA0MjYuNDk2IDQyNi40OTYgMCAwIDEtMTcuNTc4NjY3IDEwLjE1NDY2NyA0Mi42NjY2NjcgNDIuNjY2NjY3IDAgMCAxLTQwLjk2LTc0Ljg4YzQuNzM2LTIuNTYgOS40MjkzMzMtNS4yOTA2NjcgMTQuMDgtOC4xMDY2Njd6IG0tNDEzLjkwOTMzMyAxNC4xNjUzMzRhNDIuNjY2NjY3IDQyLjY2NjY2NyAwIDAgMSA1OC42NjY2NjctMTQuMTY1MzM0YzQuNjA4IDIuODE2IDkuMzAxMzMzIDUuNTQ2NjY3IDE0LjA4IDguMTA2NjY3YTQyLjY2NjY2NyA0Mi42NjY2NjcgMCAwIDEtNDEuMDAyNjY3IDc0Ljg4Yy01Ljk3MzMzMy0zLjI0MjY2Ny0xMS44MTg2NjctNi42NTYtMTcuNTc4NjY3LTEwLjE1NDY2N2E0Mi42NjY2NjcgNDIuNjY2NjY3IDAgMCAxLTE0LjE2NTMzMy01OC42NjY2NjZ6TTUxMiAyNTZhMjU2IDI1NiAwIDEgMSAwIDUxMiAyNTYgMjU2IDAgMCAxIDAtNTEyeiBtMjk5LjY0OCA0MTkuNTg0YTQyLjY2NjY2NyA0Mi42NjY2NjcgMCAwIDEgNzQuODggNDAuOTZjLTMuMjQyNjY3IDUuOTczMzMzLTYuNjU2IDExLjgxODY2Ny0xMC4xNTQ2NjcgMTcuNTc4NjY3YTQyLjY2NjY2NyA0Mi42NjY2NjcgMCAwIDEtNzIuODMyLTQ0LjUwMTMzNGMyLjgxNi00LjYwOCA1LjU0NjY2Ny05LjMwMTMzMyA4LjEwNjY2Ny0xNC4wOHpNMTU0LjQ1MzMzMyA2NTguNjQ1MzMzYTQyLjY2NjY2NyA0Mi42NjY2NjcgMCAwIDEgNTcuOTQxMzM0IDE2LjkzODY2N2MyLjU2IDQuNzM2IDUuMjkwNjY3IDkuNDI5MzMzIDguMTA2NjY2IDE0LjA4YTQyLjY2NjY2NyA0Mi42NjY2NjcgMCAxIDEtNzIuODMyIDQ0LjQ1ODY2NyA0MjUuNTU3MzMzIDQyNS41NTczMzMgMCAwIDEtMTAuMTU0NjY2LTE3LjU3ODY2NyA0Mi42NjY2NjcgNDIuNjY2NjY3IDAgMCAxIDE2LjkzODY2Ni01Ny44OTg2Njd6TTUxMiA0MjYuNjY2NjY3YTg1LjMzMzMzMyA4NS4zMzMzMzMgMCAxIDAgMCAxNzAuNjY2NjY2IDg1LjMzMzMzMyA4NS4zMzMzMzMgMCAwIDAgMC0xNzAuNjY2NjY2eiBtLTM4Mi44OTA2NjcgMzMuNDkzMzMzYTQyLjY2NjY2NyA0Mi42NjY2NjcgMCAwIDEgNDEuNjQyNjY3IDQzLjY5MDY2N2wtMC4wNDI2NjcgMTIuMjQ1MzMzIDAuMDQyNjY3IDQuMDUzMzMzYTQyLjY2NjY2NyA0Mi42NjY2NjcgMCAwIDEtODUuMzMzMzMzIDIuMDA1MzM0bC0wLjA0MjY2Ny0xNS4yMzIgMC4wODUzMzMtNS4xMmE0Mi42NjY2NjcgNDIuNjY2NjY3IDAgMCAxIDQzLjY0OC00MS42NDI2Njd6IG03NjUuNzgxMzM0IDBhNDIuNjY2NjY3IDQyLjY2NjY2NyAwIDAgMSA0My42NDggNDEuNjg1MzMzTDkzOC42NjY2NjcgNTEybC0wLjEyOCAxMC4xNTQ2NjdhNDIuNjY2NjY3IDQyLjY2NjY2NyAwIDEgMS04NS4zMzMzMzQtMi4wMDUzMzRMODUzLjMzMzMzMyA1MTJsLTAuMDg1MzMzLTguMTQ5MzMzYTQyLjY2NjY2NyA0Mi42NjY2NjcgMCAwIDEgNDEuNjQyNjY3LTQzLjY5MDY2N3ogbS03Ny4yMjY2NjctMTg0LjQ0OGE0Mi42NjY2NjcgMCAwIDEgNTguNjY2NjY3IDE0LjE2NTMzM2MzLjU0MTMzMyA1Ljc2IDYuOTU0NjY3IDExLjY0OCAxMC4xOTczMzMgMTcuNTc4NjY3YTQyLjY2NjY2NyA0Mi42NjY2NjcgMCAxIDEtNzQuODggNDAuOTYgMzQwLjc3ODY2NyAzNDAuNzc4NjY3IDAgMCAwLTguMTA2NjY3LTE0LjA4IDQyLjY2NjY2NyA0Mi42NjY2NjcgMCAwIDEgMTQuMTY1MzM0LTU4LjYyNHpNMTQ3LjYyNjY2NyAyODkuODc3MzMzYTQyLjY2NjY2NyA0Mi42NjY2NjcgMCAwIDEgNzIuODMyIDQ0LjUwMTMzNGMtMi44MTYgNC42MDgtNS41NDY2NjcgOS4zMDEzMzMtOC4xMDY2NjcgMTQuMDhhNDIuNjY2NjY3IDQyLjY2NjY2NyAwIDEgMS03NC44OC00MS4wMDI2NjdjMy4yNDI2NjctNS45NzMzMzMgNi42NTYtMTEuODE4NjY3IDEwLjE1NDY2Ny0xNy41Nzg2Njd6IG01MTEuMDE4NjY2LTEzNS40NjY2NjZhNDIuNjY2NjY3IDQyLjY2NjY2NyAwIDAgMSA1Ny44OTg2NjctMTYuOTM4NjY3YzUuOTczMzMzIDMuMjQyNjY3IDExLjgxODY2NyA2LjY1NiAxNy41Nzg2NjcgMTAuMTU0NjY3YTQyLjY2NjY2NyA0Mi42NjY2NjcgMCAwIDEtNDQuNTAxMzM0IDcyLjgzMiAzNDAuNDM3MzMzIDM0MC40MzczMzMgMCAwIDAtMTQuMDgtOC4xMDY2NjcgNDIuNjY2NjY3IDQyLjY2NjY2NyAwIDAgMS0xNi44OTYtNTcuOTQxMzMzek0zMjEuNDU2IDEzNy40NzJhNDIuNjY2NjY3IDQyLjY2NjY2NyAwIDEgMSA0MC45NiA3NC44OCAzNDAuNzM2IDM0MC43MzYgMCAwIDAtMTQuMDggOC4xMDY2NjdBNDIuNjY2NjY3IDQyLjY2NjY2NyAwIDAgMSAyODkuOTIgMTQ3LjYyNjY2N2M1Ljc2LTMuNDk4NjY3IDExLjY0OC02LjkxMiAxNy41Nzg2NjctMTAuMTU0NjY3ek01MTIgODUuMzMzMzMzbDEwLjE1NDY2NyAwLjEyOGE0Mi42NjY2NjcgNDIuNjY2NjY3IDAgMCAxLTIuMDA1MzM0IDg1LjMzMzMzNEw1MTIgMTcwLjY2NjY2N2wtOC4xNDkzMzMgMC4wODUzMzNhNDIuNjY2NjY3IDQyLjY2NjY2NyAwIDAgMS0yLjAwNTMzNC04NS4zMzMzMzNMNTEyIDg1LjMzMzMzeiIgZmlsbD0iIzIzMjMyMyIvPjwvc3ZnPg==") center/cover no-repeat;animation:live-photo-spin 5s linear infinite;animation-play-state:paused}.live-photo.is-running .trigger-icon{animation-play-state:running}.live-trigger .trigger-text{letter-spacing:2px;font-weight:700;color:#232323}.live-img,.live-video{width:100%;height:100%;position:absolute;inset:0;object-fit:cover}.live-img{z-index:1}.live-video{z-index:2;opacity:0;transition:opacity .3s ease}.live-photo.is-playing .live-video{opacity:1}@keyframes live-photo-spin{to{transform:rotate(360deg)}}@media (max-width:768px){.live-trigger{transform:scale(.8);transform-origin:top left}}</style><script>
(function(){
  function bind(root){
    if(root.dataset.bound) return;
    root.dataset.bound="1";
    var video=root.querySelector("video");
    var trigger=root.querySelector(".live-trigger");
    var playing=false;
    var running=false;
    function ready(){root.classList.add("is-ready");}
    function play(){
      if(running){video.pause();return;}
      playing=true;
      root.classList.add("is-playing");
      if(!root.dataset.muted){video.volume=Number(root.dataset.volume||100)/100;}
      video.play();
    }
    video.addEventListener("canplay",ready);
    video.addEventListener("loadedmetadata",ready);
    video.addEventListener("playing",function(){running=true;root.classList.add("is-running");});
    video.addEventListener("pause",function(){running=false;root.classList.remove("is-running");});
    video.addEventListener("ended",function(){playing=false;root.classList.remove("is-playing","is-running");});
    trigger.addEventListener("click",function(e){e.preventDefault();e.stopPropagation();play();});
    if(video.readyState>=2) ready();
  }
  document.querySelectorAll("[data-live-photo]").forEach(bind);
})();
</script>`;
  return data;
});
