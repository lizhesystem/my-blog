---
title: 文章配置
excerpt: 一些自定义的 Front Matter 配置。
date: 2026-03-28 23:53
cover: /img/freestocks-VFs2fZEVkXo-unsplash.jpg
coverInfo: 
  author: freestocks
  url: https://unsplash.com/photos/top-view-of-opened-magazine-near-up-of-coffee-VFs2fZEVkXo
series: 用户指南
tags: [快速开始, 配置]
appendRawMarkdown: true
tocType: flat
customComments:
  - text: 比如这里：
    index: 0
    comment: 看到悬浮文案了吗
translations: ['en']
copyright: true
donates:
  - type: wechat
    qrcode: http://localhost:4000/hexo-theme-linen-doc-zh-CN/img/freestocks-VFs2fZEVkXo-unsplash.jpg
sponsors:
  - name: 我
    amount: QQㄋㄟㄋㄟ好喝到咩噗茶
    date: 2026-04-12 
---

## 封面信息

在封面右下角，可以添加作者或者是位置信息（2选1）。

格式如下：

- 作者信息
  ```yaml
  coverInfo: 
    author: freestocks
    url: https://unsplash.com/photos/top-view-of-opened-magazine-near-up-of-coffee-VFs2fZEVkXo
  ```
- 位置信息
  ```yaml
  coverInfo:
    location: 澳门·市政署大楼
    url: https://maps.apple.com/place?address=Avenida%20de%20Almeida%20Ribeiro%20No.%20163,%20Macao%20SAR,%20China&coordinate=22.193346,113.539592&name=%E5%B8%82%E6%94%BF%E7%BD%B2&place-id=IC211FBD448B1E6C&map=explore
  ```

## 悬浮文字

有的时候想要写一些说明文字，但是又不想总是在文字后面添加括号（比如这样），可以通过添加下面的配置为文字添加悬浮的说明文案。

比如这里：

```yaml
customComments:
  - text: 比如这里：
    index: 0
    comment: 看到悬浮文案了吗
```

## 隐藏文章

添加下面的配置可以将文章从首页/归档页中去除（不会阻止文章生成，仍可通过 URL 直接访问文章页面）。

```yaml
hide:
  recent: true
  archive: true
```

`recent: true` 配置后文章不会出现在首页中。
`archive: true` 配置后文章不会出现在归档中。

## PhotoSwipe 插件

插件来自 [https://photoswipe.com/](https://photoswipe.com/)，如果不需要可以使用如下方式关闭：

全局关闭：在 `_config.linen.yml` 中添加 `photoswipe: false`
页面级关闭：在 Front Matter 中添加 `photoswipe: false`

当文章内没有图片时，即使没有指定 `photoswipe: false` 也不会加载 PhotoSwipe 插件。

## 文章目录

在 Front Matter 中有 3 种目录配置：

- 隐藏：`toc: false`
- 展开：`toc: flat`
- 自动： <small>什么都不加</small>

## 图片懒加载

默认开启，如果不需要可以使用如下方式关闭：

全局关闭：在 `_config.linen.yml` 中添加

```_config.linen.yml
lazyload:
  enable: false
```

然后需要 `npm run clean` 清除已构建的文章，否则对已生成文章不会生效。

如果只想要针对某些图片取消懒加载，可以使用以下格式引用图片：

- `![no-lazy](https://abc.com/def.jpg)`

- `![This is a image $no-lazy](https://abc.com/def.jpg)`

- `<img no-lazy src="https://abc.com/def.jpg" alt="def">`

## 相关文章

当文章含有 >=2 个相同的标签时，则认为它们是相关的，会在页面底部展示跳转入口。

如果想要不展示这篇文章下面的相关文章入口，在文章的 Front Matter 中添加这个配置：

```yaml
showRelated: false
```

## 版权信息

当你想要在文章内容底部加一个版权信息提示，在文章的 Front Matter 中添加这个配置：

```yaml
copyright: true
```

## 赞赏二维码

```
donates:
  - type: wechat
    qrcode: https://r2-assets.thelynan.com/u/wx_qr-YaRvee.jpg
```

## 赞赏列表

在文章的 Front Matter 中添加这个配置：

```yaml
sponsors:
  - name: 我
    amount: QQㄋㄟㄋㄟ好喝到咩噗茶
    date: 2026-04-12 
```