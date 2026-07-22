---
title: 从Figma到React：一套让AI生成代码"不瞎编"的实战工作流
slug: claude-code-figma-to-react-workflow
date: 2024-06-01
tags: [Claude Code, Figma, React, 代码生成]
---

# 从 Figma 到 React：一套让 AI 生成代码"不瞎编"的实战工作流

关键词：Figma MCP、Claude Code、AI 代码生成、设计稿转 React、前端提效

面向读者：想把 Figma 设计稿真正跑通到生产代码的前端团队 / UI 设计师 / AI 工程化爱好者

## 一、为什么要写这篇？

把 Figma 设计稿"一键"转成 React 代码，是所有前端团队都想做的事。但真做起来会发现：

- 直接用 Figma 自带的 "Copy as code"，产出的是一坨绝对定位、Tailwind 类名满天飞的代码，根本没法维护；

- 让 AI（GPT/Claude）拿一张截图硬撸，**文案会瞎编、字体会脑补、颜色会调色**，还原度惨不忍睹；

- 就算接上 Figma MCP，如果设计稿本身没有分层、没有命名规范，AI 出的代码依然是灾难现场；

- 复杂页面丢给 AI，跑到一半上下文就爆了，功能悄悄丢了一半你都不知道。

我在** H5 项目**（React 18 + MobX + antd-mobile-v2 + 750 设计稿）里把这条链路走通了，本文把踩过的坑和沉淀下来的规范一次讲清楚。

## 二、整体架构：三方协作，缺一不可

先把心智模型摆正——Figma → React 从来不是"AI 一个人的事"，而是三方协作：

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   UI 设计师   │ ───> │   Figma 文件   │ <─── │  Claude Code  │
│ 按规范搭图层   │     │ 分层/命名规范   │     │   + MCP 工具   │
└──────────────┘     └──────────────┘     └──────┬───────┘
                                                 │
                                                 v
                                       ┌──────────────┐
                                       │   项目 Skill  │
                                       │   规范 + 模板  │
                                       └──────┬───────┘
                                              │
                                              v
                                       ┌──────────────┐
                                       │   React 代码  │
                                       └──────────────┘
```

三方各司其职：

1. **UI 设计师**：按容器/组件分层搭图层，命名规范化——这是**上游质量**；

2. **Figma MCP**：把设计稿变成结构化数据（节点、变量、资产）交给 AI；

3. **Skill 技能包**：约束 AI 输出，让它"按项目规范落地"，而不是自由发挥。

任何一环偷懒，最终代码质量都会打折。

## 三、准备工作：Figma Token 的两种拿法

要让 Claude Code 读到 Figma 文件，必须先拿到访问凭证。有两种方式，按场景选：

### 方式一：通过 Claude Code MCP 服务授权（推荐）

在 Claude Code 里直接 `claude mcp add figma`，走 OAuth 授权，Claude 会引导你在浏览器里登录 Figma 授权，token 由 Claude 托管，**不需要自己保存**。

- ✅ 优点：安全、免维护、多项目复用同一次授权；

- ⚠️ 注意：授权后要确认账号具备目标 Figma 文件的**至少查看权限**，团队库文件需要设计师开权限。

### 方式二：在 `.mcp` 配置中手动填 Token

适用于 CI/自动化脚本、或者授权流程走不通的场景：

```json
{
  "mcpServers": {
    "figma": {
      "command": "npx",
      "args": ["-y", "figma-developer-mcp"],
      "env": {
        "FIGMA_API_KEY": "figd_xxxxxxxxxxxx"
      }
    }
  }
}
```

- ✅ 优点：完全掌控 token；

- 建议将配置下沉到用户级别的mcp.json配置中

**建议**：个人开发日常用方式一；团队共享/自动化用方式二。

## 四、避坑指南：MCP 提取数据的几条铁律

在真正落码前，先记住这几条血泪教训：

### 4.1 复杂页面必须分批次生成

现在主流模型（Claude Sonnet 4）上下文只有约 **200K token**，一个稍微复杂点的落地页 + Figma metadata + 项目规则一喂进去就爆掉了。**上下文一旦被自动压缩，功能会悄悄丢**。

我的实战策略：

- 页面超过 3 屏 / 节点数 > 100 → **拆分成组件逐个生成，再组合成页面**；

- 每个组件单独一次会话，用 `mcp__figma__get_design_context` 只拉自己那部分节点；

- 页面壳（路由 + 布局 + 组件占位）先跑一遍，然后每个子组件独立跑；

- 最后再跑一次"组装 + 联调"。

这一步不做，模型会在你不注意时把"底部悬浮按钮""空态""异常态"这些细节静悄悄地吞掉。

### 4.2 AI 生成的代码必须严格套项目规范

Figma MCP 默认返回的是 **React + Tailwind** 参考代码，如果不加约束，AI 会：

- 用 Tailwind class，而不是项目的 SCSS + 750 设计稿；

- 用 class 组件，而不是函数组件 + Hooks；

- 用 antd-mobile 5.x，而项目实际用的是 v2；

**解法：把项目规范做成 Skill 技能包，让 AI "有法可依"**。这是本文接下来的核心。

## 五、UI 设计师侧：Figma 分层规范

这是 90% 团队都忽略的一环——**AI 生成质量的天花板取决于 Figma 图层的组织质量**。

我和团队 UI 反复对齐后，定了几条"AI 友好型"的 Figma 规范：

### 5.1 按"容器 + 组件"分层包裹

```
Page (Frame: 750×xxxx)
├── Header (Frame) ← 容器
│   ├── BackIcon (Component) ← 组件
│   └── Title (Text) ← 元素
├── ContentSection (Frame) ← 容器
│   ├── ProductCard (Component) ← 组件（可复用）
│   └── ProductCard (Component)
└── BottomBar (Frame) ← 容器
    └── ConfirmButton (Component)
