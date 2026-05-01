# Workflow vs Orchestrator 区别学习指南

> 📚 学习日期：2026-05-01
> 🎯 适用场景：Claude Code 自动化流程选择

---

## 一、一句话结论

| 技术                   | 文件格式         | 执行者       | 通俗理解                                         | 适用场景                       |
| ---------------------- | ---------------- | ------------ | ------------------------------------------------ | ------------------------------ |
| **Workflow**           | `.yml` YAML 配置 | 引擎自动执行 | 🎮 **游戏机** - 按固定按钮，程序按写死的流程跑   | 简单、固定、需要确定性的任务   |
| **Orchestrator Agent** | `.md` Markdown   | LLM 理解执行 | 🎬 **导演** - 灵活指挥演员，随机应变，有判断逻辑 | 复杂、灵活、需要智能处理的任务 |

---

## 二、直观代码对比

同样是「编排 3 个 Agent 做代码审查」，看看两种写法的区别：

### 2.1 Workflow 写法（YAML 配置）

```yaml
# .claude/workflows/frontend-code-review.yml
steps:
  - name: 代码质量审查
    agent: frontend-code-reviewer-agent # 固定写死调用哪个
    prompt: | # 固定写死 prompt 内容
      请检查 TypeScript 类型安全、React 最佳实践...

  - name: 安全漏洞检查
    agent: frontend-security-auditor # 固定写死
    prompt: |
      请扫描 XSS、注入、敏感信息泄露...

  - name: 性能优化分析
    agent: frontend-performance-expert-agent # 固定写死
    prompt: |
      请分析包体积、渲染性能...
```

**特点**：

- ✅ 顺序固定，一步一步执行
- ❌ 前一步的结果**不能**动态传给后一步
- ❌ 没有判断逻辑（除了简单的 `if`）

---

### 2.2 Orchestrator Agent 写法（自然语言）

```markdown
# .claude/agents/full-frontend-review-orchestrator.md

## 步骤 3: 评估第一阶段结果

- 统计严重问题（🔴）的数量
- 如果 `--continue-on-error` 未设置 且 存在严重问题：
  - 停止执行，输出已获得的结果
  - 提示用户先修复严重问题后再继续后续检查
- 如果没有严重问题 或 --continue-on-error 已设置：继续下一步

## 步骤 4: 触发第二阶段 - 安全漏洞扫描

- 在 prompt 中提示安全审计师：
  "第一阶段代码审查已完成，这里列出了发现的可疑问题，
  请重点关注这些区域：[粘贴第一阶段发现的问题列表]"
```

**特点**：

- ✅ 有复杂的判断逻辑
- ✅ 可以动态传递结果
- ✅ LLM 理解自然语言，灵活执行

---

## 三、四项核心区别对比表

| 对比维度       | Workflow (YAML)                   | Orchestrator Agent (Markdown)               |
| -------------- | --------------------------------- | ------------------------------------------- |
| **表达能力**   | ❌ 有限，只能顺序执行简单步骤     | ✅ 无限，支持任意复杂逻辑判断               |
| **流程灵活性** | ❌ 写死了，改流程必须改 YAML 文件 | ✅ LLM 理解自然语言，可以灵活变通           |
| **结果传递**   | ❌ 前一步结果不能动态传给后一步   | ✅ 可以把前一步发现的问题告诉后一步重点关注 |
| **结果整合**   | ❌ 只能简单 echo 输出文本         | ✅ 可以整合、排序、格式化、总结输出         |
| **条件执行**   | ⚠️ 支持简单的 `if` 条件判断       | ✅ 支持任意复杂的判断逻辑                   |
| **学习门槛**   | ✅ 简单，像写 GitHub Actions      | ⚠️ 需要会写 Agent prompt                    |
| **可预测性**   | ✅ 100% 可预测，不会出意外        | ⚠️ LLM 执行可能有小偏差                     |
| **Shell 命令** | ✅ 原生支持 `run: npm run lint`   | ⚠️ 需要通过 Bash 工具调用                   |

