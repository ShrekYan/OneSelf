# Spec Kit Constitution 新手定义指南

> **目标读者**：已经开始使用 Spec Kit，但不知道如何定义 `.specify/memory/constitution.md` 的新手。
>
> **参考文档**：`docs/speckit/speckit-constitution-execution-mechanism.md`
>
> **配套案例**：`specs/xiaobei/`

---

## 1. Constitution 是什么？

Spec Kit Constitution 可以理解为项目的“最高规则”。

它不是某个功能的实现方案，而是后续所有 feature 在规划、拆解、实现前都要遵守的项目级治理原则。

在本项目中，实际文件是：

```text
.specify/memory/constitution.md
```

模板来源是：

```text
.specify/templates/constitution-template.md
```

通俗类比：

| 类比         | 含义                                |
| ------------ | ----------------------------------- |
| 国家宪法     | 所有法律都不能违背它                |
| 团队章程     | 团队成员共同遵守的做事原则          |
| 游戏规则     | 不管玩哪一关，都要遵守              |
| 质量门禁母版 | 后续 spec、plan、tasks 都要按它检查 |

一句话总结：

> Constitution 管的是“项目长期怎么做才算合规”，不是“这次功能具体怎么写代码”。

---

## 2. Constitution 在 Spec Kit 流程中的位置

推荐流程：

```text
/speckit-constitution
    ↓
/speckit-specify
    ↓
/speckit-plan
    ↓
/speckit-tasks
    ↓
/speckit-implement
```

它主要影响：

- `spec.md`：需求是否符合项目原则。
- `plan.md`：`Constitution Check` 是否通过。
- `tasks.md`：任务拆分是否体现质量门禁。
- `.specify/templates/*.md`：后续生成文档的模板是否同步了治理要求。

当前小贝案例中，`specs/xiaobei/xiaobei-03-array-utils/plan.md` 已经说明：

```text
当前 .specify/memory/constitution.md 仍为模板占位内容，未定义已批准的具体治理原则。
```

这说明当前项目已经在使用 Spec Kit 流程，但 Constitution 还没有正式初始化。

---

## 3. 如何从已有项目反推 Constitution？

新手不要一开始凭空想“我要什么原则”，更推荐从已经做过的功能中提炼。

以 `specs/xiaobei/` 为例：

```text
specs/xiaobei/
├── xiaobei-01-string-utils
├── xiaobei-02-number-utils
└── xiaobei-03-array-utils
```

这些功能已经体现出一些稳定习惯：

| 已有实践                                      | 可提炼成的 Constitution 原则 |
| --------------------------------------------- | ---------------------------- |
| 工具函数要求 TypeScript 类型明确              | 类型安全优先                 |
| `unique`、`sort`、`filter` 是纯工具函数       | 简单/纯函数优先              |
| 工具函数放在 `apps/web/src/utils`             | 代码复用和目录一致性         |
| 字符串、数字、数组分功能独立推进              | 最小可行变更                 |
| 每个功能都有 `spec.md`、`plan.md`、`tasks.md` | 规格驱动交付                 |
| 通过 lint、tsc、契约核对验证                  | 可验证质量门禁               |
| 用户明确“不加单元测试”时计划中记录            | 尊重明确需求，不擅自扩展     |

所以 Constitution 应该写成可执行、可检查的规则，而不是口号。

不推荐：

```text
代码要优雅。
```

推荐：

```text
所有 TypeScript 工具函数必须显式声明参数和返回值类型，不得使用 any。
```

---

## 4. 小贝项目 Constitution 初版草案

下面是一份适合当前项目的新手版草案，可以作为 `/speckit-constitution` 的输入参考。

