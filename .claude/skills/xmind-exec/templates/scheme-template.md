# 任务执行方案 - {{task_id}}

## 任务基本信息

| 字段 | 内容 |
|------|------|
| 任务编号 | {{task_id}} |
| 所属模块 | {{module}} |
| 任务目标 | {{goal}} |
| 风险等级 | {{risk_level}} |
| 执行模式 | {{execution_mode}} |
| 依赖任务 | {{dependencies}} |

## 上下文

{{context}}

## 验收标准

{{quality_standards}}

## 约束条件

{{constraints}}

## 执行步骤

1. 读取相关项目规范和参考文档。
2. 分析当前代码结构和影响范围。
3. 实现任务目标。
4. 执行质量门禁检查（lint、类型检查等）。
5. 记录变更文件和执行结果。

## 预期变更文件

- `path/to/file1.ts`
- `path/to/file2.tsx`

## 回滚策略

如执行失败或用户要求回滚，按 `changed-files.json` 恢复原始文件内容。
