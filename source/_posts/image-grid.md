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

左上角 **LIVE** 播放短视频；点击画面用主题自带的 [PhotoSwipe](https://photoswipe.com/) 大图预览，同一篇文章里的图片可左右滑动。

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
