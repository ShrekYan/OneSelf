---
name: workflow
description: 执行预定义的自动化工作流
---

# Workflow Execution Command

## 分类定位

面向 API 与 AI 服务开发的 command，聚焦于工作流编排、自动化任务执行和多步骤流程管理。

## Context

用户需要执行预定义的自动化工作流，位于 `.claude/workflows/` 目录下。重点关注生产就绪的架构、清晰的契约、健壮的验证、测试和可观测性。

## Requirements

## Instructions

### 1. Requirement and Contract Analysis
- 识别工作流名称和输入参数需求
- 定义输入/输出模式和错误契约
- 验证工作流定义存在

### 2. Architecture Design
- 分析工作流步骤序列
- 验证步骤依赖关系
- 检查输入参数完整性

### 3. Implementation Scaffold
- 按顺序执行工作流步骤
- 处理步骤间的数据传递
- 处理异常和回滚

### 4. Testing and Verification
- 定义单元测试场景
- 定义集成测试场景
- 验证工作流执行结果

### 5. Deployment and Operations
- 配置管理
- 健康检查
- 指标和追踪
- CI/CD 和回滚指南

## Output Format

Return:
- Service Summary
- Architecture
- Interface / Contract Definitions
- Implementation Scaffold
- Test Plan
- Deployment Notes
- Operational Checks

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