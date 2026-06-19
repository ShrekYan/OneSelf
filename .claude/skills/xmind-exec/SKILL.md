---
name: xmind-exec
description: XMind 自动化执行命令 - 审核模式。解析 XMind 导出的 Markdown，逐条生成任务方案 → 人工审核 → 执行代码。
parameters:
  - name: file_path
    description: XMind 导出的 Markdown 文件路径（如 docs/my-feature-xmind.md）
    type: string
    required: true
---

# xmind-exec 技能 - 审核模式

XMind 自动化执行工作流（审核模式）：解析 XMind 导出的 Markdown 文件 → 生成结构化任务清单 → 逐条生成执行方案 → 人工审核 → 执行代码。

## 使用方式

```bash
# 基本用法
/xmind-exec docs/your-xmind-file.md
```

## 执行流程

```
1. 📂 初始化运行环境
   └── 自动创建 .claude/runs/run-{timestamp}/ 目录

2. 🧠 解析 XMind 生成任务清单
   └── 调用 xmind-task-parser Agent
   └── 生成 task-manifest.json
   └── 生成 execution-plan.md

3. ✅ 确认执行计划
   └── 用户确认整体任务清单

4. ⚡ 逐条审核执行（核心）
   ┌── 对每个任务：
   │     a. 生成详细执行方案 scheme.md
   │     b. 展示方案供用户审核
   │     c. 用户选择：确认执行 / 修改方案 / 跳过 / 终止
   │     d. 执行任务（生成代码 + 质量检查）
   │     e. 保存执行结果
   └── 循环直到所有任务完成

5. 📦 生成最终交付报告
   └── final-report.md
```

## 审核模式特点

| 特点 | 说明 |
|------|------|
| ✅ **风险可控** | 每个任务都可以审核后再执行 |
| ✅ **方案透明** | 每个任务做什么、改哪些文件一目了然 |
| ✅ **可干预** | 随时可以修改方案或跳过任务 |
| ✅ **结果可追溯** | 所有中间文件都持久化保存 |

## 运行时文件结构

```
.claude/runs/run-{timestamp}/
├── run-info.json                # 运行基本信息
├── task-manifest.json          # 任务清单
├── execution-plan.md            # 完整执行计划
├── tasks/                       # 每个任务独立目录
│   ├── T001/
│   │   ├── scheme.md            # 任务执行方案
│   │   ├── review-comments.md   # 审核意见（如有）
│   │   ├── execution-result.md  # 执行结果
│   │   ├── changed-files.json   # 修改文件清单
│   │   └── status.json          # 任务状态
│   ├── T002/
│   └── T003/
└── final-report.md              # 最终交付报告
```

## XMind 编写规范（极简即可）

你只需要写业务需求，技术规范由项目自动注入：

```markdown
# 我的项目

## 公共组件
### 按钮组件
- 支持 primary / default / danger 三种样式
- 支持点击事件
- 支持禁用状态

### 徽章组件
- 右上角红点显示
- 支持数字显示
- 显式依赖：T001

## 页面层
### 用户中心页面
- 展示用户基本信息
- 集成按钮组件
- 显式依赖：T001, T002
```

## 最佳实践

1. **任务粒度适中**：每个任务对应一个原子功能（一个组件 / 一个接口 / 一个页面）
2. **依赖关系明确**：有依赖的任务用"显式依赖：T001"标注
3. **业务描述清晰**：任务描述越清晰，生成的方案越准确
4. **审核时充分沟通**：如果方案不符合预期，直接提出修改意见

---

**版本**：v2.0 - 审核模式
**最后更新**：2026-05-09
