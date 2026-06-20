---
name: workflow
description: 执行预定义的自动化工作流
---

# Workflow Command

## 分类定位

面向 API/AI 服务开发的 command，聚焦于工作流编排、自动化任务执行和多步骤流程管理。

## 适用场景

| 场景 | 描述 | 典型输出 |
| --- | --- | --- |
| 自动化工作流 | 执行预定义的多步骤任务 | 工作流执行结果、状态报告 |
| 批量操作 | 批量处理多个文件或任务 | 处理结果汇总 |
| CI/CD 集成 | 集成持续集成流程 | 构建/测试结果 |

## Context

用户需要执行预定义的自动化工作流，位于 `.claude/workflows/` 目录下。

## Requirements

$ARGUMENTS

## Instructions

### 1. Workflow Selection
- 识别工作流名称
- 验证工作流定义存在
- 解析输入参数

### 2. Workflow Analysis
- 分析工作流步骤序列
- 验证步骤依赖关系
- 检查输入参数完整性

### 3. Execution
- 按顺序执行工作流步骤
- 处理步骤间的数据传递
- 处理异常和回滚

### 4. Result Compilation
- 汇总执行结果
- 生成状态报告
- 提供下一步建议

## Output Format

Return:
- Workflow Summary（工作流摘要）
- Execution Log（执行日志）
- Result Summary（结果汇总）
- Status（执行状态）
- Next Steps（下一步行动）

## 工作流定义格式

工作流使用 YAML 格式定义，位于 `.claude/workflows/<workflow-name>.yml`

支持：
- `inputs` - 定义用户输入参数
- `steps` - 定义执行步骤序列

详细格式请参考 Claude Code 工作流文档。

## 使用方式

```
/workflow <workflow-name>
```

**示例：**
- `/workflow xmind-exec` - 执行 XMind 自动化工作流
