---
title: 自动化编排：Skills和Workflows到底选哪个？
slug: claude-code-workflow-or-skill
date: 2024-06-01
tags: [Claude Code, Workflows, Skills, 自动化编排]
---

# Claude Code 自动化编排：Skills 和 Workflows 到底选哪个？

当你的 Claude Code 项目越来越复杂，单个命令已经不够用了——你需要把多个步骤串起来，一次触发自动跑完。Claude Code 提供了两种编排方式：**Skills** 和 **Workflows**。本文用真实项目案例，帮你搞清楚它们的区别、各自的边界，以及什么时候该从 Skills 升级到 Workflows。

## 同一个目标，两条路

先说结论：**Skills 和 Workflows 目的完全一样** ——把多个步骤按顺序组织起来，一次触发，自动执行完，代替手动一步步操作。

区别在于**实现方式和可靠性**：

|              | Skills 编排                   | Workflows                  |
| ------------ | ----------------------------- | -------------------------- |
| **存放位置** | `.claude/skills/`             | `.claude/workflows/`       |
| **文件格式** | Markdown（自然语言）          | YAML（严格语法）           |
| **触发方式** | `/skill-name`                 | `/workflow run skill-name` |
| **执行原理** | Claude 读 Markdown 理解后执行 | 原生解析 YAML，精确执行    |

理解这个核心分歧后，剩下的差异都是它的延伸。

## 同一个审查流程，两种写法

先来看一个真实项目的对比。需求相同：**一键触发前端代码审查，按顺序跑完代码质量 → 安全 → 性能三个维度**。

### Skills 版本：Markdown 描述

```
---
name: full-frontend-review
description: 一键触发完整前端代码审查，自动顺序执行代码质量 → 安全 → 性能三个维度检查
---

# full-frontend-review

一键触发完整前端代码审查，编排器自动顺序执行三个专业 Agent：

1. **frontend-code-reviewer** - 代码质量审查（TypeScript 类型安全、React 最佳实践、项目规范检查）
2. **frontend-security-auditor** - 安全漏洞扫描（XSS、注入攻击、敏感信息泄露等）
3. **frontend-performance-expert** - 性能分析优化（React 19 + MobX 移动端 H5 性能优化）

**用户只需要触发一次**，编排器自动跑完整个流程，最后输出整合后的综合审查报告。

三个专项检查复用各自现有的检查清单：
- 代码质量 → `.claude/skills/frontend-code-review.md`
- 安全扫描 → `.claude/skills/frontend-security.md`
- 性能优化 → `.claude/skills/frontend-perf.md`

## 使用方法

/full-frontend-review [检查范围] [选项]

## 参数说明
- **检查范围**：要检查的文件或目录，不指定默认检查 `src/`
```

清晰、直观、好维护。三个步骤用编号列出来，参数用列表说明，Claude 读一遍就知道要做什么。

但注意几个问题：

- "复用各自现有的检查清单"——Claude 需要主动去读取那三个 `.md` 文件，有时会忘记

- 检查范围参数没有默认值约束，传什么都行，Claude 自己判断

### Workflows 版本：YAML 定义

```yaml
name: 前端代码审查
description: 自动化完整前端代码审查，按顺序执行：代码质量 → 安全漏洞 → 性能优化
inputs:
  - name: scope
    description: 审查范围 (changed: 仅变更文件 / all: 全项目)
    default: "changed"
    options: ["changed", "all"]

  - name: targetPath
    description: 目标路径（可选，例如 src/pages/Article）
    default: ""

steps:
  - name: 代码质量审查
    agent: frontend-code-reviewer-agent
    prompt: |
      审查范围：{{#if (eq scope "all")}}全项目前端代码{{else}}变更的前端文件{{/if}}
      {{#if targetPath}}
      限定路径：{{targetPath}}
      {{/if}}

  - name: 安全漏洞检查
    agent: frontend-security-auditor
    prompt: |
      检查范围：{{#if (eq scope "all")}}全项目前端代码{{else}}变更的前端文件{{/if}}

  - name: 性能优化分析
    agent: frontend-performance-expert-agent
    prompt: |
      分析范围：{{#if (eq scope "all")}}全项目前端代码{{else}}变更的前端文件{{/if}}
```

