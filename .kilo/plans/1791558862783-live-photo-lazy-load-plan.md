# Live Photo 视频懒加载优化方案

## 问题

`{% live_photo %}` 当前加载方式影响页面打开速度，两个叠加原因：

1. `scripts/live-photo.js:55` 生成的 iframe 无 `loading="lazy"`，页面打开时所有 iframe（datong.md 有 6 个）立即加载，不管是否在视口内。
2. `source/static/live-photo/index.html:131` 在 iframe 加载时立即执行 `video.src = videoSrc`，浏览器立刻开始下载视频（iPhone `.MOV` 原片通常几十 MB），即使用户从不点击 LIVE。这些下载与正文图片、首屏渲染抢带宽。

## 已确认的决策（用户选定）

- 策略：**点击加载 + 悬停预热** —— 图片先显示；点击 LIVE 才加载并播放视频（缓冲期间按钮显示加载动画）；桌面端鼠标悬停时提前缓冲，让点击基本秒开。触屏设备无悬停，纯点击加载（可接受）。
- iframe 加 `loading="lazy"`，视口外不加载。
- 保持现有 iframe 架构不变，不重构为内联 DOM；postMessage → PhotoSwipe 灯箱链路不变。

## 改动

### 1. `scripts/live-photo.js`（1 行）

第 55 行的 iframe 标签加属性：`loading="lazy"`。旧浏览器不支持时自动退化为立即加载，无风险。

### 2. `source/static/live-photo/index.html`

**JS（`<script>` 块）：**

- 删除第 131 行的 `video.src = videoSrc`，图片仍立即加载（第 130 行不变）。
- 新增状态标志 `videoLoaded = false`。
- 抽取"装载视频"函数 `ensureVideo()`：首次调用时设 `video.src = videoSrc`、`video.preload = "auto"`、`video.load()`，置 `videoLoaded = true`；重复调用无副作用。
- 悬停预热：`wrap.addEventListener("pointerenter", ...)`，当 `matchMedia("(hover: hover)").matches` 且未播放时调用 `ensureVideo()`（只缓冲不播放）。
- 触发按钮 click 逻辑调整：
  - 若 `running` → `video.pause()`，return（与现在一致）。
  - 否则调用 `ensureVideo()`：
    - 若视频尚未可播（首次点击）：给 wrap 加 `is-loading` 类（按钮显示加载动画），监听一次 `canplay` → 移除 `is-loading`、加 `is-playing`、设置音量、`video.play()`。
    - 若已缓冲：与现在一致，加 `is-playing`、设置音量、`video.play()`。
- 视频加载失败兜底：`video.addEventListener("error", ...)` 移除 `is-loading`，保持图片显示，不阻塞交互。
- 现有事件（`playing`/`pause`/`ended` → `is-running`、`is-playing` 切换）保持不变。

**CSS：**

- 新增 `.live-photo.is-loading .trigger-icon` 旋转动画（复用现有 `@keyframes live`，`animation-play-state: running`），可在视觉上隐藏 `trigger-text` 或降低其透明度。
- 关键修正：视频在真正可播前不可见。现逻辑是点击瞬间加 `is-playing` 使 video 层变不透明，会闪黑帧；改为 `is-playing` 只在 `canplay` 后添加，缓冲期间停留在图片层并显示按钮加载动画。

## 不改动的部分（明确出范围）

- 灯箱集成 `scripts/pswp-live-photo.js`、iframe 内 postMessage 逻辑。
- 固定 `aspect-ratio: 1920/1080` 容器（现有行为，与加载速度无关）。
- 视频文件本身的转码（`.MOV` → faststart MP4/H.264）：属内容侧优化，若今后发现点击后起播慢，可再考虑；R2 自定义域名支持 Range 请求，渐进式拉流可用。

## 验证

1. `hexo clean && hexo generate`，检查 `public/` 下 datong 文章渲染出的 iframe 含 `loading="lazy"`。
2. `hexo server` 打开 datong 文章，DevTools Network 面板过滤 `img.jiaozhe.me`：
   - 页面打开时：只有图片请求，无任何视频（`.mov`/`.mp4`）请求。
   - 桌面端鼠标悬停到 live photo：出现视频请求（预热），点击 LIVE 后立即或短暂缓冲后播放。
   - 播放中再点一次按钮暂停、再点恢复，行为与现在一致。
   - 首次点击（无预热，如触屏模拟）：按钮出现加载动画，缓冲完成后视频淡入，无黑帧闪烁。
   - 点击图片区域（非 LIVE 按钮）打开灯箱大图，行为与现在一致。
3. DevTools 设备模拟（触屏、无 hover）：点击直接触发加载并播放。
4. 回归检查 image-grid.md 中演示页（`/img/live.jpg`、`/img/live.mp4`）行为一致。

## 风险

- 旧浏览器忽略 iframe `loading="lazy"` → 退化为现状（仍受益于视频按需加载）。
- 弱网 + 触屏：首次点击缓冲时间可能较长（原片几十 MB），图片+加载动画兜底体验。
