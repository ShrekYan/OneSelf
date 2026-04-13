# skills vs workflows 对比手册

本文总结 Claude Code 中两种自动化编排的区别。

---

## 📋 核心概念

两者**目的相同**：都是把多个步骤/任务按顺序组织起来，**一次触发，自动执行完**，代替你手动一步一步操作。

区别在于**实现方式和可靠性**不同。

---

## 🔍 详细对比

| 对比项 | skills 编排（本项目现有方式） | Claude 原生 workflows |
|--------|-------------------------------|---------------------|
| **存放位置** | `.claude/skills/` | `.claude/workflows/` |
| **文件格式** | Markdown（自然语言） | YAML（严格语法） |
| **触发命令** | `/skill-name` | `/workflow run skill-name` |
| **执行原理** | Claude 阅读你写的 Markdown 说明，理解后按顺序执行 | Claude 原生解析 YAML 定义，精确执行 |
| **多步骤顺序** | ✅ 支持 | ✅ 支持 |
| **条件判断** | `if/else` 靠 Claude 自然语言理解，偶尔可能出错 | 原生语法支持，**100% 准确** |
| **参数/变量** | 靠 Claude 传递，不稳定 | 原生支持，定义输入，稳定传递 |
| **调用子流程** | 不支持，需要重复写 | 原生支持，一个 workflow 可以调用另一个 |
| **学习成本** | 低，写自然语言说明就行 | 中，需要学习 YAML 语法 |
| **适合场景** | 简单流程、入门练习 | 复杂流程、需要精确条件判断 |

---

## 💡 举个例子：条件执行

### 「如果有后端文件变更，就运行后端检查」

#### skills 写法（Markdown）

```markdown
## 执行步骤

1. 运行前端检查
...
3. 如果检测到 backend/ 目录有变更，请执行：
   ```bash
   cd backend
   npm run lint
   npm run build
   ```
```

特点：好写，但是条件判断靠 Claude 理解，不一定 100% 准。

---

#### 原生 workflows 写法（YAML）

```yaml
steps:
  - name: 前端检查
    run: |
      npm run lint
      npx tsc --noEmit

  - name: 后端检查
    if: changed_files matches "^backend/"
    run: |
      cd backend
      npm run lint
      npm run build
```

特点：语法严格一点，但是**条件判断 100% 准确**，不会出错。

---

## 🎯 本项目使用建议

### 入门阶段 → 用 skills

- 保持项目现有统一风格
- `full-frontend-review` 已经这么用了，我们跟着走
- 简单流程足够用，学习成本低

### 什么时候该用 workflows

当你需要：
- 复杂的多分支条件判断
- 多个编排互相调用组合
- 精确的参数传递
- 想要体验 Claude 原生特性

这时候再把复杂编排放到 `workflows/` 用 YAML 写。

---

## 📁 本项目当前布局（推荐保持）

```
.claude/
├── skills/              ← 所有技能都放这，包括：
│   ├── 专项技能/        ← 单项检查、单项功能
│   │   ├── frontend-code-review.md
│   │   ├── nestjs-code-review.md
│   │   └── ...
│   └── 编排流程/        ← 把多个专项编排起来
│       ├── full-frontend-review.md
│       ├── pre-commit-check.md
│       └── backend-code-review.md （后续加）
│
├── workflows/           ← 保留空目录
│                         未来要玩原生 workflows 再用
│
└── docs/
    └── skills-vs-workflows.md  ← 本文档
```

---

## 一句话总结

> **目的相同，精度不同**
> - 简单入门 → skills 足够
> - 复杂精确 → workflows 更好
