# Skills 资源目录模式

## 适用范围

本文档抽离 `/tmp/skills/skills` 中出现的资源目录模式，用于指导 skill 如何拆分 `SKILL.md` 之外的模板、脚本、参考资料、示例、主题和静态资源。

## 资源目录总览

| 资源模式 | 已观察示例 | 适用场景 |
|----------|------------|----------|
| `templates/` | `algorithmic-art/templates/` | 提供生成器、HTML、XML 或文档片段模板 |
| `scripts/` | `docx/scripts/`、`pdf/scripts/`、`pptx/scripts/`、`mcp-builder/scripts/` | 提供确定性处理、校验、转换、评估工具 |
| `scripts/templates/` | `docx/scripts/templates/` | 脚本内部使用的 XML 或结构片段 |
| `reference/` | `mcp-builder/reference/` | 长文档、最佳实践、分语言实现指南 |
| `examples/` | `internal-comms/examples/`、`webapp-testing/examples/` | 示例驱动的写作、测试或输出格式模仿 |
| `themes/` | `theme-factory/themes/` | 可复用主题定义 |
| `assets/` | `skill-creator/assets/` | 静态展示、评估报告模板或资源文件 |
| `core/` | `slack-gif-creator/core/` | 可复用核心逻辑模块 |
| `canvas-fonts/` | `canvas-design/canvas-fonts/` | 设计产物使用的字体和授权说明 |

## `templates/` 模式

`templates/` 用于保存可直接复制、填充或改造的模板文件。

典型用途：

- 代码生成起点。
- HTML 预览页。
- XML 片段。
- 文档骨架。
- 配置文件骨架。

推荐结构：

```text
<skill-name>/
└── templates/
    ├── base_template.ext
    ├── preview.html
    └── config_template.json
```

`SKILL.md` 中应说明：

- 模板文件解决什么问题。
- 何时复制模板，何时只参考模板。
- 哪些占位符需要替换。
- 生成后如何验证。

## `scripts/` 模式

`scripts/` 用于保存确定性、重复性或难以稳定由自然语言完成的处理逻辑。

典型用途：

- Office 文档拆包、打包、校验。
- PDF 表单检测、字段填充、图像转换。
- 评估数据生成。
- 自动化测试辅助。

推荐结构：

```text
<skill-name>/
└── scripts/
    ├── validate.py
    ├── convert.py
    ├── helpers/
    └── requirements.txt
```

脚本使用规则：

1. 在 `SKILL.md` 中明确脚本的输入、输出和调用时机。
2. 对 destructive 或覆盖型脚本说明风险。
3. 对外部依赖写入 `requirements.txt` 或等价说明。
4. 把复杂 schema、helper、validator 拆入子目录。

## `examples/` 模式

`examples/` 用于让 skill 学习格式、语气、流程或操作方式。

典型用途：

- 内部沟通写作样例。
- Web 自动化测试脚本样例。
- 输出报告格式样例。
- 用户场景分类样例。

推荐结构：

```text
<skill-name>/
└── examples/
    ├── scenario-a.md
    ├── scenario-b.md
    └── automation-example.py
```

适合放入 `examples/` 的内容通常具有“可模仿性”，而不是完整规范。

## `reference/` 模式

`reference/` 用于保存较长、按需加载的知识文档。

典型用途：

- 协议规范摘要。
- SDK 使用指南。
- 语言特定实现方式。
- 评估规范。
- 最佳实践。

推荐结构：

```text
<skill-name>/
└── reference/
    ├── best_practices.md
    ├── python_guide.md
    ├── node_guide.md
    └── evaluation.md
```

`SKILL.md` 应提供读取指引，例如“开发 Python 实现时读取 `reference/python_guide.md`”。

## `themes/` 模式

`themes/` 用于保存可复用视觉或文档主题。

典型用途：

- 色彩系统。
- 字体组合。
- 页面/幻灯片/报告视觉风格。
- 按主题命名的设计方案。

推荐结构：

```text
<skill-name>/
└── themes/
    ├── modern-minimalist.md
    ├── ocean-depths.md
    └── tech-innovation.md
```

主题文件应包含：

- 适用场景。
- 主色、辅助色、强调色。
- 字体建议。
- 布局和视觉语气。
- 禁止或避免事项。

## `assets/` 模式

`assets/` 用于保存静态资源或非核心逻辑文件。

典型用途：

- HTML 报告查看器。
- 图片、图标、字体。
- 可嵌入静态资源。
- 评估展示模板。

推荐结构：

```text
<skill-name>/
└── assets/
    ├── viewer.html
    ├── logo.svg
    └── style.css
```

## `core/` 模式

`core/` 用于保存可复用核心逻辑，通常比 `scripts/` 更像内部库。

典型用途：

- GIF 帧合成。
- 缓动函数。
- 构建器核心模块。
- 验证器核心模块。

推荐结构：

```text
<skill-name>/
└── core/
    ├── builder.py
    ├── validators.py
    └── helpers.py
```

选择 `core/` 的信号：

- 多个脚本或流程会复用同一套逻辑。
- 逻辑不是一次性命令，而是可组合模块。
- skill 需要较完整的内部工具库。

## 多语言文档模式

开发工具类 skill 可能按语言或运行时拆分参考资料，例如：

```text
<skill-name>/
├── reference/
│   ├── python_guide.md
│   ├── node_guide.md
│   └── evaluation.md
└── examples/
    ├── python_example.py
    └── node_example.ts
```

设计原则：

1. `SKILL.md` 负责选择语言和导航。
2. 每个语言文件只讲该语言需要的实现细节。
3. 通用概念放在 `best_practices.md` 或 `overview.md`。

## 字体与二进制资源模式

设计类 skill 可能包含字体或二进制资源，例如 `canvas-fonts/`。

建议：

- 字体文件与授权说明文件放在同一目录。
- `SKILL.md` 只列出字体选择原则，不嵌入字体清单全文。
- 使用字体前检查授权和产物场景。
- 二进制资源不应被复制进 Markdown 文档。

## 目录选择决策表

| 需要保存的内容 | 推荐目录 |
|----------------|----------|
| 可复制起步文件 | `templates/` |
| 可执行确定性流程 | `scripts/` |
| 脚本内部片段 | `scripts/templates/` |
| 长指南或规范 | `reference/` |
| 可模仿样例 | `examples/` |
| 主题定义 | `themes/` |
| 静态展示或资源 | `assets/` |
| 可复用内部库 | `core/` |
| 字体与授权说明 | `canvas-fonts/` 或 `assets/fonts/` |
