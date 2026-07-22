---
title: mentions实战指南：给AI精准投喂上下文的4种姿势
slug: claude-code-mentions-guide
date: 2024-06-01
tags: [Claude Code, mentions, 上下文]
---

# Claude Code @mentions 实战指南：给 AI 精准投喂上下文的 4 种姿势

你有没有遇到过这种情况：让 Claude Code 帮你改代码，它改出来的东西和项目风格完全对不上——用了 `axios` 而你们项目统一用 `fetch`，写了 class 组件而你们全用函数式，import 路径都不对……

问题往往不是 Claude 能力不够，而是**它没看到足够的上下文**。

复制粘贴代码片段给 AI 是最常见的做法，但片段是残缺的——你贴了函数实现，漏了类型定义；贴了组件代码，漏了 `'use client'` 声明。AI 拿到残缺的上下文，给出的建议自然残缺。

**@mentions 就是 Claude Code 解决这个问题的方案**——用 `@` 精准告诉 Claude "看这里"，它拿到的是完整文件，不是你手动裁剪的片段。

## 一、@mentions 是什么

在 Claude Code 交互模式中，输入 `@` 然后开始打文件名，会弹出匹配列表供你选择。选中的文件/目录会作为上下文注入到当前对话中。

**支持的四种引用方式：**

| 方式   | 语法                | Claude 拿到什么                                  |
| ------ | ------------------- | ------------------------------------------------ |
| 单文件 | `@src/app/page.tsx` | 文件完整内容                                     |
| 多文件 | `@a.tsx @b.tsx`     | 每个文件的完整内容                               |
| 目录   | `@src/components/`  | 目录下文件列表（注意：是列表，不是所有文件内容） |
| 图片   | 拖拽/粘贴           | 图片的视觉理解                                   |

还有一个隐藏能力：**@ 文件引用会自动加载该文件所在目录及父目录的 `CLAUDE.md`**。所以你 `@src/components/Header.tsx`，Claude 不仅看到 Header 组件，还会读到 `src/components/CLAUDE.md` 和根目录 `CLAUDE.md` 里的规则。

## 二、为什么 @mentions 比复制粘贴好

用一个真实场景说明：

假设你让 Claude 审查 `ArticleCard.tsx` 组件的 Props 设计。

**复制粘贴的方式：**

```
// 你贴过来的代码
interface ArticleCardProps {
  title: string;
  author: string;
  // ...
}
```

Claude 只看到这一段。它不知道：

- `Article` 类型在项目里已经有完整定义

- 项目用了 MobX 的 `observable` 模式

- 组件需要 `'use client'` 声明

**@mentions 的方式：**

```
审查 @src/components/ArticleCard.tsx，参考 @src/types/article.ts 的类型定义
```

Claude 看到完整文件——所有 import、类型引用、组件实现、样式导入。它发现 `ArticleCardProps` 可以直接复用 `article.ts` 里已有的 `Article` 类型，而不需要手动再定义一遍。

**核心差异：完整上下文 = 更精准的分析。**

## 三、实战技巧

### 技巧 1：审查时组件 + 类型定义一起 @

```
审查 @src/components/ArticleCard.tsx，同时参考 @src/types/article.ts 中的类型定义，
看看组件的 Props 设计是否合理
```

Claude 既看到组件实现，又看到类型定义，能判断：

- Props 是否和已有的 `Article` 类型重复定义

- 是否有字段遗漏或类型不匹配

- 能否直接用 `Pick<Article, 'title' | 'author'>` 简化

### 技巧 2：跨文件问题定位

Next.js 的 hydration 报错经常跨多个文件，单独看一个文件找不到根因：

```
@src/app/page.tsx 首页有 hydration 报错，请结合 @src/app/layout.tsx
和 @src/components/Header.tsx 分析，可能是哪个组件的服务端/客户端划分不对
```

Claude 能看到：

- `layout.tsx` 里是否有不正确的客户端逻辑

- `page.tsx` 和 `Header.tsx` 的 `'use client'` 声明是否正确

- 跨组件的状态是否在服务端/客户端之间不一致

### 技巧 3：用目录引用做全局分析

```
分析 @src/app/api/ 目录下所有 API 路由，检查是否有统一的错误处理、
是否有缺失的参数校验
```

一次 @ 一个目录，Claude 自动遍历所有文件，帮你做"全面体检"。适合：

- 检查 API 路由的错误处理一致性