```

**关键点**：

- **容器用 Frame + Auto Layout**：AI 会自动映射成 Flex 布局；

- **可复用块必须是 Component**：AI 能识别复用性，抽成独立组件；

- **图层命名有语义**：`Header` / `ProductCard` / `ConfirmButton`，而不是 `Frame 123`、`Group 456`。

### 5.2 设计变量（Design Tokens）必须走 Variable

颜色、字号、间距**不要在图层里硬填数值**，全部走 Figma Variables：

- `color/text/primary`

- `color/brand/500`

- `font/size/lg`

- `spacing/md`

这样 MCP 通过 `get_variable_defs` 拿到的是**语义化的 token**，AI 生成代码时可以直接映射到项目的 SCSS 变量或 CSS variables。

## 六、Skill 技能包：让 AI "有规矩地写代码"

这是我在几个项目（微信小程序、微信公众号、外部渠道 H5）里沉淀的核心工程化产出——**把 Figma 转代码做成 Claude Code Skill**。

### 6.1 Skill 是什么？

Claude Code 支持 `.claude/skills/` 目录，每个 skill 是一个 `SKILL.md`，声明**触发场景**和**执行流程**。用户输入 Figma 链接时，Claude 会自动加载 skill 内容，按里面写好的规范执行。

### 6.2 一个 Skill 的骨架

```yaml
---
name: figma-to-code
description: Figma 设计稿解析与代码生成专家，严格按照设计稿执行，禁止瞎编文案字体样式。
user-invocable: true
---

## 核心工作原则

- ✅ 忠于设计稿：所有文案、字体、字号、颜色必须与 Figma 一一对应
- ❌ 严禁瞎编：不臆造文案、不虚构字体、不发明不存在的样式
- ❌ 严禁猜测：数据缺失时必须回查或向用户确认

## 前置检查

在读取任何文档前，先从用户消息中提取：
1. Figma URL / fileKey / nodeId
2. 产出物类型（页面 / 组件 / 修改）
3. 产出物地址（目标目录）
4. 是否涉及新接口

## Figma MCP 工具白名单

- mcp__figma__get_design_context → 主用，拿参考代码 + 截图 + tokens
- mcp__figma__get_metadata → 拿结构总览
- mcp__figma__get_variable_defs → 拿设计变量
- mcp__figma__download_assets → 下载图片资产

## 工具黑名单（禁止写回 Figma）

- ❌ mcp__figma__use_figma
- ❌ mcp__figma__create_new_file
- ❌ mcp__figma__upload_assets

## 执行流程

1. 前置信息提取，只对缺失项询问
2. 读取项目规则（tech-stack / forbidden / naming / checklist）
3. 拉取 Figma 上下文
4. 资产强制门禁：图片必须先下载到本地
5. 布局转换：AutoLayout → Flex，绝对定位谨慎使用
6. 按 create-page / create-component 规范落地
7. 对照 checklist 自检
```

### 6.3 关键设计决策

**① 只读单向流**：Skill 严格限定为"Figma → 代码"单向，禁用所有写回 Figma 的工具。避免 AI 手滑把设计稿改坏。

**② 前置信息收敛**：一次性问齐"Figma URL / 产出物类型 / 目标路径 / 是否有新接口"，不多轮追问。已提供的字段**回显给用户校验**，避免解析错误往下传导。

**③ 资产强制门禁**：这条是血泪教训——**图片没下载到本地前，不允许开始写 JSX**。否则 AI 会脑补图片路径、脑补 `import` 语句、脑补 `<img src="xxx" />`，最后跑起来全是 404。

**④ UI 文案禁止抽 constant**：从 Figma 抓来的页面标题、按钮文案、卡片描述，**必须内联到 JSX**。抽到 `constant.js` 会破坏"设计稿 ↔ 代码"的可追溯性，改文案还得跳两个文件。constant 只放：枚举、正则、接口固定参数、状态码映射。

**⑤ 参考代码必须适配栈**：Figma MCP 返回的是 React + Tailwind，Skill 会强制要求改写成项目的技术栈（React + SCSS + antd-mobile-v2 + MobX）。

### 6.4 分层的 Supporting Files

`SKILL.md` 只是入口，具体细节拆到子文档里，**按需读取**，避免上下文爆炸：

```
.claude/skills/figma-to-code/
├── SKILL.md ← 入口，300 行以内
└── figma-workflow/
    ├── figma-context-fetch.md ← 怎么调 MCP 拉数据
    ├── design-token-mapping.md ← Figma 变量 → 项目值
    ├── asset-handling.md ← 图片下载 & 落地目录
    ├── layout-to-react.md ← 布局转 JSX 的规则
    └── figma-checklist.md ← 交付前自检清单
