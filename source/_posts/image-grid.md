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
![](/img/jasper-gribble-EOMFC1NyHgM-unsplash.jpg)
![](/img/squids-z-ShAHqWGOrRU-unsplash.jpg)
:::

## Live Photo

左上角 **LIVE** 播放短视频；点击画面用主题自带的 [PhotoSwipe](https://photoswipe.com/) 大图预览，同一篇文章里的图片可左右滑动。Live Photo 只预览、不二次放大。

{% live_photo photoSrc:/img/live.jpg videoSrc:/img/live.mp4 %}

```
{% live_photo photoSrc:/img/live.jpg videoSrc:/img/live.mp4 %}
```

| 参数 | 说明 |
| --- | --- |
| photoSrc | 静帧图，必填 |
| videoSrc | 视频，必填 |
| loop | 循环播放，传 `1` |
| muted | 静音，传 `1` |
| volume | 音量 `0-100`，默认 `100` |

## PhotoSwipe 二次放大

大图预览后能否再放大（放大镜），看原图声明尺寸是否大于视口。主题写入 `data-pswp-width` / `data-pswp-height`，来源按优先级：

1. `assets-db/imgs` 里该图的 `width` / `height`（及 `originalUrl`）
2. 图片上的 `style="aspect-ratio: 4000/3000"`
3. alt：`![说明 $aspect-ratio=4000/3000=aspect-ratio](/img/foo.jpg)`
4. 都没有时默认 **1920×1280**，所以多数图能再放大

原图比屏幕小且写了真实尺寸时，没有放大镜。单张不进预览：`![no-link](/img/foo.jpg)`。Live Photo 已关闭二次放大。

## 自定义 lazyload loading

在 `_config.linen.yml` 里用绝对路径，文件放 `source/` 下：

```yaml
lazyload:
  enable: true
  loadingImage: /img/loading.svg
  errorTipImage: /img/error-tip.svg
```

默认相对路径 `../img/lazyload/loading.svg` 会解析到 `/img/lazyload/`，对不上主题目录。主题自带图用 `/linen-theme/img/lazyload/loading.svg`。改完执行 `hexo clean`。