---

## 四、整体架构关系图

```
┌─────────────────────────────────────────────────────┐
│                  用户触发层                           │
│  /workflow run frontend-code-review                 │
│  /full-frontend-review src/                         │
└─────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────┐
│                  编排方式选择层                      │
│                                                     │
│  ┌──────────────────┐     ┌─────────────────────┐  │
│  │   Workflow 层    │     │  Orchestrator Agent │  │
│  │   (YAML 配置)    │     │   (自然语言驱动)    │  │
│  └──────────────────┘     └─────────────────────┘  │
│           ↓                          ↓              │
│    简单、固定流程              复杂、灵活、有判断  │
│    无需 LLM 理解               完全依赖 LLM 理解    │
└─────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────┐
│                  执行层 (专业 Agent)                 │
│  frontend-code-reviewer                              │
│  frontend-security-auditor                           │
│  frontend-performance-expert                         │
│  backend-architect                                   │
│  ... 其他专业 Agent                                  │
└─────────────────────────────────────────────────────┘
```

---

## 五、选择指南：新手怎么选？

### ✅ 优先选 Workflow 的场景

#### 场景 1：简单重复的固定流程

```yaml
# 例子：提交代码前的自动化检查
steps:
  - run: npm run lint
  - run: npx tsc --noEmit
  - run: npm run test
```

#### 场景 2：需要执行 Shell 命令

- 构建项目 `npm run build`
- 部署项目 `npm run deploy`
- 运行脚本 `node cleanup.js`
- 调用命令行工具

#### 场景 3：需要 100% 确定性

- 不希望 LLM "自由发挥"
- 每次执行结果必须完全一致
- 不能有任何偏差的生产环境任务

---

### ✅ 必须选 Orchestrator Agent 的场景

#### 场景 1：需要复杂判断逻辑

```
- 如果发现超过 3 个严重问题，停止执行
- 如果用户传了 --continue-on-error 参数，忽略问题继续
- 如果问题数量 > 10，建议用户分批次修复
```

#### 场景 2：需要结果传递和智能整合

```
- 把前一步发现的 5 个问题列表告诉后一步 Agent
- 让后一步 Agent "重点关注这些有问题的区域"
- 最后整合 3 份报告，按 P0/P1/P2 优先级重新排序
```

#### 场景 3：需要 LLM 智能处理

- 理解复杂的用户输入（自然语言描述的需求）
- 动态生成 prompt 内容
- 总结、格式化、分析大量信息

---

## 六、项目实际例子分析

### 例子 1：`pre-commit-check.yml` → 用 Workflow 是正确的

```yaml
# .claude/workflows/pre-commit-check.yml
steps:
  - run: npm run lint # 固定命令
  - run: npx tsc --noEmit # 固定命令
  - if: changed_files matches "^services/" # 简单条件
    run: cd services/backend && npm run lint
```

**✅ 为什么选择正确？**

- 都是跑固定的 shell 命令
- 逻辑非常简单，不需要 LLM 理解
- 结果 100% 确定，零偏差
- 符合 Workflow 的最佳适用场景

---

### 例子 2：`full-frontend-review-orchestrator.md` → 必须用 Orchestrator

**❌ 为什么不能用 Workflow？**

1. ❌ Workflow 做不到「统计前一步的严重问题数量」
2. ❌ Workflow 做不到「根据数量判断要不要停止」
3. ❌ Workflow 做不到「把前一步的问题列表粘贴到后一步的 prompt 中」
4. ❌ Workflow 做不到「最后整合三份报告，统一按优先级排序」

👉 **这些都是 LLM 才能做的事，Workflow 做不到！**

---

## 七、进阶玩法：混合使用

两种编排方式不是互斥的，可以组合使用：

