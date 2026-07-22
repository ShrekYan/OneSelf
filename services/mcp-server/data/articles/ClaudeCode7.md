---
title: 子代理实战指南：从内置Agent到自定义专业团队
slug: claude-code-subagent-guide
date: 2024-06-01
tags: [Claude Code, Subagent, Agent团队]
---

# Claude Code 子代理实战指南：从内置 Agent 到自定义专业团队

一直跟 Claude Code"一对一"？上下文爆炸、角色混乱、串行低效——三个瓶颈迟早撞上。子代理不是锦上添花，而是从"能用"到"专业"的分水岭。这篇文章从"为什么需要"讲到"怎么造一个"，手把手带你搭建自己的 Agent 团队。

## 一、为什么需要子代理？

前面几篇，你一直在跟 Claude Code 的主 Agent 一对一对话。它确实很强，但用久了你会发现三个瓶颈越来越明显：

### 瓶颈一：上下文窗口是有限的

打个比方：你的桌子就这么大（上下文窗口就那么多 Token）。你让 Claude 同时看 20 个文件、记住你的编码规范、理解项目架构、还要分析性能问题——桌子上堆满了纸，它开始翻不过来了。分析质量肉眼可见地下降。

### 瓶颈二：不同任务需要不同的专业视角

代码审查要关注的点和安全审计要关注的点完全不同。让一个 Agent 同时扮演审查专家和安全专家，就像让一个医生同时做心脏手术和脑科手术——不是做不到，是做不好。

### 瓶颈三：串行处理，效率有上限

主 Agent 处理任务是排队的——先做 A、再做 B、再做 C。但很多任务其实可以并行——审查代码和写测试完全可以同时进行。

### 关键机制：上下文隔离

子代理的上下文是**隔离的**。它不会继承你跟主 Agent 之间的长对话历史，只接收自己的系统提示和被委派的具体任务。

这恰恰是它的优势——**干净的上下文 = 聚焦的分析**。

主 Agent 的上下文可能已经塞满了需求讨论、历史对话、临时笔记；而子代理拿到的是一张白纸加一份明确的工单，专注度完全不同。

## 二、Agent 机制：上下文隔离、内置能力与文件结构

### 2.1 子代理是怎么被调用的？

Claude Code 的子代理调用流程可以简化为：

```
你发出请求 → 主 Agent 判断是否需要委派 → 选择子代理 → 注入系统提示 + 任务描述 → 子代理在隔离上下文中执行 → 结果返回主对话
```

关键点：

- **主 Agent 负责任务拆解和委派决策**

- **子代理只在被调用时"活"起来**，任务完成就结束

- **子代理之间默认不通信**，协作通过主 Agent 串联

### 2.2 三个内置子代理

即使你不创建任何自定义子代理，Claude Code 也自带三个内置 Agent，输入 `/agents` 可以查看：

| 名称                | 用途                                     | 典型场景                           |
| ------------------- | ---------------------------------------- | ---------------------------------- |
| **Explore**         | 文件探索——搜索、阅读、发现代码库中的内容 | "请分析这个项目的整体结构"         |
| **Plan**            | 方案规划——研究代码库后制定执行方案       | "请为用户个人中心页面制定开发计划" |
| **general-purpose** | 通用子代理——处理复杂多步骤任务           | 委派一个独立的长链路任务           |

内置 Agent 不需要任何配置，开箱即用。但它们是通用的——当你需要**特定领域的专业分析**（比如安全审计、性能诊断、兼容性检查），就需要自定义 Agent。

### 2.3 Agent 文件结构

自定义 Agent 放在 `.claude/agents/` 目录下，每个 Agent 是一个 Markdown 文件，由两部分组成：

1. **YAML frontmatter**：声明名称、描述、工具权限、模型等元信息

2. **Markdown 正文**：定义角色、能力、工作流程、约束和输出格式

通用结构：

```
---
name: agent-name
description: Agent 的一句话描述，决定 Claude 能否正确自动委派
tools: Read, Glob, Grep, Bash
model: inherit
---

## Purpose

说明 Agent 的角色定位和目标。

## Capabilities

说明 Agent 能做什么。

## Response Approach

说明 Agent 如何分步骤处理任务。

## Constraints

说明 Agent 不能做什么。

## Output Format

说明最终输出格式。
```

