# 架构契约规则索引

> **重要提示：Claude Code 在生成代码前必须阅读此文件！**
>
> 本文件定义了项目的硬约束规则，任何生成的代码都不得违反这些规则。
> 如果有冲突，以此文件为准，而不是项目中的旧代码！
> 后期使用的项目越多，可以抽离到NPM包中，方便重复使用。
---

## 规则清单

### 🔴 ADR-002: 认证服务与业务服务分离

**适用范围**: `services/backend/**`, `services/log-service/**`

**规则**:
- ❌ 禁止在 backend 和 log-service 中引入 `jsonwebtoken`
- ✅ Token 签发和验证必须通过 auth-service 的 HTTP 接口完成

**为什么**:
> Token 签发、刷新、验证完全由 auth-service 负责，安全策略统一管理，未来支持多业务服务接入时无需重复实现认证逻辑

---

### 🔴 ADR-003: HttpOnly Cookie 为唯一 Token 存储方案

**适用范围**: `apps/web/**`

**规则**:
- ❌ 禁止使用 localStorage / sessionStorage 存储任何 Token
- ❌ 禁止手动设置 Authorization 请求头
- ✅ Cookie 由后端设置，浏览器自动携带

**为什么**:
> Access Token 和 Refresh Token 全部通过 HttpOnly Cookie 传输，从根本上防御 XSS 攻击窃取 Token，浏览器自动处理，减少前端代码复杂度，符合 OWASP 安全最佳实践

---

### 🟠 ADR-004: 密码加密使用 Argon2id 算法

**适用范围**: `services/**`

**规则**:
- ❌ 禁止使用 bcrypt 哈希新密码
- ✅ 新用户注册默认使用 Argon2id
- ✅ 支持历史 bcrypt 用户静默迁移

**为什么**:
> Argon2 是目前最安全的密码哈希算法，抗 GPU/ASIC 攻击，支持平滑迁移用户无感知

---

### 🟠 ADR-006: Prisma 模型 PascalCase 命名规范

**适用范围**: `services/**`

**规则**:
- ❌ 禁止使用 `(prisma as any)` 绕过类型检查
- ✅ 所有 Prisma 模型名使用 PascalCase 大驼峰命名
- ✅ 数据库表名通过 @@map 映射为 snake_case

**为什么**:
> 类型安全，减少潜在 bug，无需使用 as any 绕过类型检查

---

### 🟡 FADR-003: 禁止使用 observer() HOC

**适用范围**: `apps/web/**`

**规则**:
- ❌ 禁止使用 observer() HOC 包装组件
- ✅ 必须使用 useObserver() Hook

**为什么**:
> 符合 MobX 最新最佳实践，性能更好，类型更安全，与 React 19 兼容性更好

---

## 四层防护系统

本项目采用 **3.5 代架构治理模式**，四层防护确保架构契约零违规：

```
┌─────────────────────────────────────────────────────────┐
│  第一层：生成前预防（Claude 感知层）                        │
│  Claude 生成代码前阅读此文件，从源头上理解约束               │
└──────────────────────────┬──────────────────────────────┘
                           ↓
┌──────────────────────────┴──────────────────────────────┐
│  第二层：IDE 实时提示（ESLint 插件层）                     │
│  写代码时就看到红线，告诉你违反了哪条 ADR                    │
└──────────────────────────┬──────────────────────────────┘
                           ↓
┌──────────────────────────┴──────────────────────────────┐
│  第三层：AI 生成后自动检查（PostToolUse 钩子层）            │
│  Claude 每次 Edit/Write 后自动运行，违规立即通知             │
└──────────────────────────┬──────────────────────────────┘
                           ↓
┌──────────────────────────┴──────────────────────────────┐
│  第四层：提交前强制拦截（Git Hook 层）                     │
│  违反架构的代码根本提交不上去                                │
└──────────────────────────┬──────────────────────────────┘
                           ↓
┌──────────────────────────┴──────────────────────────────┐
│  反馈闭环层：自动记录 + 每月分析                          │
│  review-log.json 记录每次违规，分析趋势，优化规则          │
└─────────────────────────────────────────────────────────┘
```

---

## 规则使用方式

### ESLint 集成

所有规则已集成到项目 ESLint 配置中，保存时自动检查，提交时强制校验。

规则名:
- `@claude/architecture/adr-002-no-jwt-in-backend`
- `@claude/architecture/adr-003-no-localstorage-token`
- `@claude/architecture/adr-004-no-bcrypt-new-password`
- `@claude/architecture/adr-006-no-prisma-as-any`
- `@claude/architecture/fadr-003-no-mobx-observer-hoc`

### PostToolUse 自动检查（第三层防护）

**核心机制**：Claude Code 每一次 Edit/Write/MultiEdit 操作后，会自动运行架构合规性检查。

**配置位置**: `.claude/settings.json`
```json
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

**工作流程**:
1. Claude 完成代码编辑/写入
2. 钩子自动触发，从 stdin 读取工具调用信息，提取修改的文件路径
3. 对每个修改的 TypeScript/JavaScript 文件运行 ESLint 架构规则检查
4. 发现违规时：输出详细错误信息 + 自动记录到 review-log.json + 退出码 1 触发通知
5. 无违规时：静默通过，不干扰正常流程

**手动批量检查**:
```bash
# 检查所有 git 中已修改的文件
node .claude/contracts/cli/auto-check.js
```

---

## Claude Code 操作指南

### 生成代码前

1. ✅ 先阅读此文件，理解所有边界约束
2. ✅ 确认要生成的代码属于哪个服务/模块
3. ✅ 检查适用范围对应的规则

### 生成代码时

1. ❌ 绝对不要生成违反上述规则的代码
2. ✅ 如果需求违反规则，立即提出，不要沉默
3. ✅ 生成代码后，主动对照规则自查

### 发现违规时

如果发现项目中已有违反规则的旧代码：
1. ✅ 记录到 `review-log.json`
2. ✅ 可以提出重构建议，但不要在本次任务中擅自修改

---

## 📊 反馈闭环与违规记录

### 自动记录机制

ESLint Formatter 已集成自动记录功能。每次运行 lint 时，架构规则违规会自动记录到运行时文件 `review-log.json`。该文件不存在时会自动初始化，且不纳入版本控制。

### CLI 工具使用

```bash
# 显示统计信息
node .claude/contracts/cli/record-violation.js --stats

# 交互式手动记录违规
node .claude/contracts/cli/record-violation.js

# 直接传参记录违规
node .claude/contracts/cli/record-violation.js \
  --decision ADR-003 \
  --desc "Claude 生成代码时使用了 localStorage 存 token" \
  --file "src/api/test.ts" \
  --severity high \
  --notes "Claude 可能没注意到 ADR-003 的边界约束"
```

### 月度分析流程

每个月花 30 分钟分析：
1. 运行 `--stats` 查看整体情况
2. 找出 Top 违反的决策
3. 分析原因：是规则描述不清晰？还是 Claude 没注意到？
4. 优化规则描述或在 ESLint 规则中添加更详细的错误提示
5. 更新 DECISIONS.md 中的说明，重点强调高频违规点

---

## 🔧 维护说明

新增架构决策时：
1. 在 `DECISIONS.md` 中添加决策文档
2. 在 `rules/` 目录下添加对应 ESLint 规则
3. 在 `index.js` 中导出新规则
4. 更新此 README.md，添加规则说明

**最后更新**: 2026-05-08
**规则版本**: v1.1
**治理模式**: 3.5 代 - PostToolUse 四层防护
