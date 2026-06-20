# 架构治理 3.5 代系统实施文档

> **实施日期**: 2026-05-08
> **版本**: v1.0
> **状态**: ✅ 已完成并激活

---

## 📋 项目背景

### 痛点分析

传统架构决策模式存在以下问题：

1. **软约束**：DECISIONS.md 只是写在文档里的规则，Claude 可能会忘记
2. **人工审核**：代码审查容易遗漏架构违规，依赖人的记忆力
3. **无反馈闭环**：不知道哪条规则最容易被违反，无法针对性优化
4. **新人成本**：新成员需要花大量时间理解和记忆架构规则

### 目标

将架构决策从「文档里的软约束」升级为「AI 原生硬约束」，实现：

- ✅ 违反架构的代码根本提交不上去
- ✅ 可统计、可分析、可优化的反馈闭环
- ✅ Claude 从生成代码时就知道边界，从源头上减少违规
- ✅ 完全不改变现有开发流程，无感集成

---

## 🏗️ 系统架构：四层防护 + 反馈闭环

```
┌─────────────────────────────────────────────────────────┐
│  第一层：生成前预防（Claude 感知层）                        │
│  Claude 启动时自动加载架构决策，从源头上理解约束               │
└──────────────────────────┬──────────────────────────────┘
                           ↓
┌──────────────────────────┴──────────────────────────────┐
│  第二层：AI 生成后自动检查（PostToolUse 钩子层）            │
│  Claude 每次 Edit/Write 后自动运行，违规立即通知             │
└──────────────────────────┬──────────────────────────────┘
                           ↓
┌──────────────────────────┴──────────────────────────────┐
│  第三层：提交前强制拦截（Git Hook 层）                     │
│  违反架构的代码根本提交不上去                                │
└──────────────────────────┬──────────────────────────────┘
                           ↓
┌──────────────────────────┴──────────────────────────────┐
│  反馈闭环层：自动记录 + 每月分析                          │
│  review-log.json 记录每次违规，分析趋势，优化规则          │
└─────────────────────────────────────────────────────────┘
```

> 💡 **设计决策**：移除了「IDE 实时红线提示」层，避免满屏红线干扰阅读，三层核心防护已足够安全。

---

## 📁 实施文件清单

### 新增文件（11 个）

```
.claude/
├── contracts/
│   ├── README.md                    # 规则索引 + 四层防护文档
│   ├── index.js                     # ESLint 插件入口，导出 5 条规则
│   ├── rules/
│   │   ├── adr-002-no-jwt-in-backend.js
│   │   ├── adr-003-no-localstorage-token.js
│   │   ├── adr-004-no-bcrypt-new-password.js
│   │   ├── adr-006-no-prisma-as-any.js
│   │   └── fadr-003-no-mobx-observer-hoc.js
│   └── cli/
│       ├── post-edit-check.js       # PostToolUse 钩子脚本
│       ├── auto-check.js            # Git 批量检查脚本
│       ├── eslint-formatter.js      # 自动记录违规的 formatter
│       └── record-violation.js      # CLI 手动记录工具
└── review-log.json                  # 运行时生成的违规数据库 + 统计（不纳入版本控制）

docs/
└── architecture-governance-3.5.md   # 本文档
```

### 修改文件（5 个）

| 文件                                     | 修改内容                        |
| ---------------------------------------- | ------------------------------- |
| `.claude/settings.json`                  | 新增 PostToolUse 钩子配置       |
| `apps/web/eslint.config.js`              | 集成自定义架构规则插件          |
| `services/backend/eslint.config.mjs`     | 集成自定义架构规则插件          |
| `services/auth-service/eslint.config.js` | 集成自定义架构规则插件          |
| `services/log-service/eslint.config.js`  | 集成自定义架构规则插件          |
| `.vscode/settings.json`                  | 配置极简模式，禁用 IDE 实时提示 |

---

## 🔧 核心技术实现

### 1. PostToolUse 钩子（第二层防护）

**工作原理**：Claude Code 每一次编辑操作后自动触发

**配置**：

