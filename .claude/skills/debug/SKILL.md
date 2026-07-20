---
name: debug
description: 诊断助手 - 错误日志分析、Bug 模式匹配、复现步骤生成、修复方案对比
user-invocable: true
license: Complete terms in LICENSE.txt
---

# 调试诊断助手

## 概述

诊断失败问题，识别根本原因，并提供有明确证据支持的针对性修复建议。

核心原则：

- 结论之前先找证据
- 通过具体信号重现或推理问题
- 生成多个假设
- 系统地排除假设
- 修复根本原因，而非症状
- 避免破坏性捷径

## 使用场景

以下用户表达应触发本 skill：

- "这个 API 返回 500，帮助调试"
- "React 页面点击提交后崩溃"
- "CI 构建突然失败"
- "找出为什么这个值变成 undefined"
- "分析微信小程序白屏问题"
- "诊断金额计算精度丢失问题"
- "错误日志分析"
- "Bug 诊断"
- "复现步骤生成"
- "排错"
- "调试"
- "错误分析"

## 输入要求

在执行诊断前，先收集以下信息。已有信息不重复询问，仅对缺失项提问。

| 字段 | 说明 |
|------|------|
| 错误堆栈 | 完整的异常堆栈或错误信息 |
| Bug 现象 | 实际表现与预期表现的差异 |
| 发生环境 | 浏览器/设备/系统版本/服务环境 |
| 复现概率 | 必现/偶现/特定条件触发 |
| 变更范围 | 相关的 Git 提交、文件列表或最近修改 |

## 工作流

1. **收集信息**：按「输入要求」获取错误堆栈、现象、环境、复现概率和变更范围
2. **初步定位**：使用 Grep 搜索错误关键词，定位到具体文件和代码行，分析上下文
3. **根因分析**：追踪调用链、检查依赖关系、识别竞态条件、验证数据流向。需要详细能力说明时参考 [reference/debug-guide.md](reference/debug-guide.md)
4. **方案输出**：按模板生成诊断报告、复现步骤或代码变更影响分析：
   - 错误诊断报告：[templates/error-diagnosis-report.md](templates/error-diagnosis-report.md)
   - 复现步骤：[templates/reproduction-steps.md](templates/reproduction-steps.md)
   - 代码变更影响分析：[templates/change-impact-analysis.md](templates/change-impact-analysis.md)
5. **预防建议**：提出如何避免类似问题、补充测试用例、代码审查要点

## 资源引用

| 资源 | 用途 |
|------|------|
| [reference/debug-guide.md](reference/debug-guide.md) | 详细能力说明、Bug 模式匹配表、修复方案对比表、知识库范围 |
| [templates/error-diagnosis-report.md](templates/error-diagnosis-report.md) | 生成错误诊断报告 |
| [templates/reproduction-steps.md](templates/reproduction-steps.md) | 生成问题复现步骤 |
| [templates/change-impact-analysis.md](templates/change-impact-analysis.md) | 生成代码变更影响分析 |
| [examples/example-interactions.md](examples/example-interactions.md) | 典型用户表达参考 |

## 输出格式

根据诊断目标选择对应模板：

- 针对具体错误：使用 [错误诊断报告模板](templates/error-diagnosis-report.md)
- 针对问题复现：使用 [复现步骤模板](templates/reproduction-steps.md)
- 针对变更影响：使用 [代码变更影响分析模板](templates/change-impact-analysis.md)

## 校验清单

任务完成前，必须输出 `Completion Checklist`。如某项不适用，标记为 `不适用` 并简要说明原因。

- [ ] 已明确本次任务目标，并完成用户要求的核心交付
- [ ] 已遵守当前 skill 的角色边界和工具权限
- [ ] 已读取与任务相关的必要项目规则、业务决策或上下文文件
- [ ] 已列出本次读取、修改、生成或重点分析的文件路径
- [ ] 已说明诊断范围、定位依据，并区分确定结论与推测结论
- [ ] 如执行验证：已列出验证命令和结果；如未执行验证：已说明原因
- [ ] 已标注遗留问题、风险点或需要用户确认的事项
- [ ] 最终结论清晰，可供用户直接决策或继续下一步

## 约束

- 需要时询问缺失的关键上下文
- 不提前猜测最终原因
- 记录证据
- 提出最小修复方案
- 建议回归测试
- 优先使用项目已有工具（Read、Glob、Grep）进行定位
