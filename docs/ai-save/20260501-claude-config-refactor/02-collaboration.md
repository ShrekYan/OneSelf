# AI 协同开发成果 - .claude 通用配置规则抽离

## 📅 协同基本信息

- **协同日期**：2026-05-01
- **开发模块**：`.claude/` 配置系统（Monorepo 配置架构优化）
- **协同时长**：约 1.5 小时

---

## 🎯 本次协同目标

将 `.claude` 目录下前端和后端配置中**内容完全相同、100% 通用**的规则，抽离到 `rules/` 文件夹统一维护。

**核心约束（强制执行）**：

> 🔴 前端和后端的配置**绝对不能去重合并**！各自技术栈的特有规则必须独立维护。

---

## 📝 完成的工作内容

### 代码变更清单（共 12 个文件）

| 序号 | 操作类型 | 文件路径                                                                | 变更内容简述                                                        |
| ---- | -------- | ----------------------------------------------------------------------- | ------------------------------------------------------------------- |
| 1    | ✅ 新增  | `.claude/rules/typescript-common.md`                                    | TypeScript 通用规范（严格模式、零 any、空值处理、异步规范）         |
| 2    | ✅ 新增  | `.claude/rules/security-common.md`                                      | 安全通用规范（HttpOnly Cookie、Token 安全、密码加密、错误信息安全） |
| 3    | ✅ 新增  | `.claude/rules/code-format-common.md`                                   | 代码格式通用规范（缩进、引号、分号、导入排序、工具链）              |
| 4    | 🔧 精简  | `.claude/skills/h5-frontend-developer/rules/frontend-typescript.md`     | 移除通用部分，只保留 React/MobX 特有规范                            |
| 5    | 🔧 精简  | `.claude/skills/h5-frontend-developer/rules/frontend-api-design.md`     | 移除通用安全部分，只保留前端 API 特有规范                           |
| 6    | 🔧 精简  | `.claude/skills/nestjs-backend-developer/05-typescript-spec.md`         | 移除通用部分，只保留 NestJS 特有规范                                |
| 7    | 🔧 精简  | `.claude/skills/nestjs-backend-developer/10-code-format.md`             | 移除通用格式部分，只保留后端特有配置                                |
| 8    | 🔧 精简  | `.claude/skills/nestjs-backend-developer/11-security-authentication.md` | 移除通用安全部分，只保留后端认证实现                                |
| 9    | 🔧 精简  | `.claude/skills/nestjs-backend-developer/rules/nestjs-typescript.md`    | 移除通用部分，只保留后端特有规范                                    |
| 10   | 🔗 更新  | `.claude/agents/frontend-developer.md`                                  | 增加通用规则引用，先通用后特有                                      |
| 11   | 🔗 更新  | `.claude/agents/backend-architect.md`                                   | 增加通用规则引用，先通用后特有                                      |
| 12   | 📄 更新  | `CLAUDE.md`                                                             | 新增"项目规范入口"章节，更新规范索引                                |

---

### 功能实现说明

**架构优化前**：

- TypeScript 规范：前端 1 份，后端 1 份，60% 内容重复
- 安全规范：前端 API 文档中有，后端认证文档中有，内容重复
- 代码格式规范：前端有，后端有，部分内容重复
- 问题：同一规则改一处，另一处忘了改，导致规范不一致

**架构优化后**：

- 通用规则：3 个文件，`rules/` 目录统一维护，单一数据源
- 前端特有规则：保留在 `h5-frontend-developer/`，只包含 React 特有内容
- 后端特有规则：保留在 `nestjs-backend-developer/`，只包含 NestJS 特有内容
- Agent 加载顺序：先加载通用规则，再加载技术栈特有规则
- 效果：改一处，全栈生效，彻底解决不一致问题

---

## 💡 关键技术决策

### 决策 1：前端和后端的配置不合并

- **背景**：第一反应往往是"既然内容相同，合并成一个文件，前端后端都引用它，最精简"
- **选择的方案**：不合并，而是抽离出独立的"通用规则文件"，前后端各自的特有规则文件仍然独立存在，只是内容做了精简
- **理由**：
  1. 两个技术栈的演进路径完全独立，今天相同的规则，明天可能就不同了
  2. 强行合并会导致"为了保持一致而一致"，反而限制了各自的发展
  3. 保持文件独立，只是通过 include 引用通用内容，兼顾了"单源维护"和"独立性"
  4. 向后兼容性好，老代码和老习惯都不受影响

### 决策 2：原有规则文件不删除，只做内容精简

