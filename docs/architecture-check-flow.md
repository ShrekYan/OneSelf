# 架构合规性检查 - 完整流程链路图

> **文档版本**: v2.0
> **最后更新**: 2026-05-08
> **用途**: 学习归档 - 理解从 Claude 编辑代码到违规日志写入的完整执行链路

---

## 📋 目录

1. [整体架构总览](#整体架构总览)
2. [核心模块关系图](#核心模块关系图)
3. [详细执行步骤分解](#详细执行步骤分解)
4. [关键数据结构定义](#关键数据结构定义)
5. [错误处理与边界情况](#错误处理与边界情况)
6. [文件清单与职责划分](#文件清单与职责划分)

---

## 整体架构总览

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           Claude Code 开发环境                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐     │
│  │   1. Claude AI  │    │  2. PostToolUse  │    │  3. Git 版本控制  │     │
│  │   生成/修改代码  │───▶│      Hook        │───▶│   检测文件变化    │     │
│  │    (Edit/Write) │    │ (自动触发检查)   │    │                  │     │
│  └──────────────────┘    └──────────────────┘    └──────────────────┘     │
│                                      │                                        │
│                                      ▼                                        │
│  ┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐     │
│  │  6. Git Hook    │◀───│   5. ESLint 规则  │◀───│ 4. 检查主脚本    │     │
│  │  (提交前拦截)    │    │   (规则匹配)      │    │ (调用 ESLint)     │     │
│  └──────────────────┘    └──────────────────┘    └──────────────────┘     │
│                                      │                                        │
│                                      ▼                                        │
│  ┌──────────────────┐    ┌──────────────────┐                               │
│  │  7. 违规记录器   │───▶│  8. 日志存储     │                               │
│  │  (共享模块)      │    │  (JSON 文件)     │                               │
│  │  - 去重         │    │                  │                               │
│  │  - 统计         │    │                  │                               │
│  │  - 写入         │    │                  │                               │
│  └──────────────────┘    └──────────────────┘                               │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 核心模块关系图

### 模块依赖关系

```
post-edit-check.js (主入口)
    │
    ├──▶ stdin 解析 (Claude 工具输入)
    │
    ├──▶ Git 文件检测
    │     ├── git diff --name-only (已追踪文件)
    │     └── git ls-files --others (未追踪新文件)
    │
    ├──▶ ESLint 调用
    │     └── eslint-formatter.js (输出格式化)
    │           └── 输出: 人类可读信息 + 结构化 JSON 数据
    │
    └──▶ violation-logger.js (共享记录模块)
          │
          ├── 读取 review-log.json
          ├── 去重检查
          ├── 违规对象构造
          ├── 统计数据更新
          └── 写回 JSON 文件

auto-check.js (批量检查)
    │
    ├──▶ Git status --porcelain 检测
    └──▶ 复用 violation-logger.js
```

### 数据流方向

```
Claude 操作
    ↓
工具调用信息 (JSON)
    ↓
修改文件路径列表
    ↓
ESLint 检查结果
    ↓
违规结构化数据
    ↓
review-log.json (持久化存储)
```

---

## 详细执行步骤分解

### 阶段 1: 触发与输入解析

| 步骤 | 说明                                | 关键代码                                    |
| ---- | ----------------------------------- | ------------------------------------------- |
| 1.1  | Claude 完成代码编辑/写入操作        | `Edit` / `Write` / `MultiEdit` 工具         |
| 1.2  | PostToolUse 钩子自动触发            | `.claude/settings.json` 配置                |
| 1.3  | 执行命令: `node post-edit-check.js` | `onFailure: notify`                         |
| 1.4  | 脚本从 stdin 读取工具调用 JSON      | `readToolInput()` 函数                      |
| 1.5  | 从 JSON 中提取修改的文件路径        | `tool_input.file_path` / `tool_input.paths` |

**stdin 数据格式示例**:

```json
{
  "tool_name": "Edit",
  "tool_input": {
    "file_path": "/path/to/file.ts",
    "old_string": "...",
    "new_string": "..."
  }
}
```

---

### 阶段 2: 文件检测与过滤

| 步骤 | 说明                            | 关键代码                                    |
| ---- | ------------------------------- | ------------------------------------------- |
| 2.1  | 判断是否从 stdin 解析到文件     | `filesToCheck.length === 0`                 |
| 2.2  | ✅ Fallback: 检测已追踪文件修改 | `git diff --name-only`                      |
| 2.3  | ✅ Fallback: 检测未追踪新文件   | `git ls-files --others --exclude-standard`  |
| 2.4  | 合并并去重文件列表              | `[...new Set([...modified, ...untracked])]` |
| 2.5  | 过滤只保留代码文件              | `/\.(ts\|tsx\|js\|jsx)$/`                   |
| 2.6  | 识别文件所属服务                | 匹配 `SERVICES` 数组中的目录前缀            |

**服务识别逻辑**:

```javascript
const SERVICES = [
  { name: 'web', cwd: 'apps/web' },
  { name: 'backend', cwd: 'services/backend' },
  { name: 'auth-service', cwd: 'services/auth-service' },
  { name: 'log-service', cwd: 'services/log-service' },
];
```

---

### 阶段 3: ESLint 规则检查

| 步骤 | 说明                          | 关键代码                                       |
| ---- | ----------------------------- | ---------------------------------------------- |
| 3.1  | 计算文件相对服务目录的路径    | `path.relative(service.cwd, filePath)`         |
| 3.2  | 计算 formatter 相对路径       | `path.relative(serviceDir, formatterPath)`     |
| 3.3  | 执行 ESLint 命令              | `npx eslint <file> -f <formatter>`             |
| 3.4  | ESLint 加载配置和自定义插件   | `eslint.config.js` 中的 `@claude/architecture` |
| 3.5  | 规则匹配检测违规              | 5 条自定义规则的 AST 节点匹配                  |
| 3.6  | 收集违规结果                  | 包含规则名、行号、列号、错误信息               |
| 3.7  | ✅ 正常退出 / ❌ 违规退出码 1 | `try/catch` 捕获两种情况                       |

**ESLint 调用参数示例**:

```bash
cd apps/web && npx eslint src/file.ts -f ../../.claude/contracts/cli/eslint-formatter.js
```

---

### 阶段 4: Formatter 输出处理

| 步骤 | 说明                                 | 关键代码                                                |
| ---- | ------------------------------------ | ------------------------------------------------------- |
| 4.1  | Formatter 接收完整 lint results 数组 | ESLint 内置机制                                         |
| 4.2  | 过滤只保留架构规则违规               | `ruleId.startsWith('@claude/architecture/')`            |
| 4.3  | 格式化人类可读的错误信息             | 显示文件、行号、错误描述、规则名                        |
| 4.4  | 构造结构化违规数据数组               | `{ ruleId, filePath, line, column, message, severity }` |
| 4.5  | 输出标记包裹的 JSON 数据             | `__VIOLATION_DATA__ + JSON + __END__`                   |

**输出格式设计**:

```
📁 文件: /path/to/file.ts
  3:3  ❌ 违反 ADR-003：禁止使用 localStorage 存储 Token...
  规则: @claude/architecture/adr-003-no-localstorage-token

__VIOLATION_DATA__[{"ruleId":"...","filePath":"...",...}]__END__
```

---

### 阶段 5: 违规记录与统计

| 步骤 | 说明                      | 关键代码                                         |
| ---- | ------------------------- | ------------------------------------------------ |
| 5.1  | 主脚本解析 formatter 输出 | `parseViolationsFromOutput()` 正则匹配           |
| 5.2  | 调用共享记录器            | `recordViolations(violations, 'post-edit-hook')` |
| 5.3  | 读取现有日志文件          | `loadLog()` - 不存在则初始化默认结构             |
| 5.4  | **去重检查**              | 同一天 + 同一文件 + 同一规则 = 不重复记录        |
| 5.5  | 提取决策 ID               | `adr-003-no-localstorage-token` → `ADR-003`      |
| 5.6  | 构造标准化违规对象        | 含 ID、日期、决策ID、文件路径、行号、严重级别等  |
| 5.7  | 添加到 violations 数组    | `unshift()` - 最新的在前                         |
| 5.8  | 更新统计计数器            | `totalViolations++`, `totalReviews++`            |
| 5.9  | 更新 Top 违规决策排行     | 按 count 降序排序                                |
| 5.10 | 写回 JSON 文件            | `saveLog()` - 格式化 JSON 输出                   |

**去重逻辑核心代码**:

```javascript
const duplicate = log.violations.find(
  v => v.date === today && v.filePath === file && v.ruleName === ruleId,
);
```

---

### 阶段 6: 结果通知与收尾

| 步骤 | 说明                       | 关键代码                     |
| ---- | -------------------------- | ---------------------------- |
| 6.1  | 输出美观的分隔线和统计     | `'='.repeat(70)`             |
| 6.2  | 显示记录的违规数量         | `已自动记录 X 条架构违规`    |
| 6.3  | 有违规时 `process.exit(1)` | 触发 Claude Code notify 行为 |
| 6.4  | 无违规时 `process.exit(0)` | 静默通过，不干扰开发         |

---

## 关键数据结构定义

### 1. 违规对象 (Violation)

```typescript
interface Violation {
  id: string; // V-20260508-01
  date: string; // YYYY-MM-DD
  decisionId: string; // ADR-003 / FADR-001
  ruleName: string; // @claude/architecture/adr-003-no-localstorage-token
  description: string; // 人类可读的错误信息
  filePath: string; // 完整绝对路径
  line: number; // 行号
  column: number; // 列号
  severity: 'high' | 'medium';
  fixed: boolean; // 是否已修复
  notes: string; // 备注信息
  recordedBy: string; // 来源: post-edit-hook / auto-check / manual
}
```

### 2. 月度统计 (MonthlyStats)

```typescript
interface MonthlyStats {
  totalReviews: number; // 总检查次数
  totalViolations: number; // 总违规次数
  topViolatedDecisions: Array<{
    decisionId: string; // 决策 ID
    count: number; // 违规次数
    lastViolated: string; // 最后违规日期
  }>;
}
```

### 3. 完整日志结构 (review-log.json)

```typescript
interface ReviewLog {
  schemaVersion: string; // 1.0
  project: string; // claude-blog-monorepo
  lastUpdated: string | null; // 最后更新日期
  violations: Violation[]; // 违规列表（最新在前）
  monthlyStats: MonthlyStats; // 统计数据
  usageGuide: {
    // 使用说明
    howToRecord: string;
    autoHook: string;
    autoCheckScript: string;
    monthlyReview: string;
  };
}
```

---

## 错误处理与边界情况

### ✅ 已处理的边界情况

| 场景                   | 处理方式                         |
| ---------------------- | -------------------------------- |
| stdin 为空 / 无效 JSON | Fallback 到 git 检测             |
| git 命令执行失败       | 静默退出，不阻断流程             |
| 新创建的未追踪文件     | `git ls-files --others` 补充检测 |
| 同一天同一文件同一规则 | 去重，只记录一次                 |
| ESLint 退出码非 0      | catch 捕获，继续处理             |
| formatter 输出解析失败 | 返回空数组，不崩溃               |
| review-log.json 不存在 | 自动初始化默认结构               |

### ❌ 未处理的极端情况（设计决策）

| 场景                     | 决策说明                             |
| ------------------------ | ------------------------------------ |
| 日志文件损坏 / 无效 JSON | 直接报错（手动修复，不自动覆盖）     |
| 并发写入日志文件         | 低概率场景，暂不加锁（文件操作很快） |
| 跨月统计重置             | 每月手动分析时处理，不自动重置       |

---

## 文件清单与职责划分

### CLI 工具集

| 文件                  | 职责                                       | 设计原则                            |
| --------------------- | ------------------------------------------ | ----------------------------------- |
| `post-edit-check.js`  | PostToolUse 钩子入口，流程主控             | 尽量薄，只做流程编排                |
| `auto-check.js`       | 手动批量检查工具                           | 复用共享模块，逻辑与主脚本一致      |
| `eslint-formatter.js` | ESLint 输出格式化                          | 只做两件事：人读的信息 + 结构化数据 |
| `violation-logger.js` | ✅ **共享核心模块** - 日志读写、去重、统计 | 单一职责，可复用                    |
| `record-violation.js` | 手动记录 CLI 工具                          | 兼容已有调用方式                    |

### 规则与配置

| 文件                   | 职责                                 |
| ---------------------- | ------------------------------------ |
| `contracts/index.js`   | ESLint 插件入口，导出所有规则        |
| `contracts/rules/*.js` | 5 条架构规则的具体实现               |
| `*/eslint.config.js`   | 各服务的 ESLint 配置，集成自定义插件 |

### 数据存储

| 文件              | 职责                  |
| ----------------- | --------------------- |
| `review-log.json` | 违规数据库 + 统计数据 |

---

## 设计决策总结

### ✅ 好的设计决策

| 决策                            | 收益                           |
| ------------------------------- | ------------------------------ |
| 记录逻辑从 formatter 移到主脚本 | 可控、可测、可调试             |
| 提取 violation-logger 共享模块  | 消除重复代码，一处修改多处生效 |
| formatter 输出带标记的 JSON     | 人机友好，同时保持兼容性       |
| git diff + ls-files 双重检测    | 不漏掉新创建的文件             |
| 按天+文件+规则去重              | 避免重复记录，统计准确         |
| 失败时 exit(0) 不阻断           | 不影响正常开发体验             |

### 📝 可优化点（学习思考）

1. **并发写入**：极端高并发场景下，可以加文件锁
2. **按月归档**：每月自动归档日志，避免文件过大
3. **增量更新**：只写变动部分，不用整个文件重写
4. **数据库替换**：违规量上来后可以换成 SQLite
5. **修复状态追踪**：集成 git blame，自动标记已修复的违规

---

## 学习要点

### 1. 关注点分离

- **流程控制** vs **业务逻辑** vs **数据存储**
- formatter 只负责格式化，不负责存储
- 主脚本只负责编排，不包含业务细节

### 2. 容错设计

- 多层 fallback（stdin → git diff → git ls-files）
- 失败时静默 degrade，不阻断主流程
- 边界情况考虑周全（空输入、新文件、重复等）

### 3. 可观测性

- 结构化日志，方便后续分析
- 明确的来源标记（recordedBy）
- 统计数据自动聚合，不需要人工数

### 4. 渐进式重构

- 先让它跑起来
- 再把重复逻辑提取成共享模块
- 最后优化边缘情况和性能

---

**文档版本**: v2.0
**归档位置**: `docs/architecture-check-flow.md`
**对应系统版本**: 架构治理 v2.0