```

AI 拿到任务后，会**根据当前阶段只读相关文档**，比如"正在处理图片"就只读 `asset-handling.md`，节省上下文。

### 6.5 多项目复用

我在**微信小程序、微信公众号、外部渠道 H5** 三个项目里都装了这套 skill，只需要根据各自技术栈微调：

- 小程序：把"React + SCSS"换成"Taro + SCSS"，把 antd-mobile 换成 Taro UI；

- 公众号（H5）：完全复用；

- 渠道 H5：完全复用，只调整了资产目录路径。

**核心结构不变，差异只在"目标技术栈映射"这一节**。这就是 Skill 的价值——**规范可迁移**。

## 七、迭代提效：如何持续提高生成正确率

Skill 不是一次写完就完事，我实际迭代了 5+ 版本，每版都是被"生成错的地方"逼出来的：

| 迭代版本 | 触发问题                                     | 解决方案                                |
| -------- | -------------------------------------------- | --------------------------------------- |
| v1       | AI 用 Tailwind 出代码                        | 在 skill 中显式禁用 Tailwind，强制 SCSS |
| v2       | AI 把 Figma 图层名当中文文案                 | 强调只用图层里的 Text 节点内容作为文案  |
| v3       | AI 把静态图片脑补成 `<img src="/xxx.png" />` | 加入"资产强制门禁"章节，图片必须先下载  |
| v4       | 复杂页面上下文爆炸                           | 拆分成子文档 + 按需读取                 |
| v5       | AI 把 UI 文案抽到 constant.js                | 明确"UI 文案禁止抽 constant"规则        |

**方法论**：每次 AI 生成出错，别急着骂 AI，去问自己——**"这个错误能不能靠一条规范杜绝？"** 能，就写进 skill。写不进的，说明是设计稿本身的问题，回过头去和 UI 对齐。

## 八、一个典型的工作流示例

以创建一个新页面为例，实际操作是这样的：

**第 1 步**：拿到 Figma URL 交给 Claude Code

```
帮我实现 Figma 页面：https://figma.com/design/xxx/xxx?node-id=1-2
路径：src/business/Wealth/NewProductDetail/
```

**第 2 步**：Claude 加载 `figma-to-code` skill，回显识别信息

```
已识别信息：
- Figma: fileKey=xxx, nodeId=1:2
- 产出物类型：页面
- 产出物地址：src/business/Wealth/NewProductDetail/
- 涉及新接口：待确认

如以上任意一项理解有误，请立即打断我。
```

**第 3 步**：调用 `mcp__figma__get_design_context` 拉设计稿上下文

**第 4 步**：如果节点数量太多 → 主动提出"页面拆成 3 个子组件，逐个生成"

**第 5 步**：下载所有图片资产到 `src/static/img/business/Wealth/NewProductDetail/`

**第 6 步**：按 `frontend-developer-create-page` 模板生成四文件（`index.jsx` / `useStore.js` / `constant.js` / `index.scss`）

**第 7 步**：对照 checklist 自检，输出交付清单

全程你只在必要时确认，AI 按规范执行，**生成结果稳定、可预期、可追溯**。

## 九、总结：让 AI 稳定输出的 5 条心法

1. **上游先做好**：Figma 图层分层 + 变量化，是一切自动化的前提；

2. **Token 拿对方式**：个人用 MCP 授权，团队用配置文件；

3. **图片必走矢量**：能画的别贴，贴的必下载；

4. **规范做成 Skill**：让规则变成 AI 能读的文档，比反复口头提醒有效 100 倍；

5. **复杂拆简单**：200K 上下文顶不住的时候，拆组件、分批跑，永远比"硬怼一整个页面"稳。

Figma 转 React 从来不是"AI 魔法"，而是**上游规范化 + 中间工具化 + 下游工程化**的系统工程。把这套流程跑顺，团队的页面开发效率能有 40%\~60% 的提升，且**代码质量不牺牲**。

## 十、写在最后

如果你也在做类似的探索，欢迎交流以下话题：

- 你们团队的 Figma 分层规范是怎么和 UI 对齐的？

- Skill 里还有哪些"必须约束、否则 AI 一定会犯"的坑？

- 除了 React，Taro / Vue / 鸿蒙 ArkTS 侧有没有类似的实践？

**AI 时代的前端提效，不是"让 AI 替你写代码"，而是"把你的规范教会 AI"**。共勉。