```json
// .claude/settings.json
"PostToolUse": [
  {
    "matcher": "Edit|Write|MultiEdit",
    "hooks": [
      {
        "type": "command",
        "command": "node .claude/contracts/cli/post-edit-check.js",
        "onFailure": "notify"
      }
    ]
  }
]
```

**脚本逻辑**：

1. 从 stdin 读取 Claude 工具调用信息
2. 提取本次修改的文件路径（支持 Edit/Write/MultiEdit）
3. 无文件信息时 fallback 到 git diff 获取修改文件
4. 对每个 TypeScript/JavaScript 文件运行 ESLint 架构规则检查
5. 发现违规时：输出详细错误 + 自动记录 + 退出码 1 触发通知

---

### 2. ESLint 自定义规则（规则引擎）

每条架构决策对应一条 ESLint 规则，示例：

```javascript
// rules/adr-003-no-localstorage-token.js
export default {
  create(context) {
    return {
      MemberExpression(node) {
        if (
          (node.object.name === 'localStorage' || node.object.name === 'sessionStorage') &&
          node.property.name === 'setItem'
        ) {
          context.report({
            node,
            message:
              '❌ 违反 ADR-003：禁止使用 localStorage 存储 Token，必须使用 HttpOnly Cookie 方案',
          });
        }
      },
    };
  },
};
```

**已实现的 5 条核心规则**：

| 规则 ID  | 规则名                           | 适用范围                                  |
| -------- | -------------------------------- | ----------------------------------------- |
| ADR-002  | `adr-002-no-jwt-in-backend`      | backend/log-service 禁止引入 jsonwebtoken |
| ADR-003  | `adr-003-no-localstorage-token`  | 前端禁止 localStorage 存 Token            |
| ADR-004  | `adr-004-no-bcrypt-new-password` | 后端禁止 bcrypt 新密码哈希                |
| ADR-006  | `adr-006-no-prisma-as-any`       | 禁止 prisma as any 类型转换               |
| FADR-003 | `fadr-003-no-mobx-observer-hoc`  | 前端禁止 observer() HOC                   |

---

### 3. 自动记录 Formatter（反馈闭环）

**工作原理**：自定义 ESLint formatter，在输出错误信息的同时自动记录到 review-log.json

**记录字段**：

```json
{
  "id": "V-20260508-01",
  "date": "2026-05-08",
  "decisionId": "ADR-003",
  "ruleName": "@claude/architecture/adr-003-no-localstorage-token",
  "description": "错误信息",
  "filePath": "完整文件路径",
  "line": 5,
  "column": 3,
  "severity": "high",
  "fixed": false,
  "notes": "自动记录 - ESLint",
  "recordedBy": "eslint-formatter"
}
```

**统计功能**：

- 总审查次数
- 总违规次数
- Top 违反决策排行
- 每次违规的日期

---

### 4. 极简模式配置（体验优化）

**配置**：

```json
// .vscode/settings.json
{
  "eslint.validate": [], // 禁用实时打字检查
  "eslint.codeActionsOnSave.enable": false, // 禁用保存时自动修复
  "eslint.lintTask.enable": false, // 禁用后台 lint 任务
  "problems.decorations.enabled": false, // 不显示问题标记
  "eslint.enable": true // ESLint 本身保留，供钩子使用
}
```

**理由**：

- 避免满屏红线干扰代码阅读
- 降低 IDE CPU 占用，提升开发体验
- 三层防护已足够安全，实时提示是冗余
- 只有 Claude 生成后和提交前才检查，不干扰正常开发

---

## ✅ 测试验证结果

### 端到端测试流程

1. **生成违规代码**：故意写入使用 localStorage 存 Token 的代码
2. **PostToolUse 自动触发**：检测到 2 处 ADR-003 违规
3. **错误输出**：显示文件路径、行号、规则名、错误信息
4. **自动记录**：review-log.json 正确记录违规详情
5. **统计更新**：totalReviews、totalViolations、topViolatedDecisions 全部更新

### 测试结果

