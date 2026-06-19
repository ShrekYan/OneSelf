---
name: workflow
description: 执行预定义的自动化工作流
---

# workflow 技能

执行 `.claude/workflows/` 目录下预定义的自动化工作流。

## 使用方式

```
/workflow <workflow-name>
```

**示例：**
- `/workflow xmind-exec` - 执行 XMind 自动化工作流

## 工作流定义格式

工作流使用 YAML 格式定义，位于 `.claude/workflows/<workflow-name>.yml`

支持：
- `inputs` - 定义用户输入参数
- `steps` - 定义执行步骤序列

详细格式请参考 Claude Code 工作流文档。
