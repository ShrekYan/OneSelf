---
title: 记忆系统完全指南：CLAUDE.md从入门到实战
slug: claude-code-memory-system-guide
date: 2024-06-01
tags: [Claude Code, 记忆系统, CLAUDE.md]
---

# Claude Code -3 记忆系统完全指南： CLAUDE.md 从入门到实战

为什么你的 Claude Code 总是"失忆"？因为你没用好 CLAUDE.md。4 层记忆体系 + 实战创建流程，一篇文章讲透。

## 前言

用 Claude Code 最头疼的事是什么？**每次开新会话都要重新解释项目。**

"我们用的是 Monorepo 架构"、"后端用 NestJS 11"、"前端状态管理用 MobX 双轨架构"……这些话你说了多少遍？

CLAUDE.md 就是解决这个问题的。它是 Claude Code 的项目记忆文件，每次会话启动时自动读取，一次编写、永久生效。

这篇文章会讲清楚三件事：**记忆体系的 4 层架构**、**好的 vs 差的 CLAUDE.md**、**如何从零创建一个 CLAUDE.md**。

## 一、记忆系统全景图

Claude Code 的记忆不是"一个文件"，而是 **4 层由远及近的记忆栈**。每一层解决不同维度的问题，叠加生效。

核心规则：

- **加载顺序**：从第 1 层到第 4 层依次叠加

- **冲突时**：越具体的层级优先级越高

- **所有层级同时生效**，不是覆盖关系

### 自动读取机制

**触发时机：**

- **会话开始时**：每次启动 Claude Code，自动加载第 1-3 层

- **持续积累**：Claude 在工作过程中自动维护第 4 层

**企业级记忆（第 0 层）：**

部分企业环境还有更高优先级的企业级记忆，由 IT 管理员统一管控：

| 系统      | 文件位置                                            |
| --------- | --------------------------------------------------- |
| macOS     | `/Library/Application Support/ClaudeCode/CLAUDE.md` |
| Linux/WSL | `/etc/claude-code/CLAUDE.md`                        |
| Windows   | `C:\ProgramData\ClaudeCode\CLAUDE.md`               |

用于企业标准、安全策略、合规要求，优先级最高。

## 二、4 层记忆逐层详解

### 第 1 层：全局 CLAUDE.md

**位置**：`~/.claude/CLAUDE.md`

适合放"不管在哪个项目，我都希望 Claude 这样做"的规则：

```
# 全局开发偏好
## 语言设置
- 默认使用中文回答
- 代码注释使用英文

## 编码风格
- 使用 2 空格缩进
- 优先使用 const，let 只在需要重新赋值时使用
- 字符串优先使用单引号
```

### 第 2 层：项目 CLAUDE.md

**位置**：项目根目录 `./CLAUDE.md`

这是 **4 层中最重要的一个**，也是日常维护的重点。项目专属信息、团队共享、提交到 Git。后面会用完整案例详细讲。

### 第 3 层：CLAUDE.local.md

**位置**：项目根目录 `./CLAUDE.local.md`

和项目 CLAUDE.md 同步加载，但 **只在你本地生效，绝不提交 Git**。

**和第 1 层全局 CLAUDE.md 的关键区别：**

|          | 全局 CLAUDE.md（第 1 层） | CLAUDE.local.md（第 3 层）       |
| -------- | ------------------------- | -------------------------------- |
| 位置     | `~/.claude/CLAUDE.md`     | 项目根目录 `./CLAUDE.local.md`   |
| 作用范围 | 所有项目                  | 仅当前项目                       |
| 跟随关系 | 跟人走                    | 跟项目走（但只在你本地）         |
| 典型场景 | "我所有项目都用中文回答"  | "这个项目用中文，那个项目用英文" |

**典型用法：**

```
# Local Preferences
## 环境
- Node 版本：v22.x（nvm use 22）
- 本地 Redis 端口：6380（非默认的 6379）
- 调试时连 dev 分支数据库

## 偏好
- 先给我方案再写代码
- 这个项目我不关心测试覆盖率，别提醒我
- 遇到 TypeScript 类型报错优先用 as 断言，别重构
```

