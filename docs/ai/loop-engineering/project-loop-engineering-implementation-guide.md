# 项目 Loop Engineering 落地实施方案

> **日期**: 2026-06-19
> **文档类型**: AI 协同开发体系落地方案
> **定位**: 基于当前项目现状，定义在 XMind 流程弃用后的 Loop Engineering 主流程、分层架构、落地步骤与优先级。

---

## 1. 核心结论

当前项目已经具备较完整的 AI 协同开发基础，包括：

- `.claude` 规则体系
- Agent / Skill / Command 分层
- SpecKit feature 生命周期
- contracts 架构硬约束
- lint / typecheck / test / build 质量检查
- project memory / auto memory 记忆机制
- 前端、后端、安全、性能审查 Agent

因此，本项目做 Loop Engineering 不应该推倒重来，也不应该继续依赖已弃用的 XMind 流程，而应该围绕以下主线建设：

```text
SpecKit Feature Loop
  + .claude Agent / Skill 执行体系
  + contracts / lint / test / build 评估体系
  + memory / rules / decisions 反馈沉淀体系
```

一句话总结：

> **本项目的 Loop Engineering 应该以 SpecKit feature 生命周期为主线，以 `.claude` 规则和 Agent 体系为执行层，以 contracts 和工程检查为评估层，以 memory / rules / decisions 为沉淀层。**

---

## 2. 不再依赖 XMind 流程

XMind 流程已弃用，后续不再作为 Loop Engineering 主流程依赖。

以下内容只作为历史归档，不再作为新方案基础：

```text
.claude/workflows/xmind-*
.claude/agents/xmind-task-parser.md
.claude/skills/xmind-exec/
docs/xmind/
```

弃用后的影响：

| 原 XMind 职责 | 新替代方案                                                             |
| ------------- | ---------------------------------------------------------------------- |
| 大任务拆分    | SpecKit `spec.md` / `tasks.md`                                         |
| 执行计划      | SpecKit `plan.md`                                                      |
| 任务执行记录  | `progress.md`                                                          |
| 质量检查结果  | `verification.md`                                                      |
| 审查报告      | `review.md`                                                            |
| 复盘沉淀      | `retro.md`                                                             |
| 经验沉淀      | `.claude/project-memory.md` / `.claude/rules` / `.claude/DECISIONS.md` |

---

## 3. 推荐总架构

建议将项目 Loop Engineering 拆成 6 层。

```text
┌────────────────────────────────────┐
│  1. Goal Loop                       │
│  spec.md / CLAUDE.md / DECISIONS    │
└────────────────────────────────────┘
                  ↓
┌────────────────────────────────────┐
│  2. Context Loop                    │
│  rules / memory / project info      │
└────────────────────────────────────┘
                  ↓
┌────────────────────────────────────┐
│  3. Action Loop                     │
│  Agent / Skill / Command            │
└────────────────────────────────────┘
                  ↓
┌────────────────────────────────────┐
│  4. Eval Loop                       │
│  lint / tsc / test / build / review │
└────────────────────────────────────┘
                  ↓
┌────────────────────────────────────┐
│  5. Feedback Loop                   │
│  progress / verification / review   │
└────────────────────────────────────┘
                  ↓
┌────────────────────────────────────┐
│  6. Memory & Governance Loop        │
│  memory / rules / decisions / contracts │
└────────────────────────────────────┘
```

---

## 4. 主流程：SpecKit Feature Loop

后续每个非简单 feature，建议统一使用以下目录结构：

```text
specs/<domain>/<feature>/
├── spec.md          # 需求真相源
├── plan.md          # 技术方案
├── tasks.md         # 执行任务
├── contracts/       # 行为契约
├── quickstart.md    # 验证方式
├── progress.md      # 执行进度
├── verification.md  # 工程验证结果
├── review.md        # AI 审查结果
└── retro.md         # 复盘与沉淀判断
```

其中已有的 SpecKit 文件继续保留：

| 文件            | 职责                             |
| --------------- | -------------------------------- |
| `spec.md`       | 描述需求、用户故事、验收标准     |
| `plan.md`       | 描述技术方案、架构影响、约束检查 |
| `tasks.md`      | 拆分具体执行任务                 |
| `contracts/`    | 定义功能契约或接口契约           |
| `quickstart.md` | 定义如何验证功能                 |

新增建议文件：

| 文件              | 职责                                                                      |
| ----------------- | ------------------------------------------------------------------------- |
| `progress.md`     | 记录当前执行进度、已完成任务、阻塞事项                                    |
| `verification.md` | 记录 lint、typecheck、test、build 等确定性检查结果                        |
| `review.md`       | 记录代码审查、安全审查、性能审查结果                                      |
| `retro.md`        | 记录本次任务复盘，以及是否需要更新 memory / rules / decisions / contracts |