```markdown
# 小贝项目 Constitution

## Core Principles

### I. 类型安全优先

所有 TypeScript 代码必须保持严格类型约束。

- 函数参数和返回值必须显式声明类型。
- 禁止不必要的 `any`，优先使用具体类型或 `unknown` + 类型守卫。
- 新增工具函数必须提供清晰的输入输出类型。
- 类型设计应先于实现逻辑。

### II. 简单/纯函数优先

通用工具函数应优先保持纯函数特性。

- 相同输入必须产生相同输出。
- 不修改输入参数，尤其是数组、对象等引用类型。
- 不访问网络、存储、全局状态或 DOM。
- 不引入不必要的运行时依赖。
- 优先使用 JavaScript/TypeScript 原生能力。

### III. 代码复用优先

新增能力应优先复用项目已有结构和工具。

- 前端工具函数优先放在 `apps/web/src/utils/`。
- 不重复实现已有能力。
- 不无理由新建目录、重命名文件或改变导出结构。
- 新代码风格必须与现有代码保持一致。

### IV. 最小可行变更

每次功能变更必须边界清晰、范围可控。

- 一个功能只解决一个明确问题。
- 字符串、数字、数组等工具能力应按模块拆分。
- 不为了未来假设进行过度设计。
- 不在工具函数任务中引入页面、组件、状态管理、API 或后端改动。

### V. 规格驱动交付

重要功能必须遵循 Spec Kit 流程。

- 先写 `spec.md`，明确用户场景、需求和成功标准。
- 再写 `plan.md`，明确技术方案、范围和 Constitution Check。
- 再写 `tasks.md`，拆分可执行任务。
- 最后实施代码。
- 需求不明确时，必须先澄清，不得自行扩大范围。

## Quality Gates

每个功能完成前必须满足以下质量门禁：

- 通过 TypeScript 类型检查：`npx tsc --noEmit`。
- 通过代码检查：`npm run lint`。
- 与对应 contracts 文档保持一致。
- 如果用户明确要求不新增单元测试，则不得擅自添加测试任务；否则应根据功能复杂度决定是否补充测试。
- 不得留下调试代码、无用导出或未解释的占位内容。

## Security and Constraints

默认遵守项目安全边界。

- 工具函数不得处理 Token、密码、Cookie 等敏感信息。
- 不得把敏感信息写入日志。
- 涉及外部输入、认证、权限或后端接口时，必须遵守项目安全规范。
- 前端不得将 accessToken/refreshToken 存入 localStorage/sessionStorage。
- 后端密码处理必须遵守 Argon2id 规则。

## Governance

本 Constitution 是 Spec Kit 工作流的最高项目规则。

- 新功能的 `plan.md` 必须包含 Constitution Check。
- 如果功能设计违反本宪章，必须在计划阶段说明原因和替代方案。
- 修改 Constitution 必须通过 `/speckit-constitution` 进行。
- 每次修改必须说明影响范围，并同步检查相关模板：
  - `.specify/templates/plan-template.md`
  - `.specify/templates/spec-template.md`
  - `.specify/templates/tasks-template.md`
- 版本号遵循 SemVer：
  - MAJOR：删除或重定义核心原则。
  - MINOR：新增原则或新增强制规则。
  - PATCH：文字澄清、格式修正、非语义变更。

**Version**: 1.0.0 | **Ratified**: 2026-05-24 | **Last Amended**: 2026-05-24
```

---

## 5. 可以直接用于命令的轻量输入

如果不想一次写完整文档，可以先用轻量版初始化：

```text
/speckit-constitution 小贝项目核心原则：
1. 类型安全优先：所有 TypeScript 函数必须显式声明参数和返回值类型，避免 any。
2. 简单/纯函数优先：工具函数不得修改输入，不引入副作用，不访问网络、存储或全局状态。
3. 代码复用优先：优先复用 apps/web/src/utils 现有结构，不重复实现已有能力。
4. 最小可行变更：每次功能边界清晰，不做超出规格的扩展。
5. 规格驱动交付：重要功能遵循 spec -> plan -> tasks -> implement 流程。
质量门禁：通过 npm run lint 和 npx tsc --noEmit；测试策略按用户明确要求执行。
```

---

## 6. 执行前需要确认什么？

执行 `/speckit-constitution` 前，建议先确认：

| 问题                   | 推荐答案                           |
| ---------------------- | ---------------------------------- |
| 项目名称叫什么？       | 小贝项目                           |
| 哪些原则不可妥协？     | 类型安全、纯函数、最小变更         |
| 是否强制单元测试？     | 当前不强制，按用户要求决定         |
| 是否允许未来修改宪法？ | 允许，用 SemVer 管理               |
| 是否需要同步模板？     | 需要检查 `.specify/templates/*.md` |

---

## 7. 新手常见误区

### 7.1 把功能需求写进 Constitution

不推荐：

```text
这次要实现 unique、sort、filter。
```

推荐：

```text
通用工具函数应保持纯函数，不修改输入参数。
```

Constitution 写长期原则，不写某一次任务。

### 7.2 原则太空泛

不推荐：

```text
代码要优雅。
```

推荐：

```text
函数参数和返回值必须显式声明类型，不得使用 any。
```

### 7.3 留下模板占位符

不要保留：

```markdown
[PRINCIPLE_1_NAME]
[SECTION_2_CONTENT]
```

如果暂时不确定，可以写：

```markdown
TODO(TESTING_POLICY): 后续根据项目测试策略补充。
```

### 7.4 只改 constitution，不同步模板

Constitution 变更后，需要检查：

```text
.specify/templates/plan-template.md
.specify/templates/spec-template.md
.specify/templates/tasks-template.md
```

否则后续生成的 plan/tasks 可能不会体现新规则。

### 7.5 一开始追求完美

新手不要试图一次写出最终版。

推荐先定义 5 条核心原则：

1. 类型安全优先
2. 简单/纯函数优先
3. 代码复用优先
4. 最小可行变更
5. 规格驱动交付

后续随着项目实践再迭代。

---

## 8. 学习路线

建议按以下顺序学习：

```text
第 1 步：理解 Constitution 是项目级治理规则
第 2 步：阅读 docs/speckit/speckit-constitution-execution-mechanism.md
第 3 步：观察 specs/xiaobei/*/plan.md 中的 Constitution Check
第 4 步：用轻量输入执行 /speckit-constitution
第 5 步：新建下一个 feature，观察 Constitution 如何影响 plan/tasks
第 6 步：根据实践反馈迭代 Constitution
```

---

## 9. 一句话结论

对于当前项目来说，Constitution 不需要一开始写得复杂。

更合适的做法是：

> 把 `specs/xiaobei` 中已经反复遵守的好习惯，提炼成以后所有功能都要遵守的项目规则。

先有一个可用的轻量版，再通过后续 feature 持续修订，比一开始追求完美更适合新手。