**什么时候用 CLAUDE.local.md 而不是改 CLAUDE.md？**

- 你的偏好和团队规范冲突（比如团队要求英文注释，你想用中文）

- 你有本地环境特有的配置（比如你的数据库端口和别人不一样）

- 你想让 Claude 在这个项目里改变行为，但不想影响团队其他人

⚠️ 确保 `.gitignore` 中包含 `CLAUDE.local.md`，避免个人偏好提交到仓库。

### 第 4 层：Auto Memory

**位置**：`~/.claude/projects/<项目名>/memory/`

Claude 自己记的笔记，自动维护，你不需要管：

```
~/.claude/projects/your-project/memory/
├── MEMORY.md ← 索引文件，启动时加载前 200 行
├── debugging.md ← Claude 记录的调试经验
├── patterns.md ← Claude 发现的代码模式
└── api-conventions.md ← Claude 总结的 API 约定
```

**CLAUDE.md vs Auto Memory 的分工：**

|             | CLAUDE.md（第 1-3 层） | Auto Memory（第 4 层）             |
| ----------- | ---------------------- | ---------------------------------- |
| 谁写的      | 你写的                 | Claude 自己写的                    |
| 内容性质    | 指令和规范             | 经验和发现                         |
| 提交 Git    | ✅                     | ❌                                 |
| 共享范围    | 团队共享               | 个人专属                           |
| 加载方式    | 启动时全量加载         | 启动时加载前 200 行                |
| 该写/记什么 | 技术栈、规范、命令     | 调试经验、踩过的坑、发现的特殊模式 |

你可以主动让 Claude 记住某件事：

```
记住：Prisma 的 BigInt 时间戳字段在 JSON 序列化时要用 .toString()，
否则前端拿到的会是科学计数法，数字精度丢失
```

Claude 会把这条信息写入 MEMORY.md，下次遇到类似问题自动回忆起来。

## 三、好的 vs 差的 CLAUDE.md

同样一个项目，CLAUDE.md 写成什么样，Claude 的表现天差地别。

### ❌ 差的 CLAUDE.md

```
# Blog Project
This is a full-stack blog. Use React and NestJS.
Write clean code and follow best practices.
```

问题在哪？

- "full-stack blog"——Monorepo？多微服务？前端是 H5 还是 PC？

- "Use React and NestJS"——React 18 还是 19？NestJS 10 还是 11？状态管理用什么？

- "clean code"——你的 clean 和我的 clean 可能完全不同

- "best practices"——Claude 自己就知道最佳实践，不需要你说这句废话

结果就是：Claude 只能靠猜，猜错了你再纠正，一来一回浪费大量时间。

### ✅ 好的 CLAUDE.md

CLAUDE.md 放的是 **通用规则 + 高频规则**——每次会话都用得到的信息。低频的、特定场景的规则拆到 rules/。

```
# Blog - 全栈博客平台
## 项目描述
Monorepo 单代码仓库多系统架构，前端 H5 移动端 + 后端多微服务 + 跨系统共享包。

## 核心技术栈
- 前端：React 19 + Vite + TypeScript + MobX + Ant Design Mobile
- 后端：NestJS 11 + Prisma ORM + Redis
- 构建工具：Turborepo

## 系统架构
- apps/web/ — 前端 H5 移动端
- services/auth-service/ — 认证授权服务
- services/backend/ — 主业务服务（文章、评论、用户）
- services/log-service/ — 日志服务
- packages/shared-logging/ — 跨系统共享包

## 常用命令
- 全项目开发：npm run dev（根目录）
- 前端单独开发：cd apps/web && npm run dev
- 单个后端服务：cd services/auth-service && npm run start:dev
- 全项目构建：npm run build

## 通用编码规范（前后端高频规则）
- 前端页面 5 文件拆分：index / useStore / handle / constant / types
- 状态管理用 MobX 双轨架构 + useObserver Hook
- 后端接口统一响应格式
- 共享包禁止包含业务逻辑
- 导入排序：第三方库 → @/ 别名 → 相对路径
- 禁止使用 any，用 unknown 替代
- 异步操作必须处理错误，禁止空 catch

## 验证流程
1. 在修改的子项目目录执行 npm run lint
2. 前端目录：npx tsc --noEmit
3. 参照 .claude/commands/review.md 自我审计

## 规范入口
- 通用规则：.claude/rules/typescript-common.md、security-common.md
- 前端特有：.claude/rules/frontend-components.md
- 后端特有：.claude/skills/nestjs-backend-developer/
```