---

## 5. 标准闭环流程

每个 feature 的推荐闭环如下：

```text
1. 需求进入
   ↓
2. 生成或更新 spec.md
   ↓
3. 澄清需求，减少模糊点
   ↓
4. 生成 plan.md
   ↓
5. 生成 tasks.md
   ↓
6. Agent / Skill 执行任务
   ↓
7. 更新 progress.md
   ↓
8. 执行 lint / typecheck / test / build
   ↓
9. 更新 verification.md
   ↓
10. 执行 AI code review / security / performance review
   ↓
11. 更新 review.md
   ↓
12. 人工确认是否完成
   ↓
13. 生成 retro.md
   ↓
14. 判断反馈是否进入 memory / rules / decisions / contracts
   ↓
15. 下一轮任务复用沉淀结果
```

---

## 6. 反馈分流规则

Loop Engineering 最关键的是：任务结束后的反馈要进入正确位置。

### 6.1 分流表

| 反馈类型                      | 存放位置                                |
| ----------------------------- | --------------------------------------- |
| 当前 feature 的临时进展       | `specs/<feature>/progress.md`           |
| 当前 feature 的验证结果       | `specs/<feature>/verification.md`       |
| 当前 feature 的审查结果       | `specs/<feature>/review.md`             |
| 当前 feature 的复盘结论       | `specs/<feature>/retro.md`              |
| 可复用踩坑                    | `.claude/project-memory.md`             |
| 用户个人长期偏好              | auto memory                             |
| 长期架构约束                  | `.claude/DECISIONS.md`                  |
| 前端长期架构规则              | `.claude/FRONTEND-DECISIONS.md`         |
| 后端长期业务规则              | `.claude/BACKEND-BUSINESS-DECISIONS.md` |
| 所有 Agent 都要遵守的通用规则 | `.claude/rules/*.md`                    |
| 可以机器检查的高频红线        | `.claude/contracts/`                    |
| 方法论、流程、认知总结        | `docs/ai/loop-engineering/`             |

### 6.2 判断规则

```text
只影响当前任务？
  → 放 specs/<feature>/

以后可能再次踩坑？
  → 放 .claude/project-memory.md

属于长期架构决策？
  → 放 .claude/DECISIONS.md

属于所有 Agent 都应遵守的规则？
  → 放 .claude/rules/

属于可以机器检查的红线？
  → 放 .claude/contracts/

属于方法论、流程、认知？
  → 放 docs/ai/loop-engineering/
```

---

## 7. Loop Close 动作

建议为每个 feature 完成时增加一次 `Loop Close`。

### 7.1 Loop Close 目标

Loop Close 不是继续开发，而是收口：

```text
确认做完了什么
确认验证是否通过
确认审查是否通过
确认有什么经验需要沉淀
确认是否需要更新长期规则
```

### 7.2 Loop Close 标准步骤

```text
1. 读取当前 feature 的 spec.md / plan.md / tasks.md
2. 汇总任务完成情况
3. 生成或更新 progress.md
4. 汇总 lint / typecheck / test / build 结果
5. 生成或更新 verification.md
6. 汇总代码审查、安全审查、性能审查结果
7. 生成或更新 review.md
8. 生成 retro.md
9. 判断是否需要更新：
   - .claude/project-memory.md
   - .claude/rules/*.md
   - .claude/DECISIONS.md
   - .claude/contracts/
10. 输出下一轮改进建议
```

### 7.3 后续可抽象为 Skill

后续可以新增：

```text
.claude/skills/loop-close/SKILL.md
```

用途：

```text
任务结束时，自动生成 verification / review / retro，并判断是否需要更新长期记忆或规则。
```

---

## 8. 质量门禁建议

当前项目已有质量检查能力，但建议进一步标准化。

### 8.1 前端推荐检查

```bash
cd apps/web && npm run lint
cd apps/web && npx tsc --noEmit
cd apps/web && npm run test:run
cd apps/web && npm run build
```

### 8.2 后端推荐检查

```bash
cd services/backend && npm run lint
cd services/backend && npm run build
cd services/backend && npm run test

cd services/auth-service && npm run lint
cd services/auth-service && npm run build
cd services/auth-service && npm run test

cd services/log-service && npm run lint
cd services/log-service && npm run build
cd services/log-service && npm run test
```

### 8.3 contracts 检查

```bash
node .claude/contracts/cli/auto-check.js
node .claude/contracts/cli/record-violation.js --stats
```

### 8.4 后续建议

建议逐步补齐：

```text
npm run typecheck
npm run lint:check
npm run verify
```

并区分：

