# 设计创作类 Skills 模板

## 适用技能

适用于以视觉、设计、艺术生成、主题和 Web 产物为核心的 skills：

- `algorithmic-art`
- `brand-guidelines`
- `canvas-design`
- `frontend-design`
- `slack-gif-creator`
- `theme-factory`
- `web-artifacts-builder`

## 分类特征

设计创作类 skill 的共同特征：

1. 用户输入通常包含主题、受众、风格、场景或产物类型。
2. 输出强调视觉质量、创意方向、审美一致性和可交付性。
3. 可能包含字体、主题、图像、HTML、CSS、React、GIF、Canvas 或生成艺术代码。
4. 常需要先做风格决策，再进入实现。
5. 结果需要人工审美判断和技术验证共同确认。

## 典型目录结构

```text
design-skill/
├── SKILL.md
├── LICENSE.txt
├── templates/          # 生成器、HTML 预览、起步代码
├── themes/             # 主题定义
├── assets/             # 字体、图片、静态资源
├── canvas-fonts/       # 画布设计字体资源
└── core/               # 图像/GIF/动画生成核心逻辑
```

## `SKILL.md` 推荐结构

```markdown
---
name: design-skill-name
description: Use this skill when the user asks to create visual designs, UI, artifacts, themes, generative art, posters, GIFs, or brand-aligned assets.
license: Complete terms in LICENSE.txt
---

# Design Skill Title

## Overview

## Design Thinking

## Inputs

## Style Decision Process

## Generation Workflow

## Resource Usage

## Output Requirements

## Quality Checklist

## Constraints
```

## 设计输入模板

设计创作类 skill 应主动提取或补齐以下输入：

| 输入项 | 说明 | 示例 |
|--------|------|------|
| 产物类型 | 最终要生成什么 | 海报、网页、React 组件、GIF、主题、Canvas 图 |
| 使用场景 | 产物被谁在什么地方使用 | Slack 表情、品牌页、汇报封面、互动页面 |
| 受众 | 面向谁 | 内部员工、投资人、消费者、开发者 |
| 风格方向 | 审美语气 | 极简、复古未来、工业风、杂志感、奢华、童趣 |
| 内容素材 | 文案、数据、图片、品牌限制 | 标题、副标题、Logo、配色、产品信息 |
| 技术约束 | 框架、格式、尺寸、平台 | React、HTML、PNG、PDF、Slack GIF 限制 |
| 验证方式 | 如何判断结果可用 | 可运行、尺寸合规、视觉统一、文件可打开 |

## 风格决策模板

在实现前先做明确风格决策：

```markdown
## Style Decision

- **Concept**: {{一句话说明设计概念}}
- **Tone**: {{视觉语气}}
- **Typography**: {{字体或字体类型}}
- **Color System**: {{主色、辅助色、强调色}}
- **Composition**: {{布局方式}}
- **Motion / Interaction**: {{动画或交互策略}}
- **Memorable Detail**: {{最有记忆点的设计元素}}
```

决策原则：

1. 不使用泛化、无差异的默认风格。
2. 视觉语言要服务用户场景。
3. 同一产物内颜色、字体、动效和版式保持一致。
4. 创意强度要匹配产物目标，避免为炫技牺牲可读性。

## 资源目录模板

```text
design-skill/
├── templates/
│   ├── generator_template.js
│   └── viewer.html
├── themes/
│   ├── modern-minimalist.md
│   └── tech-innovation.md
├── assets/
│   ├── preview.html
│   └── texture.png
└── core/
    ├── frame_composer.py
    └── validators.py
```

资源使用建议：

- 生成艺术或 Canvas 产物优先使用 `templates/` 提供起点。
- 主题复用优先读取 `themes/` 中与场景匹配的主题。
- 动态图或复杂生成器可把帧合成、校验逻辑放入 `core/`。
- 字体资源应和授权说明一起维护。

## 生成流程模板

```markdown
## Workflow

1. 识别产物类型和交付格式。
2. 提取用户提供的主题、受众、平台和尺寸限制。
3. 做风格决策，明确视觉概念。
4. 选择必要资源：模板、主题、字体、核心模块。
5. 生成可运行或可打开的产物。
6. 验证产物：尺寸、格式、视觉一致性、平台限制。
7. 向用户说明产物位置、使用方式和可调整项。
```

## 质量检查清单

- [ ] 是否明确产物类型和使用平台。
- [ ] 是否有清晰、可描述的风格方向。
- [ ] 是否避免默认化、模板化、无场景感的视觉语言。
- [ ] 字体、颜色、空间、动效是否一致。
- [ ] 是否声明并遵守尺寸、格式、平台限制。
- [ ] 若生成代码，是否能运行或预览。
- [ ] 若生成图片/GIF/PDF，是否能打开且符合目标格式。
- [ ] 若使用品牌规范，是否遵守品牌色、字体和视觉边界。
- [ ] 若使用字体或静态资源，是否考虑授权说明。

## 适用示例

### 示例 1：生成艺术类

```markdown
用户需求：生成一张带 seeded randomness 的粒子流场艺术图。

适用模板：
- 读取 `templates/generator_template.js`
- 定义随机种子、参数范围和导出方式
- 输出可预览的 HTML 或图片
```

### 示例 2：品牌视觉类

```markdown
用户需求：把现有汇报页面调整为公司品牌风格。

适用模板：
- 读取品牌色和字体规则
- 提取页面用途与受众
- 输出品牌一致的视觉调整建议或实现
```

### 示例 3：Web Artifact 类

```markdown
用户需求：构建一个带状态管理和组件库的复杂交互页面。

适用模板：
- 确认是否需要路由、状态、组件库
- 使用 Web Artifact 构建流程
- 验证交互、布局和运行结果
```