**关键点：CLAUDE.md 里只放"每次会话都需要的信息"。** 具体来说：

| 放进 CLAUDE.md ✅                    | 不放进 CLAUDE.md ❌                |
| ------------------------------------ | ---------------------------------- |
| 技术栈和版本号                       | 具体某个 API 的字段设计            |
| 项目结构和职责边界                   | 某个模块的详细实现逻辑             |
| 高频编码规范（每次写代码都会用到的） | 低频规范（只在特定场景用到的）     |
| 常用命令（dev/build/test/lint）      | 一次性操作命令（数据库迁移、部署） |
| 验证流程                             | 详细的 debug 步骤                  |
| 规范文件的入口引用                   | 规范文件的完整内容                 |

低频规则不是不重要，而是应该放在 rules/ 里按需加载，避免每次会话都占上下文。

**CLAUDE.md 不是越多越好。** 它的内容会占用每次会话的上下文窗口，写太多反而降低 Claude 对每条规则的遵循度。一条规则如果连续三次会话都没被触发，大概率不该放在这里——移到 rules/ 按需加载更合适。

### 对比总结

| 维度     | ❌ 差的                  | ✅ 好的                                     |
| -------- | ------------------------ | ------------------------------------------- |
| 项目描述 | "全栈博客"               | "Monorepo 多系统架构，H5 + 微服务 + 共享包" |
| 技术栈   | "React + NestJS"         | "React 19 + MobX + NestJS 11 + Prisma"      |
| 架构信息 | 没有                     | 5 个系统目录和职责边界                      |
| 编码规范 | "写干净的代码"           | 通用高频规则 + 规范入口引用                 |
| 常用命令 | 没有                     | 全项目 / 前端 / 后端分开列出                |
| 验证流程 | 没有                     | lint → tsc → self-review                    |
| 内容策略 | 不知道该写什么不该写什么 | 只放通用+高频，低频拆到 rules/              |
| 效果     | Claude 不断追问          | Claude 上手就能干活                         |

## 四、进阶用法

### 进阶一：.claude/rules/ 模块化规则

当 CLAUDE.md 开始变臃肿，可以按文件类型或关注点拆分规则：

```
.claude/rules/
├── typescript-common.md ← TypeScript 通用规范（前后端共用）
├── security-common.md ← 安全规范（前后端共用）
├── code-format-common.md ← 代码格式规范
├── project-behavior.md ← 全局行为规范
└── frontend-components.md ← 前端组件开发规范
```

每个规则文件可以通过 frontmatter 指定作用范围：

```
---
globs: ["apps/web/src/**/*.tsx", "apps/web/src/**/*.ts"]
---

# 前端组件开发规范
- 页面 5 文件拆分：index / useStore / handle / constant / types
- 公共组件放在 src/components/，用 PascalCase 命名
- 样式使用 SCSS + CSS Modules，禁止全局样式污染
```

这份规则只在 Claude 操作匹配 `apps/web/src/**/*.tsx` 的文件时才加载。

### 进阶二：项目记忆标准化

踩坑记录不要散落在各处，统一维护在一个文件中：

```
## 项目记忆规则

当用户说"添加到项目记忆"，将踩坑教训写入 `.claude/project-memory.md`：

---
## 问题标题（一句话概括）

### 错误场景
什么场景下遇到这个错误

### 错误现象
具体遇到了什么问题

### 原因分析
分析错误原因

### 正确解决方法
正确的代码/配置/操作步骤

### 记录信息
**记录日期**: YYYY-MM-DD
**错误原因**: 一句话概括根本原因
---
```

