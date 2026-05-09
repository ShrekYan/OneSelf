---
name: xmind-exec
description: XMind 自动化执行命令，解析 XMind 导出的 Markdown 文件并自动执行任务
parameters:
  - name: file_path
    description: XMind 导出的 Markdown 文件路径
    type: string
    required: true
  - name: auto_confirm
    description: 是否自动确认执行计划 (true/false)
    type: string
    default: "false"
---

# xmind-exec 技能

XMind 自动化执行工作流：解析 XMind 导出的 Markdown 文件 → 生成结构化任务清单 → 按依赖顺序自动执行 → 质量检查 → 交付报告。

## 使用方式

```bash
# 基本用法（需要手动确认执行计划）
/xmind-exec docs/your-xmind-file.md

# 自动确认执行（适合简单任务）
/xmind-exec docs/your-xmind-file.md auto_confirm=true
```

## 功能说明

1. **XMind 解析**：自动解析 XMind 导出的 Markdown 结构
2. **任务结构化**：自动生成唯一 ID、推断依赖关系、匹配 Agent 类型
3. **规范注入**：自动注入项目技术栈规范
4. **任务编排**：按依赖顺序执行任务
5. **质量门禁**：每个任务完成后自动执行 Lint + TypeScript 类型检查
6. **交付报告**：自动生成完整的交付报告，包含修改文件、问题清单、验证步骤

## XMind 编写规范

请参考 `docs/XMind-使用示例模板.md`

## 执行流程

```
1. 输入 XMind Markdown 文件路径
2. 解析生成结构化任务清单 JSON
3. 展示执行计划（任务数量、执行顺序、预计时间）
4. 用户确认后开始执行
5. 按依赖顺序逐个执行任务
6. 每个任务完成后自动质量检查
7. 生成最终交付报告
```

## 质量检查项

- ✅ ESLint 代码规范检查 + 自动修复
- ✅ TypeScript 类型检查
- ✅ 项目规范遵循检查
