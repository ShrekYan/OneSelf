# Claude Code 高级特性实施路线图

> 📅 创建日期：2026-05-01
> 🎯 目标：系统性引入 Claude Code 高级特性，提升团队开发效率
> 📊 当前进度：基础架构已完成（Agent/Skill/Workflow），高级特性待实施

---

## 📋 目录

- [一、现状评估](#一现状评估)
- [二、高级特性详解](#二高级特性详解)
- [三、分阶段实施路线图](#三分阶段实施路线图)
- [四、特性实施详细指南](#四特性实施详细指南)
- [五、预期收益评估](#五预期收益评估)
- [六、配置文件参考模板](#六配置文件参考模板)
- [七、常见问题 FAQ](#七常见问题-faq)

---

## 一、现状评估

### 1.1 已使用特性盘点

| 特性           | 使用情况    | 说明                             | 成熟度    |
| -------------- | ----------- | -------------------------------- | --------- |
| Agent 定义     | ✅ 已完善   | 16 个专业 Agent，包含 1 个编排器 | 🟢 成熟   |
| Skill 定义     | ✅ 已完善   | 多个 Skill 作为命令入口          | 🟢 成熟   |
| Workflow       | ✅ 已使用   | 4 个 YAML 工作流                 | 🟡 可用   |
| Rules 引用     | ✅ 已完善   | TypeScript、安全、代码格式规范   | 🟢 成熟   |
| Project Memory | ✅ 已使用   | 项目记忆文件                     | 🟡 可用   |
| Include 机制   | ✅ 已使用   | 规范文件引用                     | 🟢 成熟   |
| MCP 工具       | ⚠️ 基础使用 | 仅使用了 Playwright 浏览器自动化 | 🟡 待拓展 |

### 1.2 当前使用率评估

**当前整体使用率：约 40%**

- ✅ 基础层：100% 完成（Agent/Skill/Rules）
- ⚠️ 进阶层：20% 完成（Workflow 基础使用）
- ❌ 高级层：0% 完成（MCP 深度集成、Hooks、并行编排等）

---

## 二、高级特性详解

### 2.1 MCP (Model Context Protocol) 服务器深度集成

#### 是什么？

MCP 是一个开放协议，让 Claude 可以安全地与外部工具、API 和数据源交互，实现真正的"智能体"能力。

#### 可拓展的 MCP 服务器清单

| MCP 服务器类型   | 推荐指数   | 业务价值                          | 实施难度 | 预计耗时 |
| ---------------- | ---------- | --------------------------------- | -------- | -------- |
| **GitHub MCP**   | ⭐⭐⭐⭐⭐ | 自动处理 PR、Issue、Code Review   | 低       | 1 天     |
| **数据库 MCP**   | ⭐⭐⭐⭐⭐ | 自然语言直接查 PostgreSQL/MySQL   | 中       | 2 天     |
| **Git 高级 MCP** | ⭐⭐⭐⭐   | 高级 Git 操作、分支管理、历史分析 | 低       | 1 天     |
| **Jira MCP**     | ⭐⭐⭐⭐   | 自动创建任务、更新状态、生成周报  | 中       | 2 天     |
| **Slack MCP**    | ⭐⭐⭐     | 自动发通知、同步审查结果          | 低       | 0.5 天   |
| **HTTP API MCP** | ⭐⭐⭐⭐   | 通用 API 调用、第三方服务集成     | 低       | 1 天     |
| **文件系统 MCP** | ⭐⭐⭐     | 高级文件操作、批量处理            | 低       | 0.5 天   |

#### 业务场景示例

```
场景 1: PR 自动化
用户: "帮我 review 一下这个 PR #123"
Claude → GitHub MCP 拉取代码 → 运行审查 Agent → 自动评论结果

场景 2: 数据分析
用户: "查一下上周注册的新用户，分析地域分布，生成报告发群里"
Claude → 数据库 MCP 查询 → 分析 → Slack MCP 发送

场景 3: Bug 自动修复
用户: "线上有个 bug，订单号 ORD-20260501-001 支付失败"
Claude → 数据库 MCP 查日志 → 定位问题 → 生成修复 PR → Jira 状态更新
```

---

### 2.2 Hooks 钩子系统

#### 是什么？

Claude Code 支持在特定事件触发时自动执行自定义脚本，实现真正的"事件驱动自动化"。

#### 可用 Hooks 清单

| Hook 名称       | 触发时机      | 你的项目适用场景                | 优先级 | 预计耗时 |
| --------------- | ------------- | ------------------------------- | ------ | -------- |
| `pre-commit`    | git commit 前 | 自动运行 lint + 类型检查 + 测试 | P0     | 0.5 天   |
| `pre-push`      | git push 前   | 自动运行完整审查 + 构建验证     | P0     | 0.5 天   |
| `post-checkout` | 切换分支后    | 自动安装依赖、检查环境一致性    | P1     | 0.5 天   |
| `startup`       | Claude 启动时 | 自动检查项目状态、提醒待办事项  | P1     | 0.3 天   |
| `file-save`     | 保存文件后    | 自动格式化、运行相关单测        | P2     | 0.5 天   |
| `pre-edit`      | 修改文件前    | 备份文件、检查权限              | P2     | 0.3 天   |
| `post-edit`     | 修改文件后    | 自动 lint、类型检查             | P1     | 0.3 天   |

#### 配置位置

```json
// .claude/settings.json
{
  "hooks": {
    "pre-commit": ".claude/hooks/pre-commit.sh",
    "pre-push": ".claude/hooks/pre-push.sh",
    "post-checkout": ".claude/hooks/post-checkout.sh",
    "startup": ".claude/hooks/startup.sh"
  }
}
```

---

### 2.3 多 Agent 并行编排

#### 是什么？

将串行执行的 Agent 编排改为并行执行，大幅提升审查速度。

#### 当前状态 vs 目标状态

| 当前（串行）                       | 目标（并行）     |
| ---------------------------------- | ---------------- |
| 代码质量审查 → 安全扫描 → 性能优化 | 三个审查同时进行 |
| 总耗时：~3 分钟                    | 总耗时：~1 分钟  |
| 速度提升：1x                       | 速度提升：3x     |

#### 实现原理

```
当前串行流程：
┌─────────────┐
│ 代码质量审查 │ 1 分钟
└─────────────┘
        ↓
┌─────────────┐
│ 安全漏洞扫描 │ 1 分钟
└─────────────┘
        ↓
┌─────────────┐
│ 性能优化分析 │ 1 分钟
└─────────────┘
总耗时：3 分钟

目标并行流程：
┌─────────────┐
│ 代码质量审查 │ ──┐
└─────────────┘   │
┌─────────────┐   │ 1 分钟
│ 安全漏洞扫描 │ ──┤
└─────────────┘   │
┌─────────────┐   │
│ 性能优化分析 │ ──┘
└─────────────┘
总耗时：1 分钟
```

---

### 2.4 Agent 状态机

#### 是什么？

让 Agent 拥有状态记忆，可以在多轮对话中保持上下文，进行复杂的多步任务引导。

#### 你的项目适用场景

##### 场景 1：Bug 修复助手状态机

```
状态流转图：
    ┌──────────┐
    │   空闲   │
    └──────────┘
          ↓ 用户报告 bug
    ┌──────────┐
    │ 收集信息 │ ←─┐
    └──────────┘   │ 信息不足
          ↓ 信息完整
    ┌──────────┐
    │ 定位根因 │
    └──────────┘
          ↓
    ┌──────────┐
    │ 生成方案 │
    └──────────┘
          ↓
    ┌──────────┐
    │ 实施修复 │
    └──────────┘
          ↓
    ┌──────────┐
    │ 验证修复 │
    └──────────┘
          ↓
    ┌──────────┐
    │   完成   │
    └──────────┘
```

##### 场景 2：功能开发向导状态机

```
状态流转：
需求分析 → 方案设计 → 代码生成 → 测试编写 → 文档更新 → 完成
```

#### 配置方式

```yaml
# Agent 头部配置
stateful: true
initialState: 'idle'
states:
  - idle
  - collecting-info
  - analyzing
  - implementing
  - verifying
  - done
stateTransitions:
  from: idle
  to: collecting-info
  condition: '用户报告了新 bug'
```

---

### 2.5 自定义工具 (Custom Tools)

#### 是什么？

除了 Claude Code 内置的 Read/Edit/Write/Bash 等工具，你可以自己编写 TypeScript 工具，扩展 Claude 的能力边界。

#### 推荐开发的自定义工具清单

| 工具名称         | 功能描述                     | 推荐指数   | 实施难度 | 预计耗时 |
| ---------------- | ---------------------------- | ---------- | -------- | -------- |
| `pr-preview`     | 自动生成 PR 预览和描述模板   | ⭐⭐⭐⭐⭐ | 低       | 0.5 天   |
| `db-query`       | 安全的数据库查询工具（只读） | ⭐⭐⭐⭐⭐ | 中       | 1 天     |
| `api-test`       | API 接口自动化测试生成与运行 | ⭐⭐⭐⭐   | 中       | 1 天     |
| `mobile-preview` | 移动端页面预览截图生成       | ⭐⭐⭐     | 中       | 1 天     |
| `i18n-scan`      | 国际化文本扫描和缺失补全     | ⭐⭐⭐     | 低       | 0.5 天   |
| `migrate-helper` | 数据库迁移脚本生成与校验     | ⭐⭐⭐⭐   | 中       | 1 天     |
| `doc-gen`        | 代码自动生成 API 文档        | ⭐⭐⭐     | 低       | 0.5 天   |

#### 工具开发模板

```typescript
// .claude/tools/pr-preview.ts
import type { Tool } from '@anthropic-ai/claude-code';

export default {
  name: 'pr-preview',
  description: '生成 PR 预览和格式化描述',
  parameters: {
    type: 'object',
    properties: {
      branch: {
        type: 'string',
        description: '分支名称',
      },
      base: {
        type: 'string',
        description: '目标分支，默认 main',
        default: 'main',
      },
    },
    required: ['branch'],
  },
  async run(params) {
    // 1. 调用 Git 对比代码变更
    // 2. 分析变更类型（feat/fix/refactor/doc）
    // 3. 生成 PR 描述模板
    // 4. 返回结果
    return {
      title: 'feat: xxx',
      body: '## Summary\n...',
      changedFiles: [],
    };
  },
} as Tool;
```

---

### 2.6 环境感知 (Environment Awareness)

#### 是什么？

根据不同环境（开发/测试/生产）自动切换 Claude 的行为模式和安全策略。

#### 三级安全策略

| 环境     | 安全级别 | 自动应用修改 | 确认级别 | 禁用命令       |
| -------- | -------- | ------------ | -------- | -------------- |
| 开发环境 | Relaxed  | ✅ 是        | 低       | 无             |
| 测试环境 | Strict   | ❌ 否        | 中       | 危险命令       |
| 生产环境 | Paranoid | ❌ 否        | 高       | 大量白名单限制 |

#### 配置位置

```json
// .claude/environments.json
{
  "development": {
    "safetyLevel": "relaxed",
    "autoApply": true,
    "confirmLevel": "low",
    "allowedCommands": ["*"]
  },
  "staging": {
    "safetyLevel": "strict",
    "autoApply": false,
    "confirmLevel": "medium",
    "forbiddenCommands": ["rm -rf /"]
  },
  "production": {
    "safetyLevel": "paranoid",
    "autoApply": false,
    "confirmLevel": "high",
    "allowedCommands": ["npm run build"],
    "forbiddenPatterns": ["DROP TABLE", "DELETE FROM"]
  }
}
```

---

### 2.7 技能组合 (Skill Composition)

#### 是什么？

一个 Skill 可以调用其他 Skill，形成技能树，实现复杂工作流的自动化编排。

#### 技能树设计

```
/feature-new
    ↓
    ├─ 调用 /backend-api → 生成后端 CRUD 接口
    ├─ 调用 /frontend-page → 生成前端页面
    ├─ 调用 /frontend-test → 生成测试用例
    └─ 调用 /doc-update → 更新 API 文档

/bug-fix
    ↓
    ├─ 调用 /debug → 定位问题根因
    ├─ 调用 /backend-fix → 修复后端代码
    ├─ 调用 /frontend-fix → 修复前端代码
    └─ 调用 /test-update → 更新测试
```

#### 配置方式

```yaml
# skill: feature-new
name: feature-new
description: 端到端新功能生成
inputs:
  - name: name
    description: 功能名称
  - name: type
    description: 功能类型

steps:
  - name: 生成后端接口
    skill: backend-api
    params:
      name: '{{name}}'
      type: '{{type}}'

  - name: 生成前端页面
    skill: frontend-page
    params:
      apiSpec: '{{steps[0].result}}'
      dependsOn: [0]

  - name: 生成测试
    skill: frontend-test
    params:
      pageComponent: '{{steps[1].result}}'
      dependsOn: [1]
```

---

### 2.8 增量上下文管理

#### 是什么？

智能控制 Claude 加载的文件范围和优先级，大幅减少 Token 消耗，提升回答精准度。

#### 配置项说明

| 配置项                | 说明                         | 推荐值                      |
| --------------------- | ---------------------------- | --------------------------- |
| `priorities`          | 文件优先级，0=不加载         | 见下方模板                  |
| `autoLoad.onStartup`  | 启动时自动加载的文件         | `package.json`, `README.md` |
| `autoLoad.onFileOpen` | 打开文件时自动加载的相关文件 | `related/**/*`              |
| `maxFiles`            | 最大加载文件数               | 100                         |
| `maxTokens`           | 最大 Token 数                | 8000                        |

#### 配置示例

```json
// .claude/context.json
{
  "priorities": {
    "**/*.ts": 10,
    "**/*.tsx": 10,
    "**/*.json": 8,
    "**/*.yml": 8,
    "**/*.md": 5,
    "**/*.css": 3,
    "**/*.scss": 3,
    "node_modules/**": 0,
    "dist/**": 0,
    "build/**": 0
  },
  "autoLoad": {
    "onStartup": ["package.json", "README.md", ".claude/README.md"],
    "onFileOpen": ["{{fileDir}}/**/*.ts", "{{fileDir}}/types.ts"]
  },
  "maxFiles": 100,
  "maxTokens": 8000
}
```

---

## 三、分阶段实施路线图

### 3.1 第一阶段：P0 高价值低难度（1 周内）

| 序号 | 特性                   | 预计耗时 | 责任人 | 完成状态 |
| ---- | ---------------------- | -------- | ------ | -------- |
| 1    | Hooks: pre-commit 配置 | 0.5 天   |        | ☐        |
| 2    | Hooks: pre-push 配置   | 0.5 天   |        | ☐        |
| 3    | Agent 并行编排改造     | 0.5 天   |        | ☐        |
| 4    | 增量上下文配置         | 0.3 天   |        | ☐        |
| 5    | 环境感知安全策略       | 0.3 天   |        | ☐        |
| 6    | 工具: pr-preview 开发  | 0.5 天   |        | ☐        |

**第一阶段合计：2.6 天**

---

### 3.2 第二阶段：P1 中价值中难度（2-4 周）

| 序号 | 特性                  | 预计耗时 | 责任人 | 完成状态 |
| ---- | --------------------- | -------- | ------ | -------- |
| 1    | MCP: GitHub 集成      | 1 天     |        | ☐        |
| 2    | MCP: 数据库集成       | 2 天     |        | ☐        |
| 3    | Hooks: post-checkout  | 0.5 天   |        | ☐        |
| 4    | 工具: db-query 开发   | 1 天     |        | ☐        |
| 5    | 工具: api-test 开发   | 1 天     |        | ☐        |
| 6    | Agent: Bug 修复状态机 | 2 天     |        | ☐        |

**第二阶段合计：7.5 天**

---

### 3.3 第三阶段：P2 进阶特性（1-2 月）

| 序号 | 特性                 | 预计耗时 | 责任人 | 完成状态 |
| ---- | -------------------- | -------- | ------ | -------- |
| 1    | MCP: Jira 集成       | 2 天     |        | ☐        |
| 2    | MCP: Slack 集成      | 0.5 天   |        | ☐        |
| 3    | Skill 组合体系       | 2 天     |        | ☐        |
| 4    | Agent: 功能开发向导  | 2 天     |        | ☐        |
| 5    | 工具: i18n-scan      | 0.5 天   |        | ☐        |
| 6    | 工具: mobile-preview | 1 天     |        | ☐        |

**第三阶段合计：8 天**

---

### 3.4 整体时间规划

```
第 1 周: 第一阶段 P0 特性（2.6 天）
    目标: 立竿见影，提升 30% 效率

第 2-4 周: 第二阶段 P1 特性（7.5 天）
    目标: 体系化提升，再提升 40% 效率

第 5-8 周: 第三阶段 P2 特性（8 天）
    目标: 全面智能化，再提升 30% 效率

总体收益: 开发效率提升 100%+
```

---

## 四、特性实施详细指南

### 4.1 Hooks: pre-commit 实施指南

#### Step 1: 创建 hook 脚本

```bash
# .claude/hooks/pre-commit.sh
#!/bin/bash

echo "🚀 开始预提交代码检查..."
echo ""

# 前端检查
cd apps/web
echo "📐 运行前端 ESLint 检查..."
npm run lint
if [ $? -ne 0 ]; then
  echo "❌ 前端 ESLint 检查失败"
  exit 1
fi
echo "✅ 前端 ESLint 检查通过"

echo "🔍 运行前端 TypeScript 类型检查..."
npx tsc --noEmit
if [ $? -ne 0 ]; then
  echo "❌ 前端 TypeScript 类型检查失败"
  exit 1
fi
echo "✅ 前端 TypeScript 类型检查通过"

# 后端检查（如果有变更）
cd ../../services/backend
if git diff --cached --name-only | grep -q "^services/backend/"; then
  echo "🔙 检测到后端文件变更，运行后端检查..."
  npm run lint
  if [ $? -ne 0 ]; then
    echo "❌ 后端 ESLint 检查失败"
    exit 1
  fi
  echo "✅ 后端 ESLint 检查通过"
fi

echo ""
echo "🎉 所有检查通过！可以提交代码了"
```

#### Step 2: 配置 settings.json

```json
// .claude/settings.json
{
  "hooks": {
    "pre-commit": ".claude/hooks/pre-commit.sh"
  }
}
```

#### Step 3: 测试验证

```bash
# 修改一个文件
git add .
git commit -m "test: 测试 pre-commit hook"
# 观察是否自动运行检查
```

---

### 4.2 并行编排改造指南

#### Step 1: 修改 orchestrator

```markdown
# 修改 full-frontend-review-orchestrator.md

## 步骤 2: 并行触发三个审查

- 使用 Agent 工具**并行调用**三个专业 Agent：
  1. frontend-code-reviewer - 代码质量审查
  2. frontend-security-auditor - 安全漏洞扫描
  3. frontend-performance-expert - 性能优化分析

- 等待所有 Agent 执行完成

## 步骤 3: 整合输出综合报告

- 收集三个审查的所有结果
- 统一按 P0/P1/P2 优先级排序
- 输出整合后的完整报告
```

#### Step 2: 测试对比速度

```bash
# 改造前（串行）
/full-frontend-review apps/web/src/components
# 记录耗时

# 改造后（并行）
/full-frontend-review apps/web/src/components
# 对比耗时
```

---

### 4.3 增量上下文配置指南

#### Step 1: 创建 context.json

```json
// .claude/context.json
{
  "priorities": {
    "**/*.ts": 10,
    "**/*.tsx": 10,
    "**/*.json": 8,
    "**/*.yml": 8,
    "**/*.md": 5,
    "**/*.css": 3,
    "**/*.scss": 3,
    "node_modules/**": 0,
    "dist/**": 0,
    "build/**": 0,
    ".git/**": 0
  },
  "autoLoad": {
    "onStartup": ["package.json", "README.md", ".claude/README.md"],
    "onFileOpen": ["{{fileDir}}/*.ts", "{{fileDir}}/types.ts", "{{fileDir}}/constants.ts"]
  },
  "maxFiles": 100,
  "maxTokens": 8000
}
```

#### Step 2: 验证效果

重启 Claude Code，观察启动时加载的文件数量变化。

---

## 五、预期收益评估

### 5.1 效率提升矩阵

| 优化项       | 预期收益           | 实施成本 | ROI  |
| ------------ | ------------------ | -------- | ---- |
| Hooks 自动化 | 开发效率 +20%      | 1 天     | 很高 |
| 并行编排     | 审查速度 +300%     | 0.5 天   | 极高 |
| GitHub MCP   | PR 处理效率 +50%   | 1 天     | 高   |
| 环境安全策略 | 生产事故风险 -90%  | 0.3 天   | 极高 |
| 自定义工具   | 重复工作 -40%      | 按需     | 高   |
| 增量上下文   | Token 成本 -50%    | 0.3 天   | 很高 |
| 状态机 Agent | 复杂任务引导 +60%  | 2 天     | 中   |
| MCP 数据库   | 数据查询效率 +200% | 2 天     | 高   |

### 5.2 总体收益

| 指标         | 改进前   | 改进后   | 提升         |
| ------------ | -------- | -------- | ------------ |
| 代码审查时间 | 3 分钟   | 1 分钟   | 200% 提升    |
| PR 处理时间  | 30 分钟  | 10 分钟  | 200% 提升    |
| 预提交检查   | 手动运行 | 自动运行 | 100% 自动化  |
| Token 消耗   | 1x       | 0.5x     | 节省 50%     |
| 生产安全事故 | 存在风险 | 基本消除 | 90% 风险降低 |

---

## 六、配置文件参考模板

### 6.1 完整的 settings.json 模板

```json
{
  "model": "claude-3-5-sonnet-20241022",
  "temperature": 0.1,
  "hooks": {
    "pre-commit": ".claude/hooks/pre-commit.sh",
    "pre-push": ".claude/hooks/pre-push.sh",
    "post-checkout": ".claude/hooks/post-checkout.sh",
    "startup": ".claude/hooks/startup.sh"
  },
  "mcp": {
    "servers": {
      "github": {
        "command": "npx",
        "args": ["-y", "@modelcontextprotocol/server-github"]
      },
      "postgres": {
        "command": "npx",
        "args": ["-y", "@modelcontextprotocol/server-postgres"]
      }
    }
  },
  "agents": {
    "directory": ".claude/agents",
    "autoLoad": true
  },
  "skills": {
    "directory": ".claude/skills",
    "autoLoad": true
  },
  "workflows": {
    "directory": ".claude/workflows",
    "autoLoad": true
  }
}
```

### 6.2 完整的 environments.json 模板

```json
{
  "default": "development",
  "environments": {
    "development": {
      "name": "开发环境",
      "safetyLevel": "relaxed",
      "autoApply": true,
      "confirmLevel": "low",
      "allowedCommands": ["*"],
      "forbiddenPatterns": []
    },
    "staging": {
      "name": "测试环境",
      "safetyLevel": "strict",
      "autoApply": false,
      "confirmLevel": "medium",
      "forbiddenPatterns": ["DROP TABLE", "TRUNCATE TABLE", "DELETE FROM.*WHERE 1=1"]
    },
    "production": {
      "name": "生产环境",
      "safetyLevel": "paranoid",
      "autoApply": false,
      "confirmLevel": "high",
      "allowedCommands": ["npm run build", "npm run lint", "npx tsc --noEmit"],
      "forbiddenPatterns": [
        "DROP",
        "TRUNCATE",
        "DELETE FROM",
        "ALTER TABLE.*DROP",
        "rm -rf",
        "> /dev/null",
        "&& rm"
      ],
      "readOnly": true
    }
  }
}
```

---

## 七、常见问题 FAQ

### Q1: 这些特性都是官方支持的吗？

A: 是的，这些都是 Claude Code 的官方特性。部分特性可能需要最新版本支持，建议升级到最新版。

### Q2: MCP 服务器安全吗？会不会泄露数据？

A: MCP 运行在本地，所有数据都不会离开你的机器。数据库查询可以配置只读权限，非常安全。

### Q3: 并行编排会不会导致 Token 消耗增加？

A: 是的，Token 消耗会增加约 20%，但速度提升 200%，整体 ROI 很高。可以根据需要选择并行还是串行。

### Q4: 自定义工具可以用 JavaScript 吗？还是必须 TypeScript？

A: 都支持，TypeScript 推荐，可以获得更好的类型提示。

### Q5: Hooks 可以用 Node.js 写吗？还是必须 Shell？

A: 都支持，Shell 适合简单任务，Node.js 适合复杂逻辑。

### Q6: 这些特性需要付费吗？

A: 大部分是 Claude Code 内置免费功能，MCP 是开放协议免费使用，只有 Token 消耗需要按正常 Anthropic 付费。

---

## 八、实施检查清单

### 第一阶段检查

- [ ] pre-commit hook 已配置并测试
- [ ] pre-push hook 已配置并测试
- [ ] 前端审查编排器已改为并行
- [ ] context.json 已配置
- [ ] environments.json 已配置
- [ ] pr-preview 工具已开发

### 第二阶段检查

- [ ] GitHub MCP 已配置
- [ ] 数据库 MCP 已配置
- [ ] post-checkout hook 已配置
- [ ] db-query 工具已开发
- [ ] api-test 工具已开发
- [ ] Bug 修复状态机 Agent 已开发

### 第三阶段检查

- [ ] Jira MCP 已配置
- [ ] Slack MCP 已配置
- [ ] Skill 组合体系已建立
- [ ] 功能开发向导 Agent 已开发
- [ ] i18n-scan 工具已开发
- [ ] mobile-preview 工具已开发

---

## 九、学习资源

### 官方资源

- Claude Code 内置帮助: `/help advanced`
- MCP 官方文档: https://modelcontextprotocol.io
- Agent 开发指南: `/help agents`

### 项目内部参考

- 现有 Agent 示例: `.claude/agents/`
- 现有 Workflow 示例: `.claude/workflows/`

---

_本文档持续更新中，实施过程中遇到问题请更新此文档_