这比 Auto Memory 更可控——你来决定什么值得记，格式统一方便回溯。

## 五、如何创建 CLAUDE.md——AI 扫描 + 人工调优

### 核心思路

不要从零手写。**让 AI 先扫描项目生成初版，再人工精调。** 这样既能快速起步，又能确保内容准确。

### 第一步：用 /init 自动生成初版

```
cd your-project
claude
> /init
```

Claude Code 会自动读取项目结构、package.json、配置文件等，生成一份 CLAUDE.md 初版。

### 第二步：用 AI 深度扫描补充

`/init` 生成的初版通常比较粗略。用以下提示词让 Claude 做更深入的扫描：

```
请深度分析这个项目，帮我完善 CLAUDE.md。具体需要：

1. 扫描项目结构，列出核心目录及其作用
2. 从 package.json 提取技术栈和关键依赖版本
3. 从 tsconfig/eslint/prettier 配置提取编码规范
4. 从现有代码中总结项目特有的编码模式（如 API 返回格式、组件声明方式）
5. 提取所有可用的 npm scripts 及其用途

注意：
- 只写"每次会话都需要的信息"
- 不要写太细的实现细节
- 控制在 100-150 行以内
```

### 第三步：人工精调（和 AI 反复调试）

初版生成后，**不是改完就完事了，而是要和 AI 反复调试**——在实际使用中发现 CLAUDE.md 哪里没写清楚、哪里写了废话、哪里 Claude 还是会犯错，然后持续修正。

典型的调试循环：

```
使用 Claude Code 做开发
    ↓
Claude 犯错或反复追问同一个问题
    ↓
反思：CLAUDE.md 里缺了什么？或者写了什么没用的？
    ↓
修改 CLAUDE.md
    ↓
重新验证，看 Claude 是否还会犯同样的错
    ↓
重复以上过程
```

经过几轮调试后，你会发现这些常见问题：

| 常见问题                        | 修正方式                                     |
| ------------------------------- | -------------------------------------------- |
| 技术栈描述过于笼统              | 补充具体版本号（如 "React 19" 而非 "React"） |
| 编码规范写了 "遵循最佳实践"     | 替换为具体规则（如 "5 文件拆分模式"）        |
| 遗漏了非 obvious 的项目约定     | 手动补充（如 "共享包禁止包含业务逻辑"）      |
| Claude 反复追问同一个问题       | 说明 CLAUDE.md 里缺了这条信息，补上          |
| Claude 总是做某件你不想它做的事 | 加一条明确的禁止规则                         |
| 包含了频繁变动的内容            | 删除，这些在会话中说就行                     |
| 行数超过 150 行                 | 拆分到 rules/                                |

**CLAUDE.md 是用出来的，不是写出来的。** 每次你和 Claude "磨合"后发现的问题，都是完善它的机会。

### 完整案例：从零到成品

以一个 **Monorepo 全栈博客项目** 为例，看完整创建过程。

**Step 1：`/init` 生成的初版**

```
# Blog Project
## Commands
- `npm run dev` - Start development
- `npm run build` - Build for production
- `npm run lint` - Run linting

## Structure
- apps/ - Applications
- services/ - Backend services
- packages/ - Shared packages
```

典型的"有总比没有好"但远远不够的初版。

**Step 2：AI 深度扫描后**

