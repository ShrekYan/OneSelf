---
name: todo-scan
description: TODO 扫描命令，扫描项目中所有 TODO/FIXME/XXX 标记，整理输出待办清单
---

# Todo Scan Command

## 分类定位

面向数据与配置治理的 command，聚焦于项目待办事项扫描、配置检查和技术债务追踪。

## 适用场景

| 场景 | 描述 | 典型输出 |
| --- | --- | --- |
| TODO 扫描 | 扫描项目中所有 TODO/FIXME/XXX 标记 | 待办清单、统计报告 |
| 技术债务追踪 | 识别未完成的代码标记 | 债务清单、优先级排序 |
| 代码清理 | 发现需要修复的问题 | 清理建议、行动计划 |

## Context

用户需要扫描项目中所有的 TODO/FIXME/XXX 标记，整理输出结构化的待办清单，方便清理和追踪。

## Requirements

$ARGUMENTS

## Instructions

### 1. Scope Definition
- 定义扫描范围：项目根目录
- 排除不需要搜索的目录（node_modules, .git, .claude, dist, build 等）
- 确定搜索模式：TODO, FIXME, XXX

### 2. Scan Execution
- 使用 ripgrep 搜索项目中包含标记的所有行
- 收集结果：文件路径、行号、注释内容
- 按文件路径和优先级排序

### 3. Result Organization
- 统计总数和分类
- 按模块/文件分组
- 标注优先级（默认、紧急等）

### 4. Output and Recommendations
- 输出结构化清单
- 提供清理建议
- 给出处理优先级建议

## Output Format

Return:
- Scan Summary（扫描摘要）
- Todo Count（待办数量）
- Todo List（待办清单）
- Grouped Results（按文件分组的结果）
- Cleanup Recommendations（清理建议）

## 扫描配置

```yaml
scan_config:
  patterns:
    - TODO
    - FIXME
    - XXX
  exclude_dirs:
    - node_modules
    - .git
    - .claude
    - dist
    - build
  sort_by: path | priority | date
  output_format: detailed | summary
```

---

## 执行流程

1. 使用 ripgrep 搜索整个项目中包含 TODO/FIXME/XXX 的所有行
2. 排除不需要搜索的目录（node_modules, .git, .claude, dist, build 等）
3. 按文件路径排序整理结果
4. 统计总数，输出结构化清单
5. 显示文件路径、行号、注释内容
6. 给出清理建议

---

## 强制执行协议

请调用 Skill 工具执行 `common-todo-scan`，并将用户参数原样传入。规范入口：[common-todo-scan Skill](../skills/common-todo-scan/SKILL.md)。