- **背景**：抽离完成后，原有规则文件中大部分内容被移走了，有些文件只剩下几行，看起来"没什么用了"
- **选择的方案**：所有原有文件**100% 保留**，只移除已抽离的通用章节，保留技术栈特有的内容
- **理由**：
  1. 有些 Agent 可能直接 include 了这个文件路径，删除会导致加载失败
  2. 老员工可能有直接访问这些文件的习惯，突然找不到会困惑
  3. 即使文件只剩几行，保留下来也没什么成本，但删除的风险很大
  4. 未来如果这个技术栈新增了特有规范，可以直接加在这个文件里，位置是现成的

### 决策 3：抽离的内容 100% 原样复制，不做任何"优化"

- **背景**：抽离时发现原文有些地方写得不够优雅，用词可以更精准
- **选择的方案**：抽离的内容**一个字都不改**，原样复制到通用规则文件中
- **理由**：
  1. 本次任务的目标是"架构优化"，不是"内容优化"
  2. 改了措辞可能会无意中改变原意，引发连锁反应
  3. 如果真的觉得内容需要优化，单独提一个优化建议，作为下一次迭代的内容，不要混在这次任务中
  4. "原样复制"虽然看起来不够"完美"，但绝对安全，风险为 0

---

## 🔧 核心代码实现

> 🚨 强制必填章节
> 📌 后续回顾直接看文档，不用翻 git 历史

---

### 1. 【rules/typescript-common.md】【新增】

> TypeScript 通用规范，前后端共用，解决了原来两份规范重复维护的问题

````markdown
# TypeScript 通用规范（前后端通用）

## 1. 严格模式要求

- ✅ **必须开启 `strict: true`**，严禁关闭核心检查
- ✅ **禁止禁用 `strictNullChecks`**
- ❌ 禁止使用 `@ts-ignore`，除非特殊必要并有注释说明

### any 使用规则

| 项目           | 规范                                                       |
| -------------- | ---------------------------------------------------------- |
| ✅ 零 any 原则 | 尽量避免 `any`，优先使用 `unknown` 或具体类型              |
| ✅ 类型守卫    | 使用 `unknown` 时必须配合类型守卫进行收窄                  |
| ⚠️ 例外情况    | 只有在和第三方库类型系统冲突（如 Prisma）时才使用 any 绕过 |

## 2. 类型基本原则

### 类型优先

先定义类型，再编写逻辑。任何数据结构在使用前都应该有明确的类型定义。

### 显式声明

以下内容必须显式声明类型：

- ✅ 函数/方法参数
- ✅ 函数/方法返回值（特别是 `async/Promise`）
- ✅ 类属性

## 3. 可选值与空值处理

### 可选与空值区分

| 写法           | 含义                             | 适用场景                        |
| -------------- | -------------------------------- | ------------------------------- | ------------------------ |
| `field?: Type` | 属性可以不存在，或为 `undefined` | 可选参数、可选配置              |
| `field: Type   | null`                            | 属性必须存在，但值可以为 `null` | 数据库字段、明确的空状态 |

### 禁止用法

❌ 禁止用 `undefined` 代替 `null`，二者语义不同：

- `undefined` = 未设置、不存在
- `null` = 空值、有意设置为空

### 安全访问

使用可选链 `?.` 访问嵌套属性，使用空值合并 `??` 提供默认值。

```typescript
const displayName = user?.name ?? '匿名用户';
```
````

## 4. 异步处理规范

### Promise 类型

所有异步函数必须显式标注 `Promise<T>` 返回类型。

```typescript
// ✅ 正确
async fetchUser(id: string): Promise<User> {
  const res = await api.get<User>(`/user/${id}`);
  return res.data;
}
```

### 错误处理

在 `catch` 块中，`error` 默认为 `unknown` 类型，必须进行类型收窄。

```typescript
// ✅ 正确 - 类型收窄
try {
  await this.operation();
} catch (error) {
  if (error instanceof Error) {
    logger.error(error.message);
  }
}
```

## 5. 导入导出规范

### 类型导出

所有仅导出类型的地方必须使用 `export type`。

```typescript
// ✅ 正确
export type { Feature, Link };
export interface HeaderProps {}
```

### 导入排序基本原则

导入按以下分组排序，每组之间空一行。同一组内按字母顺序排序。

| 分组顺序 | 内容                            |
| -------- | ------------------------------- |
| 1        | 官方/核心库（如 React、NestJS） |
| 2        | 第三方包                        |
| 3        | 内部模块（别名导入）            |
| 4        | 相对路径导入                    |

## 6. 基础检查清单

- [ ] 是否开启了 `strict: true` 严格模式？
- [ ] 是否避免了不必要的 `any`？
- [ ] 函数参数、返回值是否都有显式类型？
- [ ] `catch` 块中的 `error` 是否做了类型收窄？
- [ ] 空值处理是否正确区分了 `?:` 和 `| null`？
- [ ] 导入是否按分组正确排序？
- [ ] 类型导出是否使用了 `export type`？

