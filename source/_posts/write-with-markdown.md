---
title: Markdown 语法
date: 2026-03-28 22:00
excerpt: 一些 Markdown 语法示例。
appendRawMarkdown: true
cover: /img/markus-spiske-mygLDe2KvSg-unsplash.jpg
coverInfo:
  author: Markus Spiske
  url: https://unsplash.com/photos/a-white-wall-with-a-clock-on-it-mygLDe2KvSg
toc: true
translations: ['en']
---

感谢 [The Markdown Guide](https://www.markdownguide.org)！

这份 Markdown 速查表提供了所有 Markdown 语法元素的快速概览。由于无法涵盖所有​​的边缘情况，如果您需要关于其中任何元素的更多信息，请查阅 [基本语法](https://www.markdownguide.org/basic-syntax/) 和 [扩展语法](https://www.markdownguide.org/extended-syntax/) 的参考指南。

## 基本语法

以下是 John Gruber 在其原始设计文档中概述的元素。所有的 Markdown 应用程序都支持这些元素。

### 标题

# H1

## H2

### H3

## 粗体

**粗体文本**

## 斜体

_斜体文本_

## 块引用

> 块引用

## 有序列表

1. 第一项
2. 第二项
3. 第三项

## 无序列表

- 第一项
- 第二项
- 第三项

## 水平线

---

## 删除线

~~世界是平的。~~

## 链接

[Markdown 指南](https://www.markdownguide.org)

## 脚注

脚注允许您添加注释和参考文献，而不会使文档正文显得杂乱。当您创建脚注时，在您插入脚注引用的位置会出现一个带有链接的上标数字。读者可以点击该链接，跳转至页面底部的脚注内容。

要创建脚注引用，请在方括号内添加一个脱字符（^）和一个标识符（例如：[^1]）。标识符可以是数字或文字，但不能包含空格或制表符。标识符仅用于将脚注引用与脚注本身进行关联——在最终输出中，脚注将按顺序自动编号。

若要添加脚注内容，请使用另一个脱字符和方括号内的标识符，后接冒号及正文（例如：[^1]: 我的脚注。）。您无需将脚注统一放置在文档末尾；除了列表、块引用和表格等其他元素内部之外，您可以将脚注放置在文档的任何位置。

这是一个简单的脚注[^1]。

## 图片

![马德拉岛壮丽的北岸](https://images.unsplash.com/photo-1619898331052-ac35cf01ec84?q=80&w=4686&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)

## 表格

| 语法 | 描述 |
| ---- | ---- |
| 标题 | 标题 |
| 段落 | 正文 |

## 代码

`const a = 1;`

## 代码块

```json
{
  "firstName": "John",
  "lastName": "Smith",
  "age": 25
}
```

## 任务列表

- [x] 撰写新闻稿

- [ ] 更新网站

- [ ] 联系媒体

[^1]: 这是第一个脚注