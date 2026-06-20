---
name: search
description: 智能代码搜索 - 按功能、组件、调用链搜索全栈代码
---

# Search Command

## 分类定位

面向可观测性与调试的 command，聚焦于代码搜索、功能定位、调用链分析和代码理解。

## 适用场景

| 场景 | 描述 | 典型输出 |
| --- | --- | --- |
| 功能搜索 | 按功能描述搜索代码 | 相关文件、函数列表 |
| 组件搜索 | 按组件名称搜索 | 组件定义、使用位置 |
| 调用链分析 | 分析函数调用关系 | 调用路径、依赖关系 |
| 符号定位 | 查找变量、函数定义 | 定义位置、引用位置 |

## Context

用户需要搜索代码库，按功能、组件或调用链查找相关代码。

## Requirements

$ARGUMENTS

## Instructions

### 1. Search Query Analysis
- 解析搜索查询意图
- 确定搜索范围和类型
- 选择合适的搜索策略

### 2. Codebase Traversal
- 遍历代码库查找匹配内容
- 分析代码结构和依赖关系
- 收集相关代码片段

### 3. Result Organization
- 组织搜索结果
- 按相关性排序
- 提供上下文信息

### 4. Presentation
- 展示搜索结果
- 提供代码定位信息
- 支持进一步探索

## Output Format

Return:
- Search Summary（搜索摘要）
- Matching Files（匹配文件）
- Code Snippets（代码片段）
- Call Graph（调用图）
- Further Exploration（进一步探索建议）

## 搜索配置

```yaml
search_config:
  search_type: function | component | call_chain | symbol
  scope: frontend | backend | fullstack
  include_tests: true | false
  result_count: 10
```

---

## 强制执行协议

<!-- 🔴 🔴 🔴 最高优先级：必须首先执行工具调用 -->
<!-- 使用 Claude Code 原生 Agent 工具，100% 触发搜索专家 Agent -->

### ✅ 立即执行：调用搜索专家 Agent

**使用 `Agent` 工具**，参数如下：

| 参数 | 值 |
|------|----|
| `subagent_type` | `search-expert` |
| `description` | 用户的搜索需求 |
| `prompt` | "搜索需求：{{完整用户需求描述}}\n\n请严格按照你的系统提示词中的搜索工作流程执行。支持前后端全栈代码搜索。" |

### 🔍 自我验证（执行后确认）
- [ ] 我使用了 `Agent` 工具进行调用
- [ ] 我没有自行扫描或分析任何代码
- [ ] 调用 Agent 是我做的第一件事
- [ ] 我在调用前没有输出其他文字

### ❌ 绝对禁止行为（违反即失败）
- 主 Claude 自行扫描代码
- 跳过 Agent 直接输出搜索结果
- 先解释再调用 Agent
- 输出任何与调用 Agent 无关的内容