### 2.4 Frontmatter 字段速览

| 字段          | 是否必填 | 作用                                     | 示例                                         |
| ------------- | -------- | ---------------------------------------- | -------------------------------------------- |
| `name`        | 建议必填 | Agent 唯一名称，调用时使用               | `frontend-code-reviewer`                     |
| `description` | 建议必填 | 一句话能力描述，**决定自动委派的准确度** | `React 代码审查专家，专注类型安全和性能问题` |
| `tools`       | 按需填写 | 限定 Agent 可用工具，遵循最小权限原则    | `Read, Glob, Grep`                           |
| `model`       | 可选     | 指定模型，`inherit` 继承默认模型         | `inherit`                                    |

其中 `description` 特别关键——当你用自然语言描述任务让 Claude 自动委派时，它就是靠匹配每个 Agent 的 `description` 来选人的。描述越具体，选得越准。

**差的 description：** "通用助手"

**好的 description：** "检查 XSS、注入攻击和认证绕过的安全审计专家"

### 2.5 子代理的持久化记忆

正常情况下，子代理每次被调用都是"全新的"，不记得上一次做了什么。但你可以通过 `tools` 字段中加入 `manage_core_memory` 让它拥有持久化的笔记本：

```
---
name: code-reviewer
description: 审查代码质量，专注 TypeScript 类型安全、React 最佳实践和性能问题
tools: Read, Glob, Grep, Bash, manage_core_memory
model: inherit
---
```

有了 `manage_core_memory`，子代理可以在 `.claude/agent-memory/` 目录下读写自己的持久化文件。这意味着：

- 审查 Agent 可以记住"这个项目上次审查时的问题模式"

- 安全 Agent 可以维护一个"已知风险点清单"

- 下次被调用时不用从零开始，直接在已有认知上继续

## 三、三种调用方式 + 自定义 Agent + 实战案例

### 3.1 方式一：手动指定子代理

最明确的方式，适合你知道该用谁的时候：

```
使用 code-reviewer 子代理审查 @src/app/api/posts/route.ts
```

```
用 security-auditor 扫描 @src/app/api/ 目录下所有 API 路由的安全漏洞
```

```
让 test-writer 为 @src/components/ArticleCard.tsx 编写单元测试
```

### 3.2 方式二：自然语言描述，Claude 自动委派

你不需要记住子代理的名字——只要任务描述足够清晰，Claude 会根据每个子代理的 `description` 字段自动匹配最合适的那个：

```
帮我检查这个 API 有没有 SQL 注入风险
→ Claude 自动选择 security-auditor
```

```
给 ArticleCard 组件写一套完整的测试
→ Claude 自动选择 test-writer
```

自动委派的准确度取决于 `description` 写得多清晰。**模糊的描述 = 选错人。** 所以——把 description 写具体，不是"通用助手"，而是"检查 XSS、注入攻击和认证绕过的安全审计专家"。

### 3.3 方式三：组合调用，多代理协作

这是最强大的用法——一句话触发多个子代理：

```
对 @src/app/api/posts/route.ts 做一次完整审查：
1. 代码质量审查
2. 安全漏洞扫描
3. 补充缺失的测试
```

Claude 会理解你需要三个维度的分析，分别委派给对应的子代理，然后汇总结果。

还可以更显式地要求串行协作：

```
先让 code-reviewer 审查 @src/components/ArticleCard.tsx，
然后基于审查结果，让 test-writer 补充测试覆盖
```

这样 test-writer 就能参考审查报告来决定哪些地方需要重点测试。

### 3.4 自定义 Agent：六步造一个专业角色

#### 第一步：明确职责边界

先回答四个问题：

| 问题                      | 示例答案                           |
| ------------------------- | ---------------------------------- |
| 这个 Agent 解决什么问题？ | 审查移动端 H5 兼容性问题           |
| 它能不能改代码？          | 不能，只输出报告                   |
| 它需要哪些工具？          | Read、Glob、Grep、Bash             |
| 它输出什么结果？          | 兼容性风险报告、文件位置、修复建议 |

#### 第二步：选择工具权限