```
用户触发 /pre-commit-and-review workflow
    ↓
[Workflow 执行]
    ├─ Step 1: npm run lint
    ├─ Step 2: npx tsc --noEmit
    └─ Step 3: 调用 full-frontend-review-orchestrator Agent
              ↓
              [Orchestrator Agent 执行]
                  ├─ Step 1: 调用代码质量审查 Agent
                  ├─ Step 2: 判断问题数量，决定是否继续
                  ├─ Step 3: 调用安全漏洞扫描 Agent
                  ├─ Step 4: 调用性能优化分析 Agent
                  └─ Step 5: 整合输出综合报告
    ↓
返回最终结果给用户
```

---

## 八、新手学习路径建议

### 🎯 第一阶段：先学会用 Workflow（1-2 小时）

Workflow 简单，和 GitHub Actions / GitLab CI 几乎一样：

```yaml
# 写一个最简单的 workflow
name: 我的第一个 workflow
steps:
  - name: 打招呼
    run: echo "Hello World!"

  - name: 检查代码格式
    run: npm run lint
```

**练习任务**：写一个 workflow，依次执行 `npm run lint` → `npx tsc --noEmit` → `npm run build`

---

### 🎯 第二阶段：再学 Orchestrator（3-4 小时）

当你遇到 Workflow 解决不了的问题时（需要判断、传参、整合），再升级：

1. 读一遍 `full-frontend-review-orchestrator.md` 源码
2. 实际运行一次看看效果
3. 仿写一个简单的「后端完整审查编排器」

---

### 🎯 第三阶段：混合使用（进阶）

根据任务特点灵活选择：

- 固定命令部分 → 用 Workflow
- 智能判断部分 → 用 Orchestrator Agent

---

## 九、常见问题 FAQ

### Q1：YAML 也支持 `if`，为什么还要 Orchestrator？

A：Workflow 的 `if` 只能做**非常简单**的条件判断，比如：

```yaml
if: changed_files matches "^src/" # 只能判断字符串匹配
```

而 Orchestrator 可以做**任意复杂**的判断：

```
- 如果严重问题数量 > 3 且 用户没传 --force 参数
- 或者 用户是新手并且问题涉及安全漏洞
- 那么：停止执行，并给出友好的提示
```

---

### Q2：既然 Orchestrator 更强大，为什么不都用 Orchestrator？

A：因为 Orchestrator 依赖 LLM，有两个小缺点：

1. **成本更高**：每次执行都要消耗 Token
2. **有小概率偏差**：LLM 可能会有小的理解偏差

所以：**简单的事用简单的工具（Workflow），复杂的事用复杂的工具（Orchestrator）**

---

### Q3：什么时候该从 Workflow 升级到 Orchestrator？

A：当你发现自己在想：

> "如果我能让前面的结果影响后面的步骤就好了"
> "如果我能把 Step 1 发现的问题告诉 Step 2 就好了"
> "如果我能根据结果多少动态调整输出就好了"

这时候就是升级的信号！

---

## 十、关键文件速查

| 文件路径                                              | 类型         | 说明                     |
| ----------------------------------------------------- | ------------ | ------------------------ |
| `.claude/workflows/pre-commit-check.yml`              | Workflow     | 预提交检查示例           |
| `.claude/workflows/frontend-code-review.yml`          | Workflow     | 前端审查 Workflow 版     |
| `.claude/agents/full-frontend-review-orchestrator.md` | Orchestrator | 前端审查 Orchestrator 版 |

---

## 📌 总结记忆口诀

| 工具                              | 记忆口诀                          |
| --------------------------------- | --------------------------------- |
| **Workflow (YAML)**               | **简单固定**的事，用 Workflow     |
| **Orchestrator Agent (Markdown)** | **复杂灵活**的事，用 Orchestrator |

> 💡 新手原则：先试试 Workflow 能不能解决，解决不了再上 Orchestrator。能用简单工具解决的，就不要用复杂工具。

---

_本指南基于项目实际代码整理，适用于 Claude Code 自动化编排学习_