```text
lint       = 自动修复
lint:check = 只检查，不修改
```

理由：Loop Engineering 的 Eval Loop 必须稳定、可重复、尽量不依赖人工判断。

---

## 9. contracts 演进方向

当前 `.claude/contracts/` 已经是项目从软治理走向硬治理的关键基础。

已有硬规则包括：

```text
禁止 backend 直接引入 jsonwebtoken
禁止前端 localStorage/sessionStorage 存 Token
禁止 bcrypt 新密码哈希
禁止 prisma as any
禁止 observer() HOC
```

建议后续把高频问题继续升级为 contracts：

| 高频问题                             | 是否适合升级 |
| ------------------------------------ | ------------ |
| 前端禁止 `../../` 相对导入           | 适合         |
| 前端禁止手动设置 Authorization Token | 适合         |
| 后端 DTO 缺少校验装饰器              | 适合         |
| 禁止日志输出完整 Token               | 适合         |
| 禁止新增 bcrypt 密码哈希             | 已有         |
| 禁止 Prisma `as any`                 | 已有         |
| 禁止前端 `observer()` HOC            | 已有         |

演进路线：

```text
踩坑记录
  ↓
review 检查项
  ↓
rules 文档规则
  ↓
contracts 硬约束
  ↓
提交前 / 编辑后自动检查
```

---

## 10. 后端完整审查 Orchestrator

当前前端已有完整审查编排器，但后端还缺同等级能力。

建议后续新增：

```text
.claude/agents/full-backend-review-orchestrator.md
.claude/skills/full-backend-review/SKILL.md
```

建议流程：

```text
nestjs-code-review
  ↓
nestjs-security-audit
  ↓
nestjs-performance-audit
  ↓
必要时 nestjs-test-writer
  ↓
综合报告
```

理由：项目是 Monorepo 全栈项目，如果只有前端完整闭环，整体 Loop Engineering 会偏科。

---

## 11. AI 协作质量指标

Loop Engineering 需要指标，否则无法判断系统是否真的变好。

建议先记录以下指标：

| 指标               | 含义                                         |
| ------------------ | -------------------------------------------- |
| 一次通过率         | AI 修改后第一次 lint / test / build 通过比例 |
| 返工次数           | 同一任务被修复几轮                           |
| P0 / P1 问题数     | 审查发现的严重问题数量                       |
| 架构契约违规数     | contracts 命中次数                           |
| 同类问题复发率     | 之前记录过的问题是否再次出现                 |
| memory 更新次数    | 多少反馈沉淀为项目记忆                       |
| rules 更新次数     | 多少反馈升级为规则                           |
| contracts 更新次数 | 多少规则升级为硬约束                         |

后续可新增文档：

```text
docs/ai/loop-engineering/ai-collaboration-metrics.md
```

---

## 12. 推荐优先级

### P0：建立 Feature Loop 标准文件

先定义并试运行：

```text
progress.md
verification.md
review.md
retro.md
```

这是从“任务执行”进入“任务闭环”的关键一步。

---

### P1：建立反馈分流 SOP

建议新增：

```text
docs/ai/loop-engineering/feedback-to-rule-sop.md
```

用于明确：

```text
什么进 feature？
什么进 memory？
什么进 rules？
什么进 decisions？
什么升级成 contracts？
```

---

### P1：修正质量门禁

重点检查和统一：

```text
package.json
apps/web/package.json
services/backend/package.json
services/auth-service/package.json
services/log-service/package.json
.claude/skills/pre-commit-check/SKILL.md
.husky/pre-push
```

目标是形成稳定的：

```text
lint:check
typecheck
test
build
contracts check
```

---

### P2：新增 Loop Close Skill

建议新增：

```text
.claude/skills/loop-close/SKILL.md
```

用于任务完成时统一收口。

---

### P2：补齐后端完整审查 Orchestrator

建议新增：

```text
.claude/agents/full-backend-review-orchestrator.md
.claude/skills/full-backend-review/SKILL.md
```

---

### P3：建立 AI 协作指标体系

建议新增：

```text
docs/ai/loop-engineering/ai-collaboration-metrics.md
```

先手工记录，后续再自动化。

---

## 13. 最终目标

本项目 Loop Engineering 的最终目标不是让 AI 完全自主开发，而是让每次 AI 协作都形成可复用资产。

目标状态：

```text
每个 feature 有完整闭环记录
每次验证有明确结果
每次审查有落盘报告
每次踩坑有分流判断
每条高频规则能逐步升级为硬约束
每轮执行都让下一轮更稳定
```

最终一句话：

> **让 AI 不只是完成当前任务，而是通过每一次任务持续改进整个项目的规则、检查、记忆和协作质量。**