工具权限遵循最小权限原则——能只读就只读：

| Agent 类型      | 推荐工具                                           | 可写 |
| --------------- | -------------------------------------------------- | ---- |
| 搜索类          | `Glob, Grep, Read`                                 | ❌   |
| 审查类          | `Read, Glob, Grep, Bash`                           | ❌   |
| 安全/性能分析类 | `Read, Glob, Grep, Bash, mcp__ide__getDiagnostics` | ❌   |
| 开发类          | `Read, Write, Edit, Glob, Grep, Bash`              | ✅   |
| 代码生成类      | `Read, Write, Edit, Glob, Grep, Bash`              | ✅   |

**审查类的 Agent 永远只给只读权限。** 这不是限制，是保护——防止审查 Agent"顺手帮你改了"导致不可控。

#### 第三步：编写角色定位

角色定位要具体到项目和场景，避免泛泛而谈。

❌ 差的定位：

```
你是一个高级工程师，可以帮助用户解决问题。
```

✅ 好的定位：

```
你是本项目的移动端 H5 兼容性审查专家，负责在只读模式下检查
指定页面在微信内置浏览器、鸿蒙系统、iOS Safari 和 Android WebView
中的兼容性风险，并输出可验证的修复建议。
```

Claude 本来就会审查代码，你不需要告诉它"你是审查专家"。你需要告诉它的是：**这个项目的具体标准是什么、什么级别的问题怎么处理、输出格式长什么样。** 越具体，结果越好。

#### 第四步：写清楚工作流程

好的 Agent 要有稳定的处理流程：

```
1. 明确检查范围
2. 搜索目标文件和相关依赖
3. 读取关键代码
4. 按兼容性维度分类问题
5. 给出风险等级、证据和修复建议
6. 给出验证方式
```

流程稳定，输出才稳定。

#### 第五步：写清楚禁止事项

禁止事项防止 Agent 越权：

```
- 禁止修改代码
- 禁止执行全局 lint 或全局修复
- 禁止安装、升级、删除依赖
- 禁止在证据不足时给出确定结论
- 禁止扩大到用户未指定的模块
```

#### 第六步：固定输出格式

输出格式越稳定，越适合团队协作和长期沉淀：

```
# 移动端 H5 兼容性审查报告

## 审查范围
## 总体结论
## 风险列表

| 风险等级 | 问题 | 位置 | 影响 | 建议 |
|---------|------|------|------|------|

## 详细问题
## 验证方式
## 需要补充确认的信息
```

### 3.5 不要从零手写——用"人提需求 → AI 生成 → 人调方向 → AI 定稿"的迭代法

六步法告诉你 Agent 应该包含什么，但别真的从空白文件开始一个字一个字敲。更高效的方式是**让 AI 帮你写初稿，你来把控方向**：

**第一轮：你提需求，AI 生成初稿**

```
帮我创建一个移动端 H5 兼容性审查 Agent，放在 .claude/agents/ 下：
- 只读，不改代码
- 重点检查微信内置浏览器、鸿蒙、iOS Safari、Android WebView 的兼容性
- 输出带文件路径和行号的风险报告
- 按 Critical / High / Medium / Low 分级
```

Claude 会根据你的描述生成一份完整的 Agent Markdown 文件，包括 Purpose、Capabilities、Response Approach、Constraints、Output Format 全部结构。

**第二轮：你调方向，AI 生成改进版**

初稿通常大方向对，但细节会有偏差——可能是审查维度漏了、禁止项不够严格、输出格式太粗糙。这时候不要自己改，继续让 AI 调：

```
补充以下审查维度：CSS safe-area-inset 适配、鸿蒙系统下的 file input 兼容性、
微信 JSSDK 签名过期处理。Constraints 加一条：禁止把需要真机验证的问题
直接定性为确定 Bug。Output Format 加一个"真机验证建议"区块。
```

AI 会基于初稿做增量修改，你只需要指出方向。

**第三轮：确认定稿，投入实战**

方向满意后，让 AI 输出最终版并保存到 `.claude/agents/` 目录。然后**立刻用它审查一段代码**，验证实际效果：

```
使用 mobile-h5-compat-reviewer 审查 @src/pages/FundDetail/index.jsx
```