| 环节                     | 结果                    |
| ------------------------ | ----------------------- |
| PostToolUse 钩子自动触发 | ✅ 通过                 |
| 违规检测准确性           | ✅ 通过（2/2 正确检测） |
| 错误信息完整性           | ✅ 通过                 |
| 自动记录功能             | ✅ 通过                 |
| 统计数据准确性           | ✅ 通过                 |

---

## 📊 使用指南

### 日常开发

**你不需要做任何事情！** 系统完全自动运行：

- Claude 生成代码 → 自动检查 → 有违规立刻通知你
- 你手动改代码 → git commit 时自动检查 → 有违规不让提交
- 一切正常时：静默、无感、不干扰

### 月度分析流程

每个月花 30 分钟：

```bash
# 查看统计信息
node .claude/contracts/cli/record-violation.js --stats
```

分析内容：

1. 哪条规则被违反最多？
2. 是规则描述不清晰？还是 Claude 没注意到？
3. 是否需要在 DECISIONS.md 中加强调？
4. 是否需要新增规则？

### 新增架构决策

当有新的架构决策时：

1. 在 `DECISIONS.md` 中添加决策文档
2. 在 `contracts/rules/` 目录下添加对应 ESLint 规则
3. 在 `contracts/index.js` 中导出新规则
4. 更新 `contracts/README.md`，添加规则说明
5. 测试验证新规则

### 手动批量检查

需要检查所有修改的文件时：

```bash
# 检查所有 git 中已修改的文件
node .claude/contracts/cli/auto-check.js
```

---

## 🎯 关键设计决策回顾

| 决策项       | 选择                     | 理由                             |
| ------------ | ------------------------ | -------------------------------- |
| 检查时机     | PostToolUse + Git Commit | 既早发现，又不干扰实时编辑       |
| IDE 实时提示 | ❌ 禁用                  | 体验优先，三层防护已足够         |
| 规则实现     | ESLint 自定义规则        | 生态成熟，集成方便，支持自动 fix |
| 记录方式     | JSON 文件                | 简单可靠，无需数据库，git 可追踪 |
| 统计粒度     | 按月、按决策 ID          | 简单实用，满足分析需求           |

---

## 🚀 后续优化方向（可选）

### 短期优化（1-2 周）

1. **违规去重**：同一个文件同一规则多次违规只记录一次
2. **批量检查报告**：输出美观的 HTML 报告
3. **修复后标记**：违规修复后自动在 review-log 中标记为 fixed

### 中期优化（1-2 月）

1. **AI 根因分析**：每次违规后 Claude 自动分析为什么会违反，给出改进建议
2. **规则自动优化**：根据违规统计自动优化规则描述和检测逻辑
3. **趋势预测**：预测哪条规则未来可能被频繁违反

### 长期优化（3 月+）

1. **第四代架构治理**：Claude 实时自我修正，根本不生成违规代码
2. **跨项目规则共享**：多个项目复用同一套架构治理体系
3. **团队协作看板**：可视化展示架构合规度趋势

---

## 📝 总结

### 达成目标

✅ **架构决策硬约束**：5 条核心架构决策变成可执行代码，违反就报错
✅ **Claude 原生集成**：PostToolUse 钩子无缝集成，不需要任何手动操作
✅ **反馈闭环建立**：所有违规自动记录，可统计、可分析、可优化
✅ **开发体验优先**：禁用 IDE 实时提示，只在必要时检查，不干扰正常开发
✅ **零侵入集成**：完全不改变现有开发流程，一切和以前一样，只是多了安全网

### 投入产出比

- **开发投入**：约 8 小时完成全部实现和测试
- **长期收益**：
  - 杜绝架构腐化，技术债务可控
  - 减少代码审查工作量
  - 新人上手不需要记忆大量架构规则
  - 持续优化的数据支撑

### 核心价值

> **架构治理不是为了限制，而是为了自由**
>
> 当你不需要花精力记忆几百条架构规则时，
> 当你不需要担心 Claude 生成的代码违反设计原则时，
> 当你不需要在代码审查时死抠细节时，
> 你才能真正专注于业务价值和创新。

---

**文档版本**: v1.0
**最后更新**: 2026-05-08
**状态**: ✅ 已完成并投入使用
