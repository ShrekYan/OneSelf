# 后端开发工作流指南

本文档描述了使用三个专用 Agent 进行 NestJS 后端开发的完整工作流。

## 三个专用 Agent

| Agent | 调用命令 | 职责 |
|--------|---------|------|
| 🧑‍💻 **nestjs-code-review** | `/agent nestjs-code-review` | 代码规范审查专家，对照项目规范逐项检查 |
| 🔒 **nestjs-security-audit** | `/agent nestjs-security-audit` | 安全漏洞扫描专家，识别 OWASP Top 10 风险 |
| 🧪 **nestjs-test-writer** | `/agent nestjs-test-writer` | 测试编写专家，为 Controller/Service 生成完整 Jest 单元测试 |

## 三套工作流方案

针对不同场景、不同开发者经验，提供三套方案：

---

### 方案一：逐次迭代型（推荐新手 / 小功能开发）

**适用场景**：
- 新手开发者，刚接触项目
- 开发单个小功能/修复单个 Bug
- 需要一步步验证每一步正确性

**工作流程**：

```mermaid
graph TD
    A[1. 编写业务代码] --> B[2. 写完一个模块<br/>(Controller + Service)]
    B --> C[3. 生成单元测试<br/>/agent nestjs-test-writer]
    C --> D[4. 运行测试<br/>npm run test]
    D --> E[5. 代码规范审查<br/>/agent nestjs-code-review]
    E --> F[6. 修复 T0/T1 问题]
    F --> G[7. 安全漏洞扫描<br/>/agent nestjs-security-audit]
    G --> H[8. 修复安全问题]
    H --> I[9. 提交代码]
```

**优点**：
- 每一步都验证，问题发现早，容易定位
- 新手可以逐步学习项目规范
- 心理压力小，一次只解决一类问题

**缺点**：
- 流程偏慢，大功能耗时较长

---

### 方案二：批量完成型（推荐熟练开发者 / 较大功能开发）

**适用场景**：
- 熟练开发者，熟悉项目规范
- 开发一个较大的功能模块（多个接口）
- 喜欢先完成业务逻辑，再统一处理测试和审查

**工作流程**：

```mermaid
graph TD
    A[1. 完成所有业务代码开发<br/>(Controller + Service + DTO)] --> B[2. 逐个生成单元测试<br/>对每个 Controller/Service:<br/>/agent nestjs-test-writer]
    B --> C[3. 统一运行所有测试<br/>npm run test]
    C --> D[4. 统一代码规范审查<br/>逐个文件粘贴给<br/>/agent nestjs-code-review]
    D --> E[5. 一次性修复 T0/T1]
    E --> F[6. 统一安全漏洞扫描<br/>/agent nestjs-security-audit]
    F --> G[7. 修复所有 T0 安全问题]
    G --> H[8. 检查覆盖率<br/>npm run test:cov]
    H --> I[9. 提交代码]
```

**优点**：
- 上下文切换少，开发效率高
- 业务逻辑开发时思路连贯不中断
- 适合一次性完成较大功能

**缺点**：
- 问题发现晚，有时候定位困难
- 需要开发者对规范比较熟悉

---

### 方案三：CI/CD 集成型（推荐团队协作 / 成熟项目）

**适用场景**：
- 团队协作开发
- 已有 CI 流程（GitHub Actions/GitLab CI）
- 熟练开发者，熟悉项目规范

**工作流程**：

```mermaid
graph TD
    A[1. 本地完成业务代码开发] --> B[2. 本地生成单元测试<br/>/agent nestjs-test-writer]
    B --> C[3. 本地运行测试通过<br/>npm run test]
    C --> D[4. 本地代码规范审查<br/>(可选，快速检查)<br/>/agent nestjs-code-review]
    D --> E[5. 提交 Pull Request]
    E --> F[6. CI 自动运行<br/>- npm run lint<br/>- npm run test<br/>- npx tsc --noEmit]
    F --> G[CI 通过<br/>人工代码审查]
    G --> H[自动检查:<br/>1. /agent nestjs-code-review<br/>2. /agent nestjs-security-audit]
    H --> I[修复问题 → CI 重新检查]
    I --> J[合并代码]
```