如果输出质量不达标，继续调提示词再生成；如果满意，提交 Git，Agent 正式上岗。

**为什么这个方法有效？**

- **人负责"要什么"，AI 负责"怎么写"**——你最懂项目痛点，AI 最懂 Agent 结构，分工明确

- **迭代比一次性写完更可控**——每轮只调一个方向，偏了容易拉回来

- **实际验证比"看起来对"更重要**——Agent 是拿来用的，不是拿来读的，跑一次比看十遍都有用

我自己用这个方法创建 Agent，通常两到三轮就能从零到一个可用的专业 Agent，比从空白文件手写快 3-5 倍。

### 3.6 实战案例：移动端 H5 兼容性审查 Agent

下面是一个完整可用的自定义 Agent，直接放到 `.claude/agents/mobile-h5-compat-reviewer.md` 即可使用：

```
---
name: mobile-h5-compat-reviewer
description: 移动端 H5 兼容性审查专家，负责检查微信内置浏览器、鸿蒙、iOS Safari、Android WebView 等环境下的兼容性风险
tools: Read, Glob, Grep, Bash, mcp__ide__getDiagnostics
model: inherit
---

## Purpose

你是本项目的移动端 H5 兼容性审查专家。

你的职责是在只读模式下，对用户指定页面、组件或当前变更进行兼容性审查，
重点识别微信内置浏览器、鸿蒙系统、iOS Safari、Android WebView、
低端安卓机和弱网环境下可能出现的展示、交互、上传、滚动、键盘、
安全区域和生命周期问题。

## Capabilities

- 检查 CSS 兼容性风险：fixed、sticky、vh、overflow、safe-area、transform、z-index
- 检查移动端点击区域、滚动穿透、弹窗遮罩、输入框键盘顶起问题
- 检查图片上传、base64、文件选择在鸿蒙和微信环境下的兼容性
- 检查微信 JSSDK、WebView 生命周期、页面返回缓存导致的状态问题
- 输出带文件路径和行号的兼容性风险报告

## Response Approach

1. 明确审查范围：当前变更、指定文件、指定模块或指定页面
2. 搜索相关 JSX、SCSS、工具函数和平台判断逻辑
3. 读取关键代码，定位移动端兼容性风险
4. 按风险类型分类：布局、滚动、输入、上传、WebView、微信、鸿蒙、样式单位
5. 为每个问题标注风险等级、证据位置、影响范围和修复建议
6. 给出真机验证方式和建议测试矩阵

## Constraints

- 禁止修改代码
- 禁止执行全局 lint 或全局自动修复
- 禁止安装、升级、删除依赖
- 禁止修改构建配置
- 禁止把需要真机验证的问题直接定性为确定 Bug
- 禁止输出没有文件路径和行号的问题

## Output Format

# 移动端 H5 兼容性审查报告

## 审查范围
- 审查对象：
- 审查文件：
- 审查方式：

## 总体结论
- 兼容性评级：通过 / 有条件通过 / 不建议通过
- 高风险问题数量：
- 中风险问题数量：
- 低风险问题数量：

## 风险概览

| 风险等级 | 风险类型 | 问题 | 位置 | 建议 |
|---------|---------|------|------|------|

## 详细问题

### 1. 问题标题
- 风险等级：
- 风险类型：
- 问题位置：`path/to/file.jsx:42`
- 证据：
- 影响：
- 修复建议：
- 验证方式：

## 真机验证建议
- 微信内置浏览器：
- 鸿蒙系统：
- iOS Safari：
- Android WebView：

## 需要补充确认的信息

## Example Interactions
- "审查当前变更是否有移动端兼容性问题。"
- "检查这个上传组件在鸿蒙系统下是否有风险。"
- "检查这个弹窗在微信内置浏览器是否可能滚动穿透。"
```

### 3.7 实战案例二：前端开发 Agent（可写型）

前面的兼容性审查 Agent 是**只读型**——只看不改，输出报告。但开发型 Agent 完全不同：它要写代码、建文件、跑 lint。权限更重，约束也必须更严。

下面是一个真实项目中正在使用的前端开发 Agent，它体现了开发型 Agent 的几个关键设计思路：

