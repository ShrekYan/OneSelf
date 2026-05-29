# 06. 文档与知识管理 Command 模板

## 分类定位

面向文档生成、站会记录、入职引导、上下文保存与恢复的 command。核心目标是将项目知识结构化、可检索、可传递、可持续更新。

## 适用命令

| 命令文件 | 标题/用途 | 典型输出 |
| --- | --- | --- |
| `doc-generate.md` | Automated Documentation Generation | API 文档、架构文档、代码文档、安装指南 |
| `standup-notes.md` | Standup Notes Generator | 昨日/今日/阻塞项/行动项 |
| `onboard.md` | Onboard | 项目入职说明、关键文件、工作流 |
| `context-save.md` | Context Capture Process | 项目上下文快照、决策、当前状态 |
| `context-restore.md` | Context Restoration Process | 恢复上下文、冲突检查、下一步建议 |

## 结构化模板

```markdown
---
model: claude-sonnet-4-0
---

# {Documentation or Knowledge Command Title}

You are a technical documentation and knowledge management expert specializing in {knowledge_area}.

## Context
The user needs to capture, generate, restore, or communicate {knowledge_target}. Focus on accuracy, structure, continuity, and actionability.

## Requirements
$ARGUMENTS

## Instructions

### 1. Source Discovery
- Identify source files, code, issues, commits, meeting notes, or saved context.
- Determine freshness and reliability of each source.
- Flag missing or conflicting information.

### 2. Knowledge Extraction
- Extract goals, architecture, workflows, APIs, decisions, constraints, and current status.
- Preserve rationale, not just conclusions.
- Keep task-specific details separate from stable project knowledge.

### 3. Structuring
- Choose output template based on audience and purpose.
- Organize with clear sections, tables, checklists, and examples.
- Add links or file references where useful.

### 4. Validation
- Check consistency with source material.
- Identify outdated or uncertain entries.
- Define next updates or owners.

## Output Format
Return:
- Purpose and Audience
- Source Summary
- Structured Documentation / Notes / Context
- Open Questions
- Action Items
- Maintenance Guidance
```

## 通用字段

```yaml
knowledge_command:
  purpose: document | onboard | summarize | save_context | restore_context | meeting_notes
  audience: developer | reviewer | manager | new_joiner | agent | mixed
  sources:
    - type: code | docs | git | issue | meeting | context_snapshot
      path_or_id: 来源路径或编号
      freshness: current | stale | unknown
  sections: []
  open_questions: []
  action_items: []
```

## 子类型字段

### A. 自动文档生成

```yaml
documentation:
  doc_type: api | architecture | code | installation | user_guide | runbook
  sections:
    - overview
    - prerequisites
    - quick_start
    - reference
    - examples
    - troubleshooting
  examples_required: true | false
```

### B. 站会记录

```yaml
standup_notes:
  yesterday: []
  today: []
  blockers: []
  decisions: []
  action_items:
    - owner: 负责人
      task: 事项
      due: 可选
```

### C. 上下文保存/恢复

```yaml
context_management:
  project_overview: 项目概览
  architecture_decisions: []
  current_focus: 当前重点
  recent_work: []
  known_issues: []
  next_steps: []
  compatibility_check: []
```

### D. 入职引导

```yaml
onboarding:
  project_map: []
  setup_steps: []
  coding_conventions: []
  common_workflows: []
  first_tasks: []
  contact_or_ownership: []
```