```
# Blog - 全栈博客平台
## 项目描述
Monorepo 单代码仓库多系统架构，前端 H5 移动端 + 后端多微服务 + 跨系统共享包。

## 核心技术栈
- 前端：React 19.2.3 + TypeScript 5.5.3 + Vite 7.3.1 + MobX 6.13.5 + Ant Design Mobile 5.42.3
- 后端：NestJS 11.0.1 + TypeScript 5.7.3 + Prisma ORM 6.4.1
- 共享包：纯 TypeScript 库
- 构建工具：Turborepo 2.4.2

## 系统架构与职责边界
| 系统 | 目录 | 职责范围 | 技术栈 |
|------|------|---------|--------|
| web | apps/web/ | H5 移动端应用 | React 19 + MobX |
| auth-service | services/auth-service/ | 认证授权服务 | NestJS 11 |
| backend | services/backend/ | 主业务服务 | NestJS 11 + Prisma |
| log-service | services/log-service/ | 日志服务 | NestJS 11 |
| shared-logging | packages/shared-logging/ | 统一日志格式 | TypeScript |

## 服务间依赖
web → auth-service ←→ backend ←→ log-service
    ↓
    shared-logging（共享包）

## 常用命令
### 根项目
- 全项目构建：npm run build
- 并行开发所有服务：npm run dev
- 全项目检查：npm run lint

### 前端（apps/web/ 目录下）
- 开发：npm run dev
- 构建：npm run build
- 类型检查：npx tsc --noEmit
- 各环境：npm run test-dev / sit-dev / prd-dev

### 后端（进入对应服务目录执行）
- auth-service：npm run start:dev
- backend：npm run start:dev
- log-service：npm run start:dev

## 编码规范
- 前端页面 5 文件拆分：index / useStore / handle / constant / types
- MobX 双轨架构 + useObserver Hook
- 导入规范：@/ 别名 + 统一导入排序
- 共享包纯技术库，不包含业务逻辑
- 跨系统修改提交：feat(auth+web): 描述

## 验证流程
1. 在修改的子项目目录执行 npm run lint
2. 前端目录：npx tsc --noEmit
3. 参照 .claude/commands/review.md 自我审计
```

**Step 3：人工精调后的最终版**

在 AI 扫描版基础上，你需要手动补充的内容：

```
## 踩坑记录（AI 不可能知道，必须你写）
- Prisma BigInt 时间戳在 JSON 序列化时要用 .toString()，
 否则前端拿到的会是科学计数法，数字精度丢失
- auth-service 的 Token 刷新接口走的是 /auth/refresh 不是 /auth/token/refresh，
 别搞混
- shared-logging 修改后必须同步重新构建所有依赖它的服务，
 否则运行时拿到的还是旧版本
```

**关键点：AI 扫描能覆盖"项目长什么样"，但"哪里有坑"只有你知道。**

## 六、.claude/ 内部访问逻辑速查

了解各目录的访问时机，才知道该把规则放哪里：

| 目录                                    | 访问时机                       | 作用                         |
| --------------------------------------- | ------------------------------ | ---------------------------- |
| `settings.json` / `settings.local.json` | 启动时                         | 权限控制、环境变量、默认模型 |
| `rules/`                                | 任务执行过程中，相关操作触发时 | 编码规范按需注入上下文       |
| `skills/`                               | 显式调用或满足触发条件时       | 复杂自动化流程的 SOP         |
| `agents/`                               | 使用 `@agent-name` 切换身份时  | 定义特定角色的 Persona       |
| `commands/`                             | 输入 `/命令名` 时              | 快捷操作触发                 |

## 七、本篇小结

三个核心收获：

**第一**，CLAUDE.md 是 Claude Code 的"项目交接文档"。每次会话自动加载，让 Claude 打开项目就知道该怎么干活。一次编写、永久生效。

**第二**，记忆系统有四个层级——全局、项目、本地、自动记忆——它们叠加生效，冲突时越具体的层级优先级越高。日常重点维护项目 CLAUDE.md 和 CLAUDE.local.md，其他按需使用。

**第三**，控制在 100-150 行以内，只写"每次会话都需要的信息"。太模糊的不写（"写干净的代码"），太详细的不写（拆到 rules/ 用引用），频繁变动的不写（在会话中说就行）。

**创建方法**：`/init` 生成初版 → AI 深度扫描补充 → 人工精调踩坑记录。AI 能覆盖"项目长什么样"，但"哪里有坑"只有你知道。
