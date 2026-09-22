# lumi 的成长实验室

个人技术博客，发布在 `https://lumi123456.github.io/`。

## 添加文章

1. 在 `content/articles/` 新建一个 Markdown 文件，例如 `python-list.md`。
2. 在 `content/posts.json` 添加文章信息，并让 `file` 指向该 Markdown 文件。
3. 提交到 GitHub，页面会自动更新。

文章信息示例：

```json
{
  "slug": "python-list",
  "title": "Python 列表基础",
  "date": "2026-09-22",
  "category": "Python 基础",
  "tags": ["Python", "列表"],
  "summary": "学习列表的创建、索引和常用操作。",
  "file": "content/articles/python-list.md",
  "readingTime": "6 分钟"
}
```

可用分类：`Python 基础`、`Python 进阶`、`提示词技术`、`Agent 开发`。
