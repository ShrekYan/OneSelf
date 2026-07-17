---
name: frontend-doc
description: 前端项目文档生成规范，定义组件、页面、API 的文档编写规则。在需要为前端项目生成或检查组件 README、页面文档、API 注释和代码注释时使用。
license: Complete terms in LICENSE.txt
---

# 前端项目文档生成规范

## Overview

本 skill 定义了前端项目中文档的生成规范，覆盖组件 README、页面模块文档、API 类型注释和代码注释等场景，确保代码可读性和可维护性，为 AI 执行提供清晰指引。

## 文档类型定位

| 文档类型 | 存放位置 | 适用场景 |
|----------|----------|----------|
| 组件文档 | `apps/web/src/components/ComponentName/README.md` | **公共可复用组件必须写** |
| 页面文档 | `apps/web/src/pages/PageName/README.md` | **仅复杂业务页面需要**，简单页面不用写 |
| API/Hook | JSDoc 注释写在代码中 | 所有导出的 API 接口、自定义 Hook、工具函数 |

## When to use this skill

- 需要为公共组件编写 `README.md` 时
- 需要为复杂业务页面编写说明文档时
- 需要为 API 接口、自定义 Hook、工具函数添加 JSDoc 注释时
- 需要检查或补充 JSX 注释时
- 需要统一项目文档风格时

## Inputs

- 需要生成文档的组件、页面或 API 路径
- 现有代码结构和技术栈信息
- 用户特殊文档要求或约束

## Workflow

1. 识别文档类型（组件、页面、API、注释）
2. 读取对应模板或参考文档
3. 收集代码中的 Props、类型、方法、依赖等信息
4. 按照规范生成或补充文档
5. 对照检查清单验证文档完整性
6. 输出文档文件或修改建议

## Resources

| 资源 | 何时使用 |
|------|----------|
| [templates/component-readme-template.md](templates/component-readme-template.md) | 为公共组件生成 README 时 |
| [templates/page-readme-template.md](templates/page-readme-template.md) | 为复杂页面生成说明文档时 |
| [reference/code-comment-guidelines.md](reference/code-comment-guidelines.md) | 需要编写 JSDoc、JSX 注释时 |
| [reference/api-documentation-guidelines.md](reference/api-documentation-guidelines.md) | 需要为 API 接口添加类型和注释时 |
| [reference/writing-principles.md](reference/writing-principles.md) | 需要把握文档编写原则时 |

## Output format

根据文档类型输出：
- 组件 README 文件内容
- 页面模块 README 文件内容
- API 类型与 JSDoc 注释
- 代码注释补充建议
- 文档检查报告

文档输出位置：
- 组件文档：`apps/web/src/components/ComponentName/README.md`
- 页面文档：`apps/web/src/pages/PageName/README.md`
- API/Hook 注释：直接写入对应源码文件

## Validation

生成或检查文档后，对照以下清单确认：

| 检查项 | 组件 | 页面 | API | JSX |
|--------|:----:|:----:|:---:|:---:|
| 是否有一句话功能描述 | ✅ | ✅ | - | - |
| Props/参数是否完整说明 | ✅ | - | ✅ | - |
| 是否提供了可运行的使用示例 | ✅ | - | - | - |
| 是否说明了需要注意的特殊情况 | ✅ | ✅ | - | - |
| 复杂逻辑是否有说明 | - | ✅ | - | ✅ |
| 是否删除了过时的注释 | - | - | ✅ | ✅ |
| 是否没有多余的废话注释 | - | - | ✅ | ✅ |

## Constraints

- 组件文档必须位于组件目录下的 `README.md`
- 只有复杂业务页面才需要单独编写页面 README
- API 文档通过 TypeScript 类型 + JSDoc 实现，不单独建文件
- 禁止在 JSX 中使用 `//` 或 `/* ... */` 注释
- 示例代码必须是最简可运行版本
- 修改代码后必须同步更新文档
