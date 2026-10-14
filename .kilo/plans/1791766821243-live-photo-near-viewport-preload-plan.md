# Live Photo 近视口预加载计划

## 目标

在不改变当前 Live Photo 的 iframe 架构、视觉效果和 PhotoSwipe 行为的前提下：

- 将视频从“首次点击 LIVE 才开始请求”改为“iframe 接近视口并完成懒加载后开始有限预加载”。
- 继续避免打开文章时下载整篇文章的全部视频。
- 保留桌面端悬停预热作为幂等兜底。
- 修正异步 `video.play()` 失败、媒体加载错误和加载状态残留问题。
- 本次不转码、不替换文章中的 `.MOV` 地址，不引入 HLS、WebM 或新的播放器依赖。

## 已确认的现状

- `scripts/live-photo.js:55` 已输出 `loading="lazy"` 的 iframe。
- `source/static/live-photo/index.html:137` 立即加载封面，但视频直到 `pointerenter` 或 LIVE 点击时才设置 `src`。
- 触屏设备没有 `pointerenter` 预热，因此第一次点击同时承担视频请求、媒体解析、解码和播放启动。
- 当前 `ensureVideo()` 在 `video.load()` 后才注册 `canplay`/`error` 监听器，存在不必要的竞态窗口。
- `video.play()` 的 Promise 未处理，异步 `canplay` 回调中的播放在部分浏览器可能被拒绝。
- 当前 iframe 懒加载已经是自然的“有限预加载”边界；不实现跨 iframe 的全局并发队列。

## 实施步骤

### 1. 调整视频准备时机

修改 `source/static/live-photo/index.html` 的内联脚本：

- 保留 `videoLoaded` 防重复初始化状态。
- 将 `canplay` 和 `error` 监听器在设置 `src`、调用 `load()` 之前绑定。
- `ensureVideo()` 首次调用时设置 `preload = "auto"`、设置 `src`、调用 `load()`。
- 在 iframe 文档初始化且封面容器可用后调用一次 `ensureVideo()`，使已经被浏览器按照 `loading="lazy"` 创建的 iframe 开始准备视频。
- 保留桌面端 `pointerenter` 调用 `ensureVideo()`，使其在初始化策略变化或浏览器延迟媒体加载时仍然安全；重复调用必须无副作用。
- 保留 LIVE 点击时的播放请求逻辑：已达到 `HAVE_FUTURE_DATA` 时立即尝试播放，否则显示加载状态并等待 `canplay`。

这里的“有限”由外层 iframe 的原生 `loading="lazy"` 控制：视口外的 Live Photo iframe 不创建、不执行内部脚本，也不会请求视频；浏览器通常只提前建立接近当前视口的少量 iframe。无需自行添加 `IntersectionObserver` 或跨 iframe 调度器。

### 2. 统一播放状态和失败处理

在同一内联脚本中增加小型状态清理和播放封装，避免分散的裸 `video.play()` 调用：

- 将播放请求统一封装为调用 `video.play()` 并处理 Promise rejection。
- 成功路径保持当前体验：在有数据可播后加 `is-playing`，视频淡入，`playing` 事件继续控制 LIVE 图标动画。
- 失败路径清除 `playing`、`is-loading`、`is-playing`、`is-running`，恢复封面显示，不留下旋转中的 LIVE 按钮。
- 对媒体 `error` 事件执行相同清理，并将 `videoLoaded` 置回 `false`，允许后续点击重试。
- 对 `canplay` 回调中的自动播放失败执行清理；不要让未处理的 Promise rejection 出现在控制台。
- 不改变默认音量、`muted` 参数、`loop` 参数和现有暂停/继续交互。

### 3. 保持交互边界不变

- 不修改 `scripts/live-photo.js` 的 tag 参数格式和 iframe URL 结构。
- 不修改 iframe 的宽高比、封面层、视频淡入、LIVE 按钮位置和移动端缩放样式。
- 不修改非 LIVE 区域向父窗口发送封面 URL 的 `postMessage` 行为。
- 不修改 `scripts/pswp-live-photo.js` 或 PhotoSwipe 集成。
- 不修改 `source/_posts/datong.md`。

## 失败和边界场景

- **文章打开但未滚动到视频处**：外层 iframe 仍由 `loading="lazy"` 延迟，视频不请求。
- **滚动到视频附近**：iframe 被创建，封面先显示，视频开始后台预加载；用户点击时若尚未可播，按钮显示加载状态。
- **触屏首次点击**：通常已经有近视口预加载；若仍未完成，保持封面并等待 `canplay`，不显示黑色视频帧。
- **桌面鼠标提前进入**：重复调用 `ensureVideo()` 不产生重复请求。
- **网络或编码错误**：恢复封面，清理加载状态，允许再次点击重试。
- **用户在播放中点击 LIVE**：维持现有暂停行为；再次点击继续播放。
- **视频自然结束**：维持现有结束后恢复封面的行为。
- **浏览器拒绝异步播放**：清理状态并保留封面，不产生未处理 Promise rejection。

## 验证计划

### 构建验证

1. 运行 `hexo clean`。
2. 运行 `hexo generate`。
3. 检查生成的文章 HTML 中 iframe 仍包含 `loading="lazy"`，参数和 `aspect-ratio` 未改变。

### 浏览器验证

在桌面和移动设备模拟下打开 `/datong/`，使用 DevTools Network 过滤 `img.jiaozhe.me`：

- 初始打开页面且不滚动：不应请求远处 Live Photo 视频。
- 滚动到某个 Live Photo 接近视口：应出现该 iframe 对应的视频请求，封面仍先显示。
- 视频已预热后点击 LIVE：应比当前“点击后才请求”明显更快播放。
- 视频尚未预热完成时点击 LIVE：按钮显示加载动画，视频准备好后淡入，不出现黑帧。
- 播放中点击 LIVE：暂停；再次点击：恢复。
- 模拟视频请求失败或使用无效 URL：封面恢复，按钮停止加载，后续可以重试。
- 点击非 LIVE 区域：PhotoSwipe 大图行为不变。
- 检查控制台：不应出现未处理的 `play()` Promise rejection。

### 回归范围

- 至少验证 `datong.md` 中首个、正文中部和末尾的 Live Photo。
- 验证桌面 hover 和移动端无 hover 两条路径。
- 若项目已有 image-grid Live Photo 演示页，再验证该页的 MP4 示例不受影响。

## 风险与后续

- `loading="lazy"` 的具体预取距离由浏览器决定，不保证所有设备都会在用户点击前完成视频缓冲；播放器仍需保留加载状态。
- `preload="auto"` 是浏览器提示，不是强制下载指令；服务器 Range 支持和视频编码仍会影响起播速度。
- 本次不处理 MOV 转 MP4。后续资源迁移时，优先使用 H.264/AAC、faststart 的网页 MP4，并只替换 tag 的 `videoSrc`，无需再次改播放器架构。