**优点**：
- 本地开发快，很多检查交给 CI
- 代码审查时自动做规范检查和安全扫描，节省人工时间
- 团队协作标准化，每个人都遵循相同流程

**缺点**：
- 需要 CI 配置支持
- 反馈周期比本地检查长

---

## 三套方案对比

| 对比项 | 方案一 逐次迭代 | 方案二 批量完成 | 方案三 CI集成 |
|--------|---------------|---------------|--------------|
| **适用人群** | 新手/单人 | 熟手/单人 | 团队/协作 |
| **功能大小** | 小功能/Bug修复 | 中大型功能 | 任意大小 |
| **发现问题时机** | 早 | 晚 | 中等（CI自动） |
| **开发效率** | 慢 | 快 | 中等 |
| **学习曲线** | 平缓（边做边学） | 陡峭（需要熟悉规范） | 中等 |
| **推荐指数** | ⭐⭐⭐⭐⭐（新手首选） | ⭐⭐⭐⭐⭐（熟手首选） | ⭐⭐⭐⭐⭐（团队首选） |

---

## 快速选择指南

| 你的情况 | 推荐方案 |
|----------|----------|
| 我是新手，刚学这个项目 | **方案一 逐次迭代** |
| 我熟练了，开发一个中等功能 | **方案二 批量完成** |
| 我们是团队开发，有 CI | **方案三 CI集成** |
| 我只改一个 Bug | **方案一** 或者 **方案二** |
| 我要新增一个完整模块 | **方案二** 或者 **方案三** |

---

## 各阶段使用提示

### 🧪 测试编写阶段 (`nestjs-test-writer`)

- 生成完后**一定要运行**：`npm run test 文件名` 验证能跑通
- 如果测试失败，把错误信息贴给 agent，让它帮你修复
- 覆盖率不够时，可以让 agent 补充缺失的测试用例
- 单元测试和源文件放同一目录，命名 `*.spec.ts`

### 🧑‍💻 代码审查阶段 (`nestjs-code-review`)

- 一次审查一个文件，结果更清晰
- 优先级：优先修复 **T0**，再修复 **T1**，**T2** 可以后续迭代
- 如果问题太多，可以分多次修复
- 严格对照本项目规范，不会输出和项目冲突的建议

### 🔒 安全扫描阶段 (`nestjs-security-audit`)

- **T0** 问题必须修复才能合并
- **T1** 问题建议修复，如果时间紧可以放到后续迭代
- **T2** 可以后续优化
- 每次扫描尽量不超过 500 行代码，结果更准确

---

## 文件位置

```
backend/.claude/agents/
├── nestjs-code-review-agent.md    # 代码审查专家
├── nestjs-security-audit-agent.md # 安全漏洞扫描专家
└── nestjs-test-writer-agent.md    # 测试编写专家
```

## 使用示例

### 示例：写完 article.service.ts 后

```bash
# 1. 生成单元测试
/agent nestjs-test-writer
# 粘贴 article.service.ts 代码 → 得到 article.service.spec.ts

# 2. 运行测试
npm run test src/article/article.service.spec.ts

# 3. 代码规范审查
/agent nestjs-code-review
# 粘贴 article.service.ts 代码 → 得到改进建议 → 修复

# 4. 安全扫描
/agent nestjs-security-audit
# 粘贴 article.service.ts 代码 → 修复安全问题

# 5. 提交
```

---

## 完整开发链路

```
写完业务代码 → 生成单元测试 → 代码规范审查 → 安全漏洞扫描
     ↓                ↓               ↓                   ↓
  业务逻辑完成   nestjs-test-writer  nestjs-code-review  nestjs-security-audit
```

所有 Agent 都遵循 **T0/T1/T2 优先级分级**：
- **T0** - 必须立即修复
- **T1** - 建议尽快修复
- **T2** - 可以后续优化
