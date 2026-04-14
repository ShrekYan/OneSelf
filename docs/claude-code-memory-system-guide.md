# Claude Code 记忆系统使用指南

> 全面理解自动记忆（Auto Memory）vs 项目记忆（Project Memory），学会正确添加记忆，让 Claude 越用越聪明。

---

## 目录

- [核心概念区别](#核心概念区别)
- [适用场景对比](#适用场景对比)
- [存储位置对照表](#存储位置对照表)
- [如何添加自动记忆](#如何添加自动记忆)
  - [自然语言提示模板](#自然语言提示模板)
  - [标准格式](#标准格式)
  - [完整案例](#完整案例)
- [如何添加项目记忆](#如何添加项目记忆)
- [验证方法](#验证方法)
- [常见问题](#常见问题)

---

## 核心概念区别

| 对比维度 | 自动记忆（Auto Memory） | 项目记忆（Project Memory） |
|---------|------------------------|---------------------------|
| **维护者** | Claude Code **自动维护** | 你（开发者）**手动维护** |
| **存储位置** | 用户目录 `~/.claude/projects/<项目路径>/` | 你的**项目代码目录** `.claude/` |
| **加载时机** | ✅ **每次对话自动加载** | ❌ **不会自动加载** - 需要时手动用 `Read` 工具读取 |
| **Git 版本控制** | ❌ 不存在你的项目仓库中 | ✅ 随项目一起提交 |
| **团队共享** | ❌ 只存在你本地，只有你能用 | ✅ 所有团队成员都能看到 |
| **主要用途** | 让 Claude 记住项目坑和规范，写代码自动避开 | 存放项目文档、开发指南、团队规范 |

---

## 适用场景对比

### ✅ 自动记忆适用场景

| 场景 | 说明 |
|------|------|
| 踩过一个坑，解决了，**不想再踩第二次** | Claude 下次写代码会自动避开 |
| 当前项目**特有的编码规范** | Claude 写出来的代码自动符合项目风格 |
| 环境配置问题，**折腾半天才调好** | 下次配置不会再错 |
| 依赖版本兼容问题，**某个版本有坑** | Claude 会提醒你用正确版本 |
| 项目特定的 API 调用方式 | Claude 自动按照项目习惯写法 |

一句话总结：**凡是想让 Claude 每次写代码都记住的，都放自动记忆**。

### ✅ 项目记忆适用场景

| 场景 | 说明 |
|------|------|
| 项目整体架构文档 | 新人上手阅读 |
| 团队共同遵守的开发规范 | 所有人都能看能改 |
| 踩坑经验总结，需要团队共享 | 大家一起避坑 |
| 部署文档、环境配置文档 | 项目相关文档统一存放 |

一句话总结：**凡是要团队共享、需要 Git 版本控制的文档，都放项目记忆**。

---

## 存储位置对照表

### 当前项目示例

| 记忆类型 | 完整路径 |
|---------|---------|
| 自动记忆 | `~/.claude/projects/-Users-yanjinqiang-WebstormProjects-claude/memory/MEMORY.md` |
| 项目记忆 | `/Users/yanjinqiang/WebstormProjects/claude/.claude/project-memory.md` |

### 一秒区分方法

```
~/.claude/projects/... → 自动记忆（系统维护）
你的项目目录/.claude/... → 项目记忆（项目内文档）
```

---

## 如何添加自动记忆

### 自然语言提示模板

你只需要用自然语言告诉 Claude，它会自动整理成标准格式存入记忆。

#### 模板 1：记录踩过的坑

```
我刚才遇到一个问题：[一句话描述问题现象]，原因是[简单说原因]，正确的解决方法是[简单说解决方法]。帮我记录到自动记忆的经验教训中。
```

**示例：**
```
我刚才遇到一个问题：MobX 的 useLocalObservable 里面用箭头函数写方法，this 指向不对改不了状态。原因是箭头函数词法捕获了外层 this，正确要用普通方法语法。帮我记录到自动记忆。
```

#### 模板 2：记录项目规范

```
这个项目有个规范：[描述清楚规范内容]。帮我保存到自动记忆的开发规范要点里。
```

**示例：**
```
这个项目页面级 useStore.ts 禁止用 class 写法，必须用 useLocalObservable + 对象字面量 Hook 写法。帮我保存到开发规范要点。
```

#### 模板 3：更新常用命令

```
这个项目 [启动/开发/构建/部署] 的命令是 [xxx]。帮我更新到自动记忆的常用命令速查里。
```

**示例：**
```
后端开发启动命令是 cd backend && npm run start:dev，帮我更新到常用命令里。
```

---

### 标准格式

Claude 会按照以下标准格式整理：

```markdown
### 问题标题（一句话概括）

**问题**: 描述错误现象，遇到了什么问题

**错误写法**: (可选) 展示错误代码

**原因**: 分析为什么会出错

**正确写法**: 展示正确的代码实现

**经验**: 一句话总结教训，下次怎么避免

---
```

---

### 完整案例

原始用户输入：
> "我刚才遇到一个问题：NestJS Prisma schema 模型名用小写，this.prisma.xxx 访问时报 TypeScript 类型错误。帮我记录下来。"

Claude 整理后存入自动记忆：

````markdown
### NestJS + Prisma 模型命名问题

**问题**: Prisma schema 中模型名为小写（如 `model articles`），访问 `this.prisma.articles` 时 TypeScript 类型报错，说属性不存在。

**原因**:
- Prisma 根据模型名生成查询属性，模型名 `articles` (全小写) → 属性名 `prisma.articles`
- 但是 `PrismaService extends PrismaClient` 时，全小写的属性在 TypeScript 编译类型中无法正确识别
- 对比模型名 `Categories` (大驼峰) → 属性名 `prisma.categories` 就能正常识别

**正确写法**:
```typescript
// 1. 导入模型类型（能正确生成）
import type { articles } from '@prisma/client';

// 2. 访问属性时用 any 绕过编译类型检查
// 运行时这个属性确实存在，只是 TypeScript 不知道
const articlesWithCategories =
  await (this.prisma as any).articles.findMany({
    include: { categories: true },
  });

// 3. 映射时参数标注为 articles 类型，保证字段类型正确
const list = articlesWithCategories
  .map((article: articles) => ({
    id: article.id,
    title: article.title,
    // categories 是 include 关联进来的，原始类型没有，用 any
    category: {
      id: (article as any).categories.id,
      name: (article as any).categories.name,
    },
  }));
```

**经验**: 当 Prisma 模型名是全小写下，需要用 `(this.prisma as any).modelName` 访问，然后单独给参数标注导入的类型。

---
````

---

## 如何添加项目记忆

### 方法 1：你自己直接写

因为项目记忆存在你项目的 `.claude/project-memory.md`，你可以：

1. 直接打开文件编辑
2. 按照已有格式添加新内容
3. Git 提交分享给团队

### 方法 2：让 Claude 帮你写

你用自然语言说：

```
帮我把这个内容添加到项目记忆 .claude/project-memory.md 中：
[粘贴你的内容]
```

### 项目记忆示例（当前项目已有）

```markdown
# 项目开发记忆 - 错误记录

## CSS 命名规范错误记录

### 错误场景
新建页面和组件时，**根容器 class 直接使用通用名称 `.container`，没有添加页面/组件名称作为前缀**。

### 正确规范
> 在 CSS Modules 中，虽然不会发生命名冲突，但是**所有 class 名称都应该使用页面/组件名称作为前缀**，保持语义清晰：
> - 页面 `Notifications` → 根容器 `.notificationsContainer`，所有其他 class 如 `.notificationsHeader`, `.notificationsBackBtn`, 等等
> - 组件 `NotificationListItem` → 根容器 `.notificationListItemContainer`，所有其他 class 如 `.notificationListItemAvatar`, `.notificationListItemContent`, 等等

### 原因
这样做可以：
1. 保持样式语义化，一眼就能看出这个 class 属于哪个组件
2. 方便调试和查找
3. 避免在开发者工具中看到一堆通用的 `.container` `.header` `.content` 无法区分

### 示例
❌ 错误写法：
```scss
.container { ... }
.header { ... }
.content { ... }
```

✅ 正确写法：
```scss
.notificationsContainer { ... }
.notificationsHeader { ... }
.notificationsContent { ... }
```

---

**记录日期**: 2026-03-27
**错误原因**: 沿袭了其他项目习惯，忘记本项目要求所有 class 都加前缀
```

---

## 验证方法

### 方法 1：直接打开文件查看

```bash
# 查看自动记忆
open ~/.claude/projects/-Users-yanjinqiang-WebstormProjects-claude/memory/MEMORY.md

# 查看项目记忆
open /Users/yanjinqiang/WebstormProjects-claude/.claude/project-memory.md
```

### 方法 2：下次对话验证

重启 Claude Code 对话，你会看到系统提示中有类似输出：

```
# memory/MEMORY.md
... 你的内容会显示在这里 ...
```

这说明自动记忆已经自动加载成功。

---

## 常见问题

### Q: 添加到自动记忆后，什么时候生效？

**A**: 下次新建对话就生效。当前对话需要重启对话后才会加载新记忆。

### Q: 自动记忆会占很多空间吗？

**A**: 不会。一般项目就算记录几十个案例，也就几 KB，完全可以忽略。

### Q: 我能删除过时的记忆吗？

**A**: 可以。直接打开 `MEMORY.md` 文件删掉对应的案例段落就行，不影响系统功能。

### Q: 换电脑了，自动记忆还在吗？

**A**: 不在了。因为自动记忆存在你本地用户目录，不会同步到新电脑。项目记忆存在项目仓库里，换电脑 clone 项目还在。

### Q: 团队协作，大家都能看到自动记忆吗？

**A**: 不能。自动记忆存在每个人本地，只对自己生效。要共享请放到项目记忆。

### Q: 我应该把规范放自动记忆还是项目记忆？

**A**: 如果只是你自己需要 Claude 记住放自动记忆，如果需要团队一起遵守放项目记忆。也可以两边都放：自动记忆让 Claude 每次提醒你，项目记忆给人看。

### Q: 项目记忆（`.claude/*.md`）真的会自动加载吗？

**A**: ❌ **不会**。Claude Code **不会**自动扫描并加载 `.claude/` 目录下所有 `.md` 文件。只有以下几种情况会被加载：
  1. 项目根目录的 `CLAUDE.md` - 一定会自动加载
  2. 在 `CLAUDE.md` 中通过 `Contents of` 显式引用的文件 - 会被加载
  3. 需要访问时，Claude 会用 `Read` 工具手动读取

所以你放在 `.claude/project-memory.md` 的内容，**不会**每次对话自动进入上下文，只有需要时才会被读取。

### Q: 我放在 `./memory/MEMORY.md` 会自动加载吗？

**A**: ❌ **不会**。Claude Code 默认只加载自动记忆位置 `~/.claude/projects/<项目路径>/memory/MEMORY.md` 和项目根目录 `CLAUDE.md`。如果你想让项目内其他文件自动加载，需要在 `CLAUDE.md` 中手动引入。

### Q: `.claude/project-memory.md` 和 `~/.claude/.../MEMORY.md` 有什么区别？

**A**:
- `~/.claude/projects/<项目路径>/memory/MEMORY.md` - **自动记忆**： Claude 系统维护，每次对话自动加载，只在你本地
- `.claude/project-memory.md` - **项目记忆**： 你手动维护，存在项目仓库，需要时手动读取，团队共享

---

## 快速参考口诀

> 想让 Claude 每次记住 → **自动记忆**
> 想让团队一起看 → **项目记忆**
> 路径带 `~/.claude/projects` → **自动记忆**
> 路径在你的项目目录 → **项目记忆**
> 自然语言说清楚 → Claude 帮你整理好

---

## 当前项目已有记忆清单

### 自动记忆（`MEMORY.md`）

| 案例 | 类型 |
|------|------|
| NestJS + Prisma 模型命名问题 | 后端类型问题 |
| MobX useLocalObservable 箭头函数 this 绑定问题 | 前端 MobX 问题 |
| 页面级 useStore.ts 写法规范 | 前端编码规范 |

### 项目记忆（`project-memory.md`）

| 案例 | 类型 |
|------|------|
| CSS class 命名需要页面/组件前缀 | CSS Modules 规范 |
| Claude Code 命令路径规则（commands vs skills）| Claude Code 使用规范 |

---

## 相关文档

- [Claude Code 斜杠命令自动补全配置指南](./claude-code-slash-command-autocomplete.md)
- [Claude Code 超级能力理解手册](./claude-code-understand-handbook.md)
