# 文档处理类 Skills 模板

## 适用技能

适用于以文档读取、创建、编辑、转换、校验为核心的 skills：

- `doc-coauthoring`
- `docx`
- `pdf`
- `pptx`
- `xlsx`

## 分类特征

文档处理类 skill 的共同特征：

1. 输入通常是现有文档、结构化内容、表格数据、图片或用户说明。
2. 输出通常是 `.docx`、`.pdf`、`.pptx`、`.xlsx` 或结构化文档草稿。
3. 强调格式保真、文件可打开、内容完整、元数据和样式一致。
4. 常需要借助脚本完成拆包、转换、校验、表单识别或内容提取。
5. 修改已有文件时，需要明确修改范围，避免破坏原始结构。

## 典型目录结构

```text
document-skill/
├── SKILL.md
├── LICENSE.txt
├── scripts/
│   ├── office/
│   │   ├── unpack.py
│   │   ├── pack.py
│   │   └── validate.py
│   ├── templates/
│   │   └── document-part.xml
│   └── helpers/
└── examples/
```

## 输入输出定义模板

```markdown
## Inputs

- Source file: {{输入文件路径或无}}
- Target format: {{docx/pdf/pptx/xlsx/markdown}}
- Content requirements: {{内容要求}}
- Formatting requirements: {{样式、页眉页脚、目录、表格、图表等}}
- Edit scope: {{允许修改的范围}}
- Validation requirements: {{如何验收}}

## Outputs

- Output file: {{输出文件路径}}
- Summary: {{修改或生成内容摘要}}
- Validation result: {{校验结果}}
```

## `SKILL.md` 推荐结构

```markdown
---
name: document-skill-name
description: Use this skill whenever the user wants to create, read, edit, convert, validate, or manipulate {{document-type}} files.
license: Complete terms in LICENSE.txt
---

# Document Processing Skill

## Overview

## Quick Reference

## Reading Existing Documents

## Creating New Documents

## Editing Existing Documents

## Conversion Workflow

## Validation Workflow

## Common Pitfalls

## Output Requirements
```

## 文档读取流程模板

```markdown
## Reading Workflow

1. 确认输入文件类型和目标信息。
2. 选择读取方式：文本提取、结构化解析、拆包读取或截图/OCR。
3. 保留必要的结构信息，例如标题层级、表格、批注、修订、表单字段。
4. 汇总用户需要的内容，不把无关原文全部展开。
5. 若后续要编辑，记录关键文件结构和可修改位置。
```

适用场景：

- 提取 Word/PDF/PPT/Excel 内容。
- 分析文档结构。
- 读取批注、修订、表单字段。
- 将文档内容重组为草稿。

## 文档创建流程模板

```markdown
## Creation Workflow

1. 明确目标格式、页面尺寸、样式规范和内容结构。
2. 选择创建工具或模板。
3. 生成基础文档结构。
4. 添加标题、正文、表格、图片、页眉页脚、目录或图表。
5. 输出文件。
6. 运行格式和可打开性校验。
7. 如校验失败，定位结构问题并修复。
```

创建类 skill 应特别关注：

- 页面大小和边距。
- 字体兼容性。
- 表格宽度和单元格设置。
- 图片尺寸和压缩。
- 目录、页码、书签、链接。
- 表格公式和数据刷新。

## 文档编辑流程模板

```markdown
## Editing Workflow

1. 备份或保留原始输入路径。
2. 明确用户允许修改的范围。
3. 解包或解析文档结构。
4. 定位目标节点、页面、段落、表格、字段或幻灯片。
5. 执行最小范围修改。
6. 重新打包或导出。
7. 验证文件可打开、格式未被意外破坏。
8. 向用户说明修改内容和输出位置。
```

编辑类 skill 应避免：

- 无范围地全文替换。
- 破坏 XML namespace、relationship、content type。
- 删除用户未要求修改的批注、修订或元数据。
- 忽略 Office、Google Docs、PDF 阅读器之间的兼容差异。

## 转换与校验流程模板

```markdown
## Conversion and Validation Workflow

1. 确认源格式和目标格式。
2. 选择转换链路，例如 Office 转 PDF、PDF 转图片、旧格式转新格式。
3. 执行转换。
4. 对输出文件进行可打开性、页数、关键内容和视觉检查。
5. 如输出用于机器处理，补充结构校验或字段校验。
6. 记录转换限制和可能的格式损失。
```

常见校验维度：

- 文件能否打开。
- 页数、工作表数、幻灯片数是否符合预期。
- 关键文本是否存在。
- 表格、图片、页眉页脚是否保留。
- 表单字段是否可填写。
- 批注和修订处理是否符合用户意图。

## 脚本资源模板

```text
document-skill/
└── scripts/
    ├── convert_to_images.py
    ├── extract_fields.py
    ├── fill_form.py
    ├── office/
    │   ├── unpack.py
    │   ├── pack.py
    │   └── validate.py
    └── templates/
        └── part.xml
```

脚本说明应写入 `SKILL.md`：

| 脚本 | 输入 | 输出 | 何时使用 |
|------|------|------|----------|
| `unpack.py` | Office 文档 | 解包目录 | 需要编辑内部 XML 时 |
| `pack.py` | 解包目录 | 新文档 | 修改 XML 后重建文档时 |
| `validate.py` | 输出文档 | 校验结果 | 生成或编辑后 |
| `extract_fields.py` | PDF | 字段清单 | 处理表单前 |

## 风险与兼容性检查

- [ ] 是否确认源文件类型和目标格式。
- [ ] 是否明确修改范围。
- [ ] 是否保留未要求修改的内容。
- [ ] 是否处理旧格式到新格式的转换。
- [ ] 是否考虑 Office、LibreOffice、Google Docs 或 PDF 阅读器兼容性。
- [ ] 是否验证输出文件可打开。
- [ ] 是否校验关键内容存在。
- [ ] 是否说明可能的格式损失。
- [ ] 是否避免把二进制内容或大段 XML 直接写入说明文档。

## 适用示例

### 示例 1：创建 Word 报告

```markdown
用户需求：生成一份带目录、页码、标题层级和表格的 .docx 报告。

流程：
1. 确认页面尺寸和样式。
2. 生成文档结构。
3. 添加目录、标题、正文、表格。
4. 输出并校验 .docx。
```

### 示例 2：填写 PDF 表单

```markdown
用户需求：把用户信息填入 PDF 表单。

流程：
1. 提取表单字段。
2. 映射用户数据。
3. 填写字段。
4. 生成验证图或检查字段值。
```

### 示例 3：协作文档草稿

```markdown
用户需求：共同起草技术方案。

流程：
1. 收集目标读者、背景、决策点。
2. 生成结构化草稿。
3. 迭代修改。
4. 验证文档对读者是否清晰。
```
