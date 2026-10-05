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

图片上传：
python r2_upload.py              # 正常上传（自动跳过已传过的）
python r2_upload.py --force      # 忽略记录，全部重传
python r2_upload.py --dry-run    # 只压缩不上传，测试用
python r2_upload.py --dir 其他目录

Markdown 默认的图片是一行一张。

![](/img/duy-le-duc-GUY2f9csQbc-unsplash.jpg)

Linen 主题用 `:::image-grid` 把多张图排进一行。容器里每个非空行都会被处理；只有渲染出 `<img>` 或 `<iframe>` 的行才会包成格子。请点击页面上的 **切换到原始 Markdown 内容** 按钮对照源码。

## 写法

类名只能有一个，匹配 `[\w-]+`，中间不能有空格。容器前后各空一行。

```
:::image-grid landscape
![说明](/img/a.jpg)
![说明](/img/b.jpg)
:::
```

模糊占位、禁止预览可以写在同一行，规则见文末：

```
![$placeholder=linear-gradient(...)=placeholder](/img/a.jpg)
![no-link](/img/a.jpg)
```

## 横排

`landscape`：2、3、4 张等分一行，占位比例统一 4:3。示例是 2 张。2~3张最好

:::image-grid landscape
![](https://img.jiaozhe.me/2026/09/DSC03925-20260917215203-uzn3jmf.webp)
:::

:::image-grid landscape
![](https://img.jiaozhe.me/2026/09/1790519160584.webp)
:::

## 竖排

`portrait`：2、3、4 张等分一行，占位比例统一 3:4。示例是 3 张。

:::image-grid portrait
![](/img/kamran-norollahi-KwP58z9zJeE-unsplash.jpg)
![](/img/julian-scholl-Wf6MhLHePSI-unsplash.jpg)
![](/img/david-boca-Xqmj-oQ_Nek-unsplash.jpg)
:::

不写类名时同样按张数等分，高度跟原图走，不强制 4:3 或 3:4。

| 张数 | 每张宽度 |
| --- | --- |
| 2 | 约 1/2 |
| 3 | 约 1/3 |
| 4 | 约 1/4 |

`landscape` / `portrait` 只改占位盒比例。图片是 `height: auto`，不是裁切填满格子。第 5 张及以后没有宽度规则，等分布局不要超过 4 张。

## 横竖混排

只认前两张。名称是左:右的大致份额，不是精确百分比。第三张及以后不参与这两种宽度。

| 类名 | 第 1 张 | 第 2 张 | 画面 |
| --- | --- | --- | --- |
| `r73` | 宽 3:2（约 67%） | 竖 2:3（约 150%） | 左横右竖 |
| `r37` | 竖 2:3 | 宽 3:2 | 左竖右横 |
| `r64` | 宽 4:3 | 竖 4:3 | 左横右竖，横图更大 |
| `r46` | 竖 4:3 | 宽 4:3 | 左竖右横 |
| `rLeftWide` | 宽 16:9 | 竖 16:9 | 左宽右窄 |
| `rRightWide` | 竖 16:9 | 宽 16:9 | 左窄右宽 |

左横右竖：

:::image-grid r73
![$placeholder=linear-gradient(135deg,rgba(196,168,130,1),rgba(120,140,150,1),rgba(70,90,100,1))=placeholder](/img/jasper-gribble-EOMFC1NyHgM-unsplash.jpg)
![$placeholder=linear-gradient(160deg,rgba(90,110,80,1),rgba(150,160,120,1),rgba(210,200,170,1))=placeholder](/img/squids-z-ShAHqWGOrRU-unsplash.jpg)
:::

左竖右横把类名换成 `r37`。`r64` / `r46` 是 4:3 的左右对调，`rLeftWide` / `rRightWide` 是 16:9。第三张及以后不参与这两种宽度。

## 横向滚动

`scroll` 和 `slider` 样式相同：横向滚动，每张 `min(86%, 760px)`，带 scroll-snap。窄屏每张 86% 宽。张数不限。

```
:::image-grid scroll
![](/img/a.jpg)
![](/img/b.jpg)
![](/img/c.jpg)
:::
```

## 切换

`switcher` 把多图叠在同一位置，底部按钮切换。`|` 前面是按钮文字；没有 `|` 时用图片 alt，再没有就用序号。

```
:::image-grid switcher
白天|![白天](/img/day.jpg)
夜晚|![夜晚](/img/night.jpg)
:::
```

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

![图 0](https://img.jiaozhe.me/2026/09/pic_1789267648677.webp)  

![image](https://img.jiaozhe.me/2026/09/1789483640919.webp)  


![image](https://img.jiaozhe.me/2026/09/1789485391022.webp)  

![image](https://img.jiaozhe.me/2026/09/1789485547760.webp)  
