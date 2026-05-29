# Skill 通用结构模板

## 适用范围

本文档适用于所有 Claude skill 的创建、重构和评估。无论 skill 面向设计创作、文档处理、开发工具、测试验证还是沟通写作，都应优先复用这里的通用结构。

## 标准目录结构

```text
<skill-name>/
├── SKILL.md                 # 必备，skill 元信息与核心执行说明
├── LICENSE.txt              # 推荐，记录许可或使用条款
├── templates/               # 可选，放置可复制的模板文件
├── scripts/                 # 可选，放置确定性脚本和工具
├── reference/               # 可选，放置长文档、规范、分语言指南
├── examples/                # 可选，放置示例输入、示例输出、示例流程
├── assets/                  # 可选，放置静态资源、HTML、图片、字体
├── themes/                  # 可选，放置主题文件
└── core/                    # 可选，放置可复用核心逻辑
```

目录设计原则：

- `SKILL.md` 只放触发、判断、流程和关键约束。
- 大段参考资料放入 `reference/`。
- 可运行或可复用的确定性逻辑放入 `scripts/` 或 `core/`。
- 可复制起步文件放入 `templates/`。
- 示例和样例输出放入 `examples/`。

## `SKILL.md` Frontmatter 模板

```yaml
---
name: skill-name
description: Use this skill when ...
license: Complete terms in LICENSE.txt
---
```

字段要求：

| 字段 | 要求 | 示例 |
|------|------|------|
| `name` | 使用小写中划线，保持唯一 | `webapp-testing` |
| `description` | 同时描述能力、触发场景、边界 | `Use this skill when the user wants to test local web applications...` |
| `license` | 指向许可文件或说明条款位置 | `Complete terms in LICENSE.txt` |

## `SKILL.md` 正文通用骨架

```markdown
# Skill Title

## Overview

说明 skill 的目标、适用场景、核心产物和总体工作方式。

## When to use this skill

列出典型触发场景、用户表达和不适用场景。

## Inputs

说明需要用户提供哪些信息、文件、约束或上下文。

## Workflow

1. 识别任务类型。
2. 收集必要输入。
3. 加载必要资源。
4. 执行核心流程。
5. 验证输出结果。
6. 向用户交付结果。

## Resources

说明何时读取 `templates/`、`scripts/`、`reference/`、`examples/` 等资源。

## Output format

定义最终回复、文件、报告或产物的结构。

## Validation

说明如何检查结果正确性、完整性和风险。

## Constraints

说明限制条件、安全边界、兼容性和禁止事项。
```

## `description` 触发描述写法

`description` 是 skill 的主要触发入口，应尽量包含以下信息：

1. skill 能做什么。
2. 用户出现哪些表达时应使用。
3. 典型任务类型。
4. 不应使用的边界。
5. 如有必要，强调即使用户没有直接说出 skill 名称，也应该触发。

推荐模板：

```yaml
description: Use this skill whenever the user wants to <核心目标>. Triggers include <关键词/场景>. Also use when <相邻场景>. Do NOT use for <排除场景>.
```

## 资源目录设计规范

| 目录 | 放置内容 | 适用场景 |
|------|----------|----------|
| `templates/` | 起始代码、HTML、XML、文档片段 | 需要复制或生成基础文件 |
| `scripts/` | Python、Shell、JS 等脚本 | 需要确定性处理、校验、转换 |
| `reference/` | 规范、长指南、API 文档摘要 | `SKILL.md` 过长或按场景加载 |
| `examples/` | 示例输入、示例输出、示例流程 | 示例驱动的写作、测试、沟通 |
| `assets/` | 静态资源、HTML、图片、字体 | 产物需要复用资源 |
| `themes/` | 主题配置、主题说明 | 视觉或文档主题复用 |
| `core/` | 可复用程序模块 | 复杂工具链或生成器内部逻辑 |

## 脚本目录设计规范

`scripts/` 适合承载可重复、可验证、确定性的任务，例如：

- 文档拆包、打包、格式校验。
- PDF 表单字段检测与填充。
- Office XML schema 校验。
- MCP server 连接检查与评估。
- 测试自动化示例脚本。

脚本设计建议：

1. 脚本职责单一，文件名表达动作。
2. 在 `SKILL.md` 中明确何时调用脚本。
3. 说明输入文件、输出文件和失败处理方式。
4. 不把脚本源码大段复制进 `SKILL.md`。

## 示例与参考文档设计规范

`examples/` 与 `reference/` 的边界：

| 目录 | 重点 | 示例 |
|------|------|------|
| `examples/` | 教模型模仿格式和场景 | 沟通模板、测试脚本、样例输出 |
| `reference/` | 提供系统性知识和长指南 | MCP 最佳实践、语言实现指南、schema 说明 |

当内容具有“可模仿性”时放入 `examples/`；当内容具有“可查询性”时放入 `reference/`。

## 校验清单

- [ ] 是否存在 `SKILL.md`。
- [ ] `name` 是否唯一且使用小写中划线。
- [ ] `description` 是否包含触发场景和边界。
- [ ] 是否把长参考内容拆出 `SKILL.md`。
- [ ] 是否把确定性逻辑放入脚本或核心模块。
- [ ] 是否说明输入、输出和验证方式。
- [ ] 是否避免复制大段许可证或无关源码。
- [ ] 是否能让模型按需加载资源，而不是一次性读取全部内容。

## 可复制模板

```markdown
---
name: {{skill-name}}
description: Use this skill whenever the user wants to {{core-capability}}. Triggers include {{trigger-phrases}}. Also use when {{related-contexts}}. Do NOT use for {{excluded-contexts}}.
license: Complete terms in LICENSE.txt
---

# {{Skill Title}}

## Overview

{{说明 skill 的核心目标、适用用户和主要产物。}}

## Inputs

- {{输入 1}}
- {{输入 2}}
- {{约束或上下文}}

## Workflow

1. {{识别任务类型}}
2. {{收集必要输入}}
3. {{加载必要资源}}
4. {{执行核心处理}}
5. {{验证输出}}
6. {{交付结果}}

## Resources

| 资源 | 何时使用 |
|------|----------|
| `templates/` | {{使用时机}} |
| `scripts/` | {{使用时机}} |
| `reference/` | {{使用时机}} |
| `examples/` | {{使用时机}} |

## Output format

{{定义最终产物或回复结构。}}

## Validation

- [ ] {{校验项 1}}
- [ ] {{校验项 2}}

## Constraints

- {{限制条件}}
- {{安全边界}}
```
