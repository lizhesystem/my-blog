---
title: Banner 位文章
date: 2026-03-28 23:57
cover: /img/vackground-com-hDQ-dUjQN8E-unsplash.jpg
coverInfo: 
  author: vackground.com
  url: https://unsplash.com/photos/a-blue-and-white-abstract-background-with-hexagonal-shapes-hDQ-dUjQN8E
series: 用户指南
tags: [快速开始, 配置]
appendRawMarkdown: true
tocType: flat
translations: ['en']
---

在站点首页顶部位置可以配置 1 大 3 小 共计 4 篇 Banner 位置的文章。

效果如下图：

![](/img/banner-posts.jpg)

在 `_config.linen.yml` 中加入如下格式的内容即可：

```yaml _config.linen.yml
topArticles:
  - _posts/quick-start.md
  - _posts/lorem.md
```

重新启动 Hexo 预览变更内容。

值得一提的是，这里的 topArticles 可以配置超过 4 条数据，但是只会渲染前 4 条**有效文章**。

有效文章指的是，如果我配置了一篇不存在的文章，那么该条记录将被过滤掉。

```yaml _config.linen.yml
topArticles:
  - _posts/fake-1.md
  - _posts/fake-2.md
  - _posts/quick-start.md
  - _posts/lorem.md
```

比如这个例子，fake-1 和 fake-2 其实并不存在，它不影响 quick-start 作为第一篇有效文章。