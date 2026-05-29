# Skills 分类结构化模板总览

## 背景

本文档基于 `/tmp/skills` 的目录结构扫描结果，抽离 Claude skills 的分类结构化模板。目标是把现有 skills 的目录组织、`SKILL.md` 元信息、资源目录和执行流程沉淀为可复用的模板体系，便于后续新增、改造或评估 skills。

## 扫描范围

本次扫描范围包含：

```text
/tmp/skills
/tmp/skills/skills
```

核心输入目录为 `/tmp/skills/skills`，其中包含 17 个 skill 目录。

## 原始目录概览

```text
/tmp/skills/
├── .claude-plugin/
├── skills/
├── template/
├── README.md
└── THIRD_PARTY_NOTICES.md
```

`/tmp/skills/skills` 下包含：

- `algorithmic-art`
- `brand-guidelines`
- `canvas-design`
- `claude-api`
- `doc-coauthoring`
- `docx`
- `frontend-design`
- `internal-comms`
- `mcp-builder`
- `pdf`
- `pptx`
- `skill-creator`
- `slack-gif-creator`
- `theme-factory`
- `web-artifacts-builder`
- `webapp-testing`
- `xlsx`

## 通用目录结构

多数 skill 遵循以下结构：

```text
<skill-name>/
├── SKILL.md
├── LICENSE.txt
├── templates/     # 可选，放置代码、HTML、XML、文档片段等模板
├── scripts/       # 可选，放置确定性处理脚本和辅助工具
├── reference/     # 可选，放置较长参考文档或分语言指南
├── examples/      # 可选，放置示例输入、示例流程或输出样例
├── assets/        # 可选，放置 HTML、图片、字体、静态资源
├── themes/        # 可选，放置主题配置或主题文档
└── core/          # 可选，放置可复用核心逻辑
```

## `SKILL.md` 通用 Frontmatter

所有正式 skill 均以 YAML frontmatter 开头，常见字段如下：

```yaml
---
name: skill-name
description: skill trigger and capability description
license: Complete terms in LICENSE.txt
---
```

字段含义：

| 字段 | 是否常见 | 用途 |
|------|----------|------|
| `name` | 必备 | skill 唯一标识，通常使用小写中划线命名 |
| `description` | 必备 | 描述 skill 能力、触发场景和不适用边界 |
| `license` | 常见 | 指向 `LICENSE.txt` 或说明完整许可条款位置 |

## 分类原则

分类时优先依据以下维度：

1. skill 的主要产出类型：文档、界面、图像、测试结果、开发工具等。
2. `SKILL.md` 的执行流程：创作型、处理型、开发型、验证型、写作型。
3. 资源目录模式：是否依赖 `scripts/`、`templates/`、`reference/`、`examples/`、`themes/`、`core/`。
4. 触发描述语义：用户在什么场景下应该调用该 skill。

## 分类总表

| 分类 | 技能目录 | 核心用途 | 主要资源类型 | 推荐模板文件 |
|------|----------|----------|--------------|--------------|
| 设计创作类 | `algorithmic-art`、`brand-guidelines`、`canvas-design`、`frontend-design`、`slack-gif-creator`、`theme-factory`、`web-artifacts-builder` | 视觉设计、艺术生成、品牌规范、主题、Web UI、视觉资产生成 | `templates/`、`canvas-fonts/`、`themes/`、`core/` | `skills-template-design-creative.md` |
| 文档处理类 | `doc-coauthoring`、`docx`、`pdf`、`pptx`、`xlsx` | Office/PDF/协作文档的读取、创建、编辑、转换和校验 | `scripts/`、`scripts/templates/`、Office XML schema、表单脚本 | `skills-template-document-processing.md` |
| 开发工具类 | `claude-api`、`mcp-builder`、`skill-creator` | API 指南、MCP 开发、skill 创建评估、多语言参考、工具链 | `reference/`、`scripts/`、`assets/`、多语言文档 | `skills-template-development-tools.md` |
| 测试与通信类 | `webapp-testing`、`internal-comms` | Web 应用测试、自动化验证、内部沟通模板生成 | `examples/`、测试脚本示例、写作样例 | `skills-template-testing-communications.md` |

## 分类文件索引

| 文件 | 说明 |
|------|------|
| `skills-template-common-structure.md` | 所有 skills 共用的目录、frontmatter、正文骨架和校验清单 |
| `skills-template-resource-patterns.md` | `templates/`、`scripts/`、`reference/`、`examples/` 等资源目录模式 |
| `skills-template-design-creative.md` | 设计创作类 skills 的结构化模板 |
| `skills-template-document-processing.md` | 文档处理类 skills 的结构化模板 |
| `skills-template-development-tools.md` | 开发工具类 skills 的结构化模板 |
| `skills-template-testing-communications.md` | 测试与通信类 skills 的结构化模板 |

## 后续维护建议

1. 新增 skill 前，先判断其主产物类型，再选择对应分类模板。
2. 如果 `SKILL.md` 超过 500 行，应把长参考内容拆入 `reference/` 或 `examples/`。
3. 确定性、重复性、格式转换类逻辑优先放入 `scripts/`。
4. 大型静态资源、字体、主题文件应与执行说明分离，避免 `SKILL.md` 过长。
5. 每个分类文档应定期回查实际 skill 目录，防止模板与真实结构脱节。