#### 设计思路一：用官方加载机制编排知识库，而不是把所有规则塞进一个文件

```
---
name: frontend-developer
description: 项目专属前端开发 Agent，React 18 + MobX 移动端 H5 开发专家
tools: Read, Write, Edit, Glob, Grep, Bash, mcp__ide__getDiagnostics
model: inherit
skills:
  - frontend-developer-create-component
  - frontend-developer-create-page
  - frontend-developer-lint
  - page-templates
---
```

这个 Agent 组合了三种 Claude Code 官方支持的加载方式：

- **公共规则自动加载**：`.claude/rules/` 下的规则文件由 Claude Code 自动发现并加载，适合放项目长期通用规范

- **Agent 预加载 Skill**：在 Subagent frontmatter 中声明 `skills:`，让开发 Agent 启动时获得页面创建、组件创建、增量 lint 等 Skill 内容

- **Skill supporting files 按需读取**：页面模板、Hooks 指南、SCSS 模板等长篇资料放在 Skill 辅助文件中，需要时再读取

这样做的好处是：

- **规则和 Skill 独立维护**——通用规范放 rules，任务流程放 skills，模板资料放 supporting files

- **Agent 文件本身保持精简**——只放角色定位、工作流程、约束和输出格式，不堆砌规范细节

- **符合官方能力模型**——rules 负责项目规则，skills 负责可复用能力，supporting files 负责长资料沉淀

如果你把所有规则都写在一个 Agent 文件里，文件会膨胀到 500+ 行，改一条规范要改 N 个 Agent。更稳的方式是：公共规则放 `.claude/rules/`，任务能力放 `.claude/skills/`，Agent 通过 `skills:` 预加载真正需要的能力。

#### 设计思路二：Mandatory Workflow——强制执行顺序，不允许跳步

开发型 Agent 最容易出的问题是"跳步"——没看项目现有代码风格就开始写、写完不跑 lint、直接全局修复。这个 Agent 用 Mandatory Workflow 把步骤锁死：

```
## Mandatory Workflow（必须严格按顺序执行）

### 第一步：匹配规范

根据用户任务类型，自动对应规范：

| 任务类型 | 使用的规范 |
|---------|-----------|
| 创建新页面 | create-page.md + 页面模板 |
| 创建新组件 | create-component.md + 组件模板 |
| 修改样式 | 750-design-vw-guide.md |
| 代码修改完成后 | frontend-developer-lint.md |

### 第二步：理解项目现有代码风格

读取 1-2 个相关的现有文件，确认缩进、导入、命名、注释风格。

### 第三步：按规范编写代码

严格按照自动加载的公共规则、预加载 Skill 和按需读取的模板编写代码。

### 第四步：增量 lint 检查

只针对变更文件执行增量检查。
```

"必须严格按顺序执行，不允许跳过步骤"——这句话不是摆设，是给 Agent 的硬约束。审查型 Agent 可以灵活发挥，开发型 Agent 必须走流程。

#### 设计思路三：Absolute Prohibitions——红线区，碰了就炸

开发型 Agent 有写权限，就必须有"绝对禁止"清单。这个 Agent 有一条最典型的：

```
## Absolute Prohibitions（最高优先级）

严禁执行以下全局 lint fix 命令，违者会导致全项目数百个文件被意外修改：

| 命令 | 危害 |
|------|------|
| `npm run eslint-fix-GLOBAL-DANGEROUS` | 全局修复整个 src/ |
| `npx eslint --fix src/` | 全局修复整个 src 目录 |

✅ 正确做法：
- 全新文件：`npx eslint --fix 具体文件名`
- 修改老文件：只检查，不自动修复
```

这不是理论——这是真实踩过的坑。Agent 一次全局 `eslint --fix` 改了 200+ 文件，PR diff 直接爆炸。**开发型 Agent 必须把"能做什么"和"绝对不能做什么"都写死。**

#### 设计思路四：Completion Checklist——交付前自检清单

这个 Agent 在输出格式之后还附了一张完整的自检清单：

```
## Completion Checklist
- [ ] 组件命名是否为大驼峰（PascalCase）？
- [ ] 样式类名是否为小驼峰（camelCase）？
```
