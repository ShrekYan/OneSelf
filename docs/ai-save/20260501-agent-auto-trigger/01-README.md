# Agent 自动触发配置优化

## 📋 模块概述

本模块实现了 Claude Code 平台级 Agent 自动触发机制，解决了原有的"伪自动"问题，实现了真正的用户输入自动路由到对应 Agent。

## 🎯 核心功能

### 1. 命名统一修复

- 统一了前端 3 个 Agent 的 `name` 字段与文件名
- 移除了 `-agent` 后缀，保持命名一致性

### 2. 自动触发配置

- 为全部 18 个 Agent 添加了 `triggers` YAML 配置
- 总计配置了 **100 个触发词**，覆盖各种常用表述
- 支持动词、名词、中英文、简称等多种触发方式

### 3. CLAUDE.md 文档完善

- 新增 Agent 调用机制说明
- 补全了缺失的 Agent 触发规则表格
- 移除了不存在的 Agent 条目

## 🏗️ 架构设计

### 触发机制对比

| 维度     | 原"伪自动"方案                   | 新"平台级自动"方案              |
| -------- | -------------------------------- | ------------------------------- |
| 触发层级 | 主 Agent 读取文档后判断          | Claude Code 平台层直接匹配      |
| 可靠性   | 依赖大模型理解，可能遗漏         | 100% 确定性匹配                 |
| 响应速度 | 需要先读文档再判断               | 直接匹配立即路由                |
| 维护成本 | 改 CLAUDE.md + 指望主 Agent 理解 | 每个 Agent 自描述触发条件       |
| 职责边界 | 主 Agent 兼任"调度员"            | 每个 Agent 自描述"我能处理什么" |

### 工作流程

```
用户输入"开发前端页面"
    ↓
Claude Code 平台层扫描所有 Agent 的 frontmatter
    ↓
匹配到 frontend-developer 的 triggers: ["开发前端页面", ...]
    ↓
平台自动路由 → 直接进入该 Agent 上下文
    ↓
✅ 真正的自动调用，零人工判断
```

## 📊 Agent 分类与统计

### 前端类 Agent (7个)

- `frontend-developer` - 前端开发 (10个触发词)
- `frontend-code-reviewer` - 代码审查 (6个)
- `frontend-performance-expert` - 性能优化 (6个)
- `frontend-security-auditor` - 安全扫描 (5个)
- `frontend-test-writer` - 测试编写 (5个)
- `ui-designer` - UI设计 (5个)
- `design-system-architect` - 设计系统 (5个)

### 后端类 Agent (6个)

- `backend-architect` - 后端架构 (8个)
- `nestjs-code-review` - 后端审查 (4个)
- `nestjs-performance-audit` - 性能审计 (5个)
- `nestjs-security-audit` - 安全审计 (4个)
- `nestjs-test-writer` - 后端测试 (4个)
- `api-parser` - 接口文档解析 (6个)

### 通用工具类 Agent (5个)

- `mermaid-generator` - 图表生成 (7个)
- `search-expert` - 代码搜索 (5个)
- `full-frontend-review-orchestrator` - 全量审查 (4个)
- `debug-assistant` - 调试助手 (6个)
- `git-helper` - Git 助手 (5个)

**总计：18 个 Agent，100 个触发词**

## 📁 文件清单

### Agent 配置文件 (18个)

```
.claude/agents/
├── frontend-developer.md
├── frontend-code-reviewer.md
├── frontend-performance-expert.md
├── frontend-security-auditor.md
├── frontend-test-writer.md
├── ui-designer.md
├── design-system-architect.md
├── backend-architect.md
├── nestjs-code-review.md
├── nestjs-performance-audit.md
├── nestjs-security-audit.md
├── nestjs-test-writer.md
├── common/
│   ├── api-parser.md
│   └── mermaid-generator.md
├── search-expert.md
├── full-frontend-review-orchestrator.md
├── debug-assistant.md
└── git-helper.md
```

### 文档文件

- `CLAUDE.md` - 项目指南文档（已更新触发规则章节）

## 🚀 使用说明

### 自动触发示例

用户直接输入以下内容，Claude Code 会自动路由：

- "开发前端页面" → 自动进入 `frontend-developer`
- "审查后端代码" → 自动进入 `nestjs-code-review`
- "画架构图" → 自动进入 `mermaid-generator`
- "Bug 诊断" → 自动进入 `debug-assistant`

### 手动调用

如果自动触发未生效，仍然可以通过 Agent 工具手动指定 subagent_type 参数调用。
