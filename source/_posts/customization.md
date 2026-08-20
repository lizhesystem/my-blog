---
title: 个性化配置
date: 2026-03-28 23:58
excerpt: 配置您站点的个性化设置。
categories: 快速开始
cover: /img/vinicius-amnx-amano-17NCG_wOkMY-unsplash.jpg
coverInfo: 
  author: Markus Winkler
  url: https://unsplash.com/photos/a-close-up-of-a-street-sign-on-the-ground-newg0EE_rxw
series: 用户指南
tags: [快速开始, 配置]
appendRawMarkdown: true
tocType: flat
translations: ['en']
---

## 顶部 Logo

在站点根目录编辑（如果没有，则需要新建一个）`_config.linen.yml` 文件，然后在文件中加入如下格式的内容：

```yaml _config.linen.yml
logo:
  src: /img/linen-logo.svg
  width: 225
  height: 42
```

请将 src、width、height 替换为对应 logo 图片文件的路径和尺寸。

## 顶部导航菜单

在 `_config.linen.yml` 中加入如下格式的内容：

```yaml _config.linen.yml
navItems:
  - name: 归档
    path: /archives/
```

## 站点信息

在 `_config.linen.yml` 中加入如下格式的内容：

```yaml _config.linen.yml
info:
  site_desc: 一个简约的 Hexo 主题.
  avatar: https://xxx.xxx/xx.jpg
  siteCardBg: https://xxx.xxx/xx.jpg
  registration: 火星ICP备22222222
```

比如如果需要设置头像图片，添加/修改 `info` 里的 `avatar` 字段即可。可以在 https://unsplash.com/s/illustrations/avatar?license=free 上找到一些不错的头像图片。

`siteCardBg` 是分享网站时展示的封面图片。

## 懒加载配置

在 `_config.linen.yml` 中加入如下格式的内容：

```yaml _config.linen.yml
lazyload:
  enable: true
  loadingImage: ""
  errorTipImage: /linen-theme/img/lazyload/error-tip.svg
  intersectionRatio: 0.25
  placeholderRatio: 1.5
  showTransition: true
  showAltText: true
  preloadCount: 5
```

`loadingImage` 是全局转圈图。要模糊底色，用 [Image-Blurer](https://lynanbreeze.github.io/image-blurrer/) 生成 blurhash / `linear-gradient(...)` / base64，跟图片写在同一行：`![$placeholder=值=placeholder](/img/foo.jpg)`。多篇文章复用同一张图时写到 `assets-db/imgs/*.json`。写法见 [图片排版](/image-grid/)。改完执行 `hexo clean`。

以上参数为默认值，可根据实际需要进行修改。

## 追加 CSS、脚本到 heads

在 `_config.linen.yml` 中加入如下格式的内容：

```yaml _config.linen.yml
heads:
  - <script src="/path-to/your-js.js"></script>
  - <link rel="stylesheet" href="/path-to/your-css.css">
```

用途：统计代码、添加自定义 CSS。

## 中英域名

在 `_config.linen.yml` 中加入如下格式的内容：

```yaml _config.linen.yml
siteOriginLocaleMap:
  zh-CN: https://test.cn
  en: https://test.com
```