- 审查组件目录的命名规范

- 排查工具函数的重复实现

### 技巧 4：图片引用做 UI 还原

拿到设计稿，直接拖拽到 Claude Code：

```
[拖拽设计稿图片]
根据这张设计稿，帮我实现文章详情页，使用 Tailwind CSS，像素级还原
```

Claude 看到设计稿的视觉信息，结合你 @ 进来的项目组件，能生成和项目风格一致的代码。

### 技巧 5：行范围精准引用（VS Code 专属）

在 VS Code 中选中代码后，按 `Option+K`（Mac）/ `Alt+K`（Windows/Linux），Claude Code 自动插入带行号的 @mention：

```
@app.tsx#5-10
```

这样 Claude 只关注你选中的那几行，不会被文件其他部分干扰。适合：

- 定位某个函数的问题

- 审查特定的代码片段

- 只需要局部上下文的修改

### 技巧 6：MCP 资源引用

如果你配置了 MCP 服务，可以用 `@server:resource` 格式直接引用外部资源：

```
查看 @github:repos/owner/repo/issues 中的 open issues
```

这在 MCP 实战中配合使用，可以把 GitHub Issues、数据库查询结果等直接注入上下文。

## 四、避坑指南

### 坑 1：目录引用 ≠ 目录下所有文件内容

`@src/components/` 给 Claude 的是**文件列表**，不是所有文件的完整内容。如果你需要 Claude 分析具体文件内容，要逐个 `@` 文件，或者告诉 Claude "请读取该目录下所有文件"。

### 坑 2：不要 @ 整个 node_modules 或大目录

@mentions 没有大小限制提示，但上下文窗口是有限的。@ 一个包含几百个文件的目录，不仅浪费 token，还可能把关键信息淹没。

**建议：** 大目录先 @ 获取文件列表，再精准 @ 具体文件。

### 坑 3：CLI 单行模式和交互模式的区别

`@` 语法只在交互模式（输入 `claude` 进入 REPL）和 VS Code 扩展中有效。CLI 单行模式不支持：

```
# ❌ 这不会工作
claude "@src/app.tsx 为什么报错"

# ✅ 正确方式：直接写路径
claude "src/app.tsx 为什么报错"
```

单行模式下，直接写文件路径，Claude 会自己去读。

### 坑 4：模糊匹配可能匹配错文件

@mentions 支持模糊匹配——输入 `@auth` 可能匹配到 `auth.js`、`AuthService.ts`、`_auth.scss` 等。选择时注意看弹出的匹配列表，确认选对了文件。

## 五、@mentions vs 其他上下文方式

Claude Code 有多种方式给 AI 提供上下文，@mentions 只是其中之一：

| 方式        | 适合场景                   | 主动性   |
| ----------- | -------------------------- | -------- |
| `CLAUDE.md` | 每次会话都需要的项目规则   | 自动加载 |
| `rules/`    | 按文件路径按需加载的规则   | 条件触发 |
| `@mentions` | 当前对话需要参考的特定文件 | 手动指定 |
| 子代理      | 大范围探索，不占主上下文   | 手动派发 |
| MCP 资源    | 外部系统数据               | 手动指定 |

**它们不是互斥的，而是互补的：**

- `CLAUDE.md` 解决"AI 需要始终知道什么"

- `rules/` 解决"AI 在处理特定文件时需要知道什么"

- `@mentions` 解决"AI 在这次对话中需要额外看什么"

日常开发中，我习惯的做法是：`CLAUDE.md` 写好基础规则，具体任务用 `@mentions` 精准投喂，大范围探索交给子代理。

## 六、速查表

| 操作          | 语法                              | 说明                               |
| ------------- | --------------------------------- | ---------------------------------- |
| 引用文件      | `@src/app/page.tsx`               | 文件完整内容注入上下文             |
| 引用多个文件  | `@a.tsx @b.tsx`                   | 多文件同时注入                     |
| 引用目录      | `@src/components/`                | 注入目录文件列表                   |
| 引用行范围    | `@app.tsx#5-10`                   | 只注入选中行（VS Code 快捷键插入） |
| 引用图片      | 拖拽/粘贴                         | 图片视觉理解                       |
| 引用 MCP 资源 | `@github:repos/owner/repo/issues` | 外部服务数据                       |
| 模糊匹配      | `@auth`                           | 自动匹配文件名包含 auth 的文件     |
