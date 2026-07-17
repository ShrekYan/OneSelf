# 运行时目录结构示例

以下是一个完整执行后的 `.claude/runs/run-{timestamp}/` 目录示例：

```
.claude/runs/run-20260101-120000/
├── run-info.json
├── task-manifest.json
├── execution-plan.md
├── task-definition.md
├── tasks/
│   ├── T001/
│   │   ├── scheme.md
│   │   ├── execution-result.md
│   │   ├── changed-files.json
│   │   └── status.json
│   ├── T002/
│   │   ├── scheme.md
│   │   ├── review-comments.md
│   │   ├── execution-result.md
│   │   ├── changed-files.json
│   │   └── status.json
│   └── T003/
│       ├── scheme.md
│       ├── execution-result.md
│       ├── changed-files.json
│       └── status.json
└── final-report.md
```

## 文件说明

| 文件 | 说明 |
|------|------|
| `run-info.json` | 运行 ID、源文件路径、开始时间、解析版本等 |
| `task-manifest.json` | 项目信息、任务列表、执行计划、依赖关系等 |
| `execution-plan.md` | 人类可读的整体执行计划 |
| `task-definition.md` | 原始 XMind Markdown 的副本 |
| `tasks/T{nnn}/scheme.md` | 单个任务的执行方案 |
| `tasks/T{nnn}/review-comments.md` | 用户审核时提出的修改意见 |
| `tasks/T{nnn}/execution-result.md` | 任务执行后的结果说明 |
| `tasks/T{nnn}/changed-files.json` | 任务修改的文件清单 |
| `tasks/T{nnn}/status.json` | 任务当前状态（pending / in_progress / completed / skipped） |
| `final-report.md` | 所有任务执行完成后的最终报告 |
