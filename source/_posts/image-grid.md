---
title: 图片排版
excerpt: 简单的排版更易阅读。
date: 2026-03-28 23:55
cover: /img/ivan-shimko-PhciG8fpRKw-unsplash.jpg
coverInfo: 
  author: Ivan Shimko
  url: https://unsplash.com/photos/three-beach-illustrations-PhciG8fpRKw
series: 用户指南
tags: [快速开始, 配置]
appendRawMarkdown: true
tocType: flat
translations: ['en']
---

Markdown 默认的图片是一行一张。

![](/img/duy-le-duc-GUY2f9csQbc-unsplash.jpg)

Linen 主题新增了图片容器，支持以下几种布局的图片排版。请点击页面上的 **切换到原始 Markdown 内容** 按钮参考页面源码来使用图片排版。

## 横排

:::image-grid landscape
![](/img/klara-kulikova-PgrSvkU1_4Y-unsplash.jpg)
![](/img/mariola-grobelska-rxFb6meV3ck-unsplash.jpg)
:::

## 竖排

:::image-grid portrait
![](/img/kamran-norollahi-KwP58z9zJeE-unsplash.jpg)
![](/img/julian-scholl-Wf6MhLHePSI-unsplash.jpg)
![](/img/david-boca-Xqmj-oQ_Nek-unsplash.jpg)
:::

## 横竖混排

支持 r73、r37、r64、r46 共 4 种混排比例布局。

:::image-grid r73
![$placeholder=linear-gradient(135deg,rgba(196,168,130,1),rgba(120,140,150,1),rgba(70,90,100,1))=placeholder](/img/jasper-gribble-EOMFC1NyHgM-unsplash.jpg)
![$placeholder=linear-gradient(160deg,rgba(90,110,80,1),rgba(150,160,120,1),rgba(210,200,170,1))=placeholder](/img/squids-z-ShAHqWGOrRU-unsplash.jpg)
:::

## Live Photo

主题已内置：iframe 路径必须含 `/static/live-photo/`，并开启 `photoswipe: true` + `lazyload.enable: true`。点击画面会大图预览，预览里点左上角 LIVE 播放短视频。

{% live_photo photoSrc:/img/live.jpg videoSrc:/img/live.mp4 %}

官方写法：

```html
<iframe src="/static/live-photo/?picUrl=/img/live.jpg&videoUrl=/img/live.mp4" scrolling="no" frameborder="0" allowfullscreen="true" style="width: 100%; aspect-ratio: 1920/1080;"></iframe>
```

`{% live_photo %}` 只是把上面这段 iframe 写短一点。播放器文件在 `source/static/live-photo/index.html`，主题本身不带这个页面。

| 参数 | 说明 |
| --- | --- |
| photoSrc / picUrl | 静帧图，必填 |
| videoSrc / videoUrl | 视频，必填 |
| loop | 循环播放，传 `1` |
| muted | 静音，传 `1` |
| volume | 音量 `0-100`，默认 `100` |

## PhotoSwipe 二次放大

点击图片会进主题自带的 PhotoSwipe。普通照片在声明尺寸大于视口时还能再放大（放大镜）。尺寸来源：`assets-db/imgs` 的 width/height、`aspect-ratio`，或默认 1920×1280。单张不预览：`![no-link](/img/foo.jpg)`。

Live Photo 在预览里用 HTML 播放器（静帧 + LIVE），不是再捏一张普通大图。

## 模糊占位（Image-Blurer）

全局 `loadingImage` 是转圈图。模糊色块要按**每张图**给 placeholder。打开 [Image-Blurer](https://lynanbreeze.github.io/image-blurrer/)，上传图片后任选一种输出：

| 输出 | 原样粘贴的值 |
| --- | --- |
| Blurhash | `blurhash:Lb0V#qelf,flg+e-f6flg4g4f5fl` |
| CSS Gradient | `linear-gradient(rgba(241,235,227,1.0),rgba(233,227,213,1.0),rgba(241,237,226,1.0),rgba(240,236,224,1.0),rgba(246,238,226,1.0),rgba(234,231,218,1.0))` |
| StackBlur / Gaussian | `data:image/jpeg;base64,...` |

`$placeholder=` 中间不能有空格。

### 写到哪

日常改文章：跟图片写在同一行。换图就改这一行。

```
![$placeholder=linear-gradient(rgba(241,235,227,1.0),rgba(233,227,213,1.0),rgba(241,237,226,1.0),rgba(240,236,224,1.0),rgba(246,238,226,1.0),rgba(234,231,218,1.0))=placeholder](/img/foo.jpg)
```

```
![$placeholder=blurhash:Lb0V#qelf,flg+e-f6flg4g4f5fl=placeholder](/img/foo.jpg)
```

HTML 等价写法：

```html
<img src="/img/foo.jpg" data-placeholderimg="linear-gradient(rgba(241,235,227,1.0),rgba(233,227,213,1.0),rgba(241,237,226,1.0),rgba(240,236,224,1.0),rgba(246,238,226,1.0),rgba(234,231,218,1.0))">
```

同一张图多篇文章复用、或 base64 太长：Markdown 只写 `![](/img/foo.jpg)`，把值放到 `assets-db/imgs/*.json`：

```json
[{ "url": "/img/foo.jpg", "placeholder": "linear-gradient(rgba(241,235,227,1.0),rgba(233,227,213,1.0),rgba(241,237,226,1.0),rgba(240,236,224,1.0),rgba(246,238,226,1.0),rgba(234,231,218,1.0))" }]
```

封面用 front-matter `coverPlaceholder`，或同样写进 `assets-db`（按 `cover` 的 url 匹配）。

同一 url 两边都写时，`assets-db` 覆盖文章里的值。本站本地图已写在 `assets-db/imgs/local.json`，文章里不用再贴。改完执行 `hexo clean`。
