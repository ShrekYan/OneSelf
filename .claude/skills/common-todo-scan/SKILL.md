---
name: common-todo-scan
description: 当用户需要扫描代码库中的 TODO/FIXME 注释时使用此技能。触发场景包括"扫描 TODO"、"查找 FIXME"、"检查待办"、"代码待办清单"、"TODO 清理"。也适用于审查代码技术债务时。不适用于通用代码搜索或文档生成。
license: Complete terms in LICENSE.txt
---

# TODO 扫描

## Overview

本 skill 用于扫描项目中的 TODO/FIXME/HACK/XXX/BUG 等注释标记，生成结构化的扫描报告。帮助开发者识别代码中的待办事项、技术债务和潜在问题，支持代码质量改进和技术债务管理。

## When to use this skill

典型触发场景：
- 用户要求扫描代码中的 TODO/FIXME 标记
- 用户要求查找项目中的待办事项
- 用户要求检查代码技术债务
- 用户要求生成 TODO 清理报告

不适用场景：
- 通用代码搜索
- 文档生成
- 代码修改或重构

## Inputs

- 项目根目录（可选，默认为当前工作目录）
- 扫描范围（可选，默认扫描整个项目）
- 排除规则（可选，默认使用内置排除目录）

## Workflow

1. **确认扫描范围**: 获取项目根目录和扫描路径
2. **加载参考规范**: 读取 [reference/scan-specification.md](reference/scan-specification.md) 了解搜索目标和排除规则
3. **执行搜索**: 使用 `rg` 工具搜索关键词
4. **解析结果**: 提取文件路径、行号、类型和内容
5. **按文件分组**: 相同文件的结果归为一组并排序
6. **生成报告**: 使用 [templates/todo-report-template.md](templates/todo-report-template.md) 生成结构化报告
7. **验证输出**: 检查报告完整性和格式正确性

## Resources

| 资源 | 何时使用 |
|------|----------|
| `templates/todo-report-template.md` | 生成扫描报告时使用 |
| `reference/scan-specification.md` | 需要了解搜索目标、排除目录、分类说明、执行步骤和输出要求时 |
| `examples/sample-report.md` | 需要参考示例输出格式时 |

## Output format

输出结构化的 TODO/FIXME 扫描报告，包含：
- 统计信息（扫描范围、发现条目总数）
- 待办清单（按文件路径排序，每个文件包含行号、类型、内容表格）
- 清理建议

参考 [examples/sample-report.md](examples/sample-report.md) 了解输出格式。

## Validation

- [ ] 是否正确识别所有关键词（TODO、FIXME、XXX、HACK、BUG）
- [ ] 是否正确排除了指定目录
- [ ] 文件路径是否为相对路径
- [ ] 是否显示行号
- [ ] 是否按文件分组并排序
- [ ] 是否统计了条目总数
- [ ] 是否处理了无结果和结果过多的情况

## Constraints

- 不扫描 `node_modules/`、`.git/`、`.claude/` 等目录
- 文件路径使用相对路径
- 内容过长时进行截断
- 结果超过 100 条时限制输出并提示
- 无结果时输出"未发现待办"说明