同一个需求，关键差异立刻体现：

- **参数是结构化的**：`scope` 只能选 `changed` 或 `all`，不存在第三种可能

- **每个步骤指定独立 agent**：三个 agent 各自专注，不会被前面的上下文污染

- **模板变量精确插入**：`{{scope}}` 不存在"AI 忘记传参"的问题

## 条件判断：最容易翻车的地方

假设你要实现：**提交代码时，如果后端文件有变更，就跑后端检查**。

### Skills 写法

````
## 执行步骤

1. 运行前端检查
2. 如果检测到 backend/ 目录有变更，请执行：
```bash
cd backend
npm run lint
npm run build
````

````

就这几行，写起来很舒服。但问题在于——"如果检测到"这四个字，Claude 要靠**自然语言理解**来判断。大部分时候没问题，偶尔它可能：

- 变更了 `backend/` 下一个文件但漏判

- 把 `frontend/backend/` 这种路径误判为后端变更

- 在上下文很长时跳过条件直接执行

### Workflows 写法

```yaml
steps:
  - name: 前端检查
    run: |
      npm run lint
      npx tsc --noEmit

  - name: 后端检查
    if: changed_files matches "^backend/"
    run: |
      cd backend
      npm run lint
      npm run build
````

`if: changed_files matches "^backend/"`——这是一个**精确的正则匹配**，不存在理解偏差。变更了就执行，没变更就跳过，100% 确定。

这就是两者最根本的差异：**Skills 靠 AI 理解，Workflows 靠语法保证**。

## 参数传递：从"靠 AI 记"到"结构化定义"

真实项目里，你经常需要传参数。比如代码审查要指定范围——查全项目还是只查变更文件。

### Skills 的参数困境

在 Markdown 里写参数，本质上是告诉 Claude："请帮我注意一下 scope 这个变量"。但 Claude 不一定能稳定地在你期望的位置插入正确的值，尤其是参数多、步骤长的时候。

### Workflows 的原生参数

直接看真实项目的写法：

```yaml
inputs:
  - name: scope
    description: 审查范围 (changed: 仅变更文件 / all: 全项目)
    default: "changed"
    options: ["changed", "all"]

  - name: targetPath
    description: 目标路径（可选，例如 src/article），指定后只审查该模块
    default: ""
```

然后在步骤里用模板语法引用：

```yaml
steps:
  - name: 代码规范检查
    agent: nestjs-code-review-agent
    prompt: |
      审查范围：{{#if (eq scope "all")}}全项目后端代码{{else}}变更的后端文件{{/if}}
      {{#if targetPath}}
      限定路径：{{targetPath}}
      {{/if}}
```

注意到了吗？这里同时用到了参数 + 条件逻辑 + Handlebars 模板语法。这种复杂度的逻辑，写在 Markdown 里让 Claude 理解和执行，出错的概率会显著上升。

## 子流程调用：编排的编排

Workflows 有一个 Skills 做不到的事：**一个 workflow 可以调用另一个 workflow 或指定 agent**。

看这个后端代码审查的例子：

```yaml
steps:
  - name: 代码规范检查
    agent: nestjs-code-review-agent
    prompt: |
      根据项目规范进行 NestJS 后端代码审查...

  - name: 安全漏洞扫描
    agent: nestjs-security-audit-agent
    prompt: |
      对 NestJS 后端代码进行安全漏洞扫描...

  - name: 性能检测
    agent: nestjs-performance-audit-agent
    prompt: |
      对 NestJS 后端进行性能检测...
```

三个步骤，每一步指定了不同的 **agent**（各有专长的 AI 角色），执行不同维度的审查。这比在一个 Markdown 文件里写"先做代码规范检查，再做安全扫描，再做性能检测"要精确得多——因为每个 agent 有自己的上下文和指令集，不会被前面步骤的上下文干扰。

如果用 Skills 实现，你得把所有检查逻辑塞在一个文件里，Claude 在长上下文下容易遗漏或混淆不同检查维度。

## 一个完整的 Workflow 长什么样

以"一键启动开发环境"为例，展示 Workflow 的全貌：