````

---

### 2. 【agents/frontend-developer.md】【更新】
> 更新 Agent 的规则引用顺序，先加载通用规则，再加载前端特有规则

```markdown
<!-- 🔐 通用规范（自动加载，前后端共用） -->
#include: ../rules/typescript-common.md
#include: ../rules/security-common.md
#include: ../rules/code-format-common.md
#include: ../rules/project-behavior.md

<!-- 🔐 前端特有规范（自动加载，必须严格遵守） -->
#include: ../skills/h5-frontend-developer/rules/frontend-typescript.md
#include: ../skills/h5-frontend-developer/rules/frontend-css-scss.md
#include: ../skills/h5-frontend-developer/rules/frontend-api-design.md
#include: ../skills/h5-frontend-developer/rules/frontend-hooks-ts.md
#include: ../skills/h5-frontend-developer/rules/frontend-hooks-error-handling.md
#include: ../skills/h5-frontend-developer/rules/frontend-third-party-libraries.md
````

---

### 3. 【CLAUDE.md】【更新】

> 新增"项目规范入口"章节，清晰展示整个配置系统的分层结构

```markdown
## 📚 项目规范入口

### 🎯 通用规则（前后端共用）

- **TypeScript 通用规范**: [.claude/rules/typescript-common.md](.claude/rules/typescript-common.md) - 严格模式、any 限制、空值处理、异步规范等
- **安全通用规范**: [.claude/rules/security-common.md](.claude/rules/security-common.md) - HttpOnly Cookie、Token 安全、密码加密、错误信息安全
- **代码格式通用规范**: [.claude/rules/code-format-common.md](.claude/rules/code-format-common.md) - 缩进、引号、分号、导入排序、工具链配置
- **全局行为规范**: [.claude/rules/project-behavior.md](.claude/rules/project-behavior.md) - 代码复用、影响范围确认、安全底线

### 📱 前端特有规范

- **前端 H5 项目信息**: [.claude/projects/frontend-project-info.md](.claude/projects/frontend-project-info.md)
- **公共组件开发规范**: [.claude/rules/frontend-components.md](.claude/rules/frontend-components.md)
- 更多前端规则详见：`.claude/skills/h5-frontend-developer/rules/`

### 🖥️ 后端特有规范

- **后端 NestJS 项目信息**: [.claude/projects/backend-project-info.md](.claude/projects/backend-project-info.md)
- 更多后端规则详见：`.claude/skills/nestjs-backend-developer/`

### 📐 规范引用原则

- **Agent 自动加载**：前端开发 Agent 和后端架构师 Agent 会自动先加载通用规则，再加载各自技术栈的特有规则
- **不重复原则**：通用规则在 rules/ 目录统一维护，前后端特有规则只包含该技术栈独有的内容
- **向后兼容**：原有规则文件保留，只做内容精简，不影响现有工作流
```

---

## ⚠️ 遇到的问题与解决方案

本次协同过程非常顺利，没有遇到技术阻塞或需要反复调整的问题。主要原因是：

1. ✅ 方案设计阶段考虑充分，把所有边界情况和风险都预判到了
2. ✅ 核心约束从一开始就非常明确，没有理解偏差
3. ✅ 严格遵循"先确认方案，再执行编码"的流程，没有走弯路

---

## 📌 代码审查要点（自我审查清单）

| 审查项         | 状态    | 说明                                            |
| -------------- | ------- | ----------------------------------------------- |
| 核心约束遵守   | ✅ 通过 | 前端和后端的配置没有被合并，各自独立            |
| 抽离内容准确性 | ✅ 通过 | 所有抽离的通用规则 100% 与原内容一致，没有改写  |
| 向后兼容性     | ✅ 通过 | 所有原有规则文件都保留，只是内容做了精简        |
| Agent 引用正确 | ✅ 通过 | 两个 Agent 都正确更新了引用顺序（先通用后特有） |
| 文档同步更新   | ✅ 通过 | CLAUDE.md 已同步更新规范入口                    |
| 不影响现有功能 | ✅ 通过 | 整个过程是纯新增 + 内容精简，不涉及逻辑变更     |

---

## 📚 后续建议与待办

1. **建议**：未来新增规范时，先判断是否是跨技术栈通用的，如果是，直接写在 `rules/` 目录下
2. **建议**：定期（如每季度）检查一次通用规则和特有规则的边界，是否有新的内容可以抽离
3. **待办**：如果未来需要新增代码审查、性能优化等通用规范，也可以考虑纳入 `rules/` 统一维护