```yaml
name: 一键启动开发环境
description: 同时启动前端 H5 和后端 NestJS 开发服务
inputs:
  - name: environment
    description: 选择前端启动环境
    default: 'dev'
    options: ['dev', 'test-dev', 'sit-dev', 'prd-dev']

steps:
  - name: 检查依赖是否安装
    run: |
      if [ ! -d "node_modules" ]; then
        echo "⚠️ 前端 node_modules 未找到，请先运行: npm install"
        exit 1
      fi
      if [ ! -d "backend/node_modules" ]; then
        echo "⚠️ 后端 node_modules 未找到，请先运行: cd backend && npm install"
        exit 1
      fi

  - name: 启动后端服务
    run: |
      cd backend
      npm run start:dev &
      echo $! > /tmp/nest-dev-backend.pid
      cd ..

  - name: 启动前端服务
    run: |
      npm run {{environment}}
```

关键细节：

- `inputs` 定义了参数，带默认值和可选项

- 步骤间有依赖关系：先检查依赖 → 启动后端 → 启动前端

- `{{environment}}` 模板变量精确插入到命令中

- 信号处理和清理逻辑可以写在 shell 里

这个复杂度的流程，写成 Markdown 也能跑，但参数传递和环境选择的精确性就要打折扣了。

## 预提交检查：条件判断的实战场景

再看一个更贴近日常的例子——提交代码前的自动检查：

```yaml
steps:
  - name: 前端 ESLint 检查
    run: |
      npm run lint

  - name: 前端 TypeScript 类型检查
    run: |
      npx tsc --noEmit

  - name: 后端检查（条件执行）
    if: changed_files matches "^backend/"
    run: |
      cd backend
      npm run lint
      npm run build

  - name: 输出总结
    run: |
      echo "🎉 所有检查通过！"
```

这个 workflow 的精妙之处在于：**前端检查永远执行，后端检查只在有后端变更时才触发**。

如果你是全栈项目，每次提交只改了前端代码，后端检查自动跳过——省时间还不会因为无关检查报错阻塞提交。用 Skills 的自然语言条件判断，这种"只在特定条件下执行"的逻辑偶尔会翻车。

## 选择决策：不要纠结，按阶段来

| 阶段                       | 推荐方案      | 理由                                    |
| -------------------------- | ------------- | --------------------------------------- |
| 刚上手 Claude Code         | **Skills**    | 学习成本趋近于零，写 Markdown 就行      |
| 流程 ≤ 3 步，无条件分支    | **Skills**    | 这种复杂度下两者效果一样，Skills 更省事 |
| 需要条件判断 / 参数传递    | **Workflows** | 可靠性从"大概对"变成"一定对"            |
| 多 agent 协作 / 子流程调用 | **Workflows** | Skills 做不到，没有替代方案             |

一个务实的项目布局：

```
.claude/
├── skills/ ← 简单流程、入门阶段
│   ├── 专项技能/ ← 单项检查、单项功能
│   └── 编排流程/ ← 简单的多步编排
├── workflows/ ← 复杂流程、精确条件
│   ├── pre-commit-check.yml
│   ├── frontend-code-review.yml
│   ├── backend-code-review.yml
│   └── dev-startup.yml
└── docs/
```

两者不是非此即彼。简单的事用 Skills 快速搞定，复杂的事用 Workflows 保证可靠，按需混搭就好。

## 迁移路径：从 Skills 到 Workflows

如果你已经在用 Skills 编排，什么时候该迁移？信号很明确：

1. **条件判断出了问题** — AI 偶尔跳过或误执行某个条件步骤

2. **参数传递不稳定** — Claude 有时忘记传参或传错值

3. **步骤超过 5 步** — 长 Markdown 文件里 Claude 容易遗漏中间步骤

4. **需要调用其他 agent** — Skills 没有原生支持

迁移不需要一步到位。可以先保留 Skills 做简单编排，把有条件判断的部分拆成 Workflow。两种方式在同一个项目里共存完全没问题。

## 一句话

**目的相同，精度不同。简单入门 Skills 足够，复杂精确 Workflows 更好。**

别纠结"到底选哪个"——先用 Skills 跑起来，遇到可靠性瓶颈再升级到 Workflows，这是最务实的路径。
