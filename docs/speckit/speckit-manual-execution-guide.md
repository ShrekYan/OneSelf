# Speckit 新手手动执行指南

---

## 文档信息

| 项目             | 内容                                  |
| ---------------- | ------------------------------------- |
| **文档版本**     | v1.0                                  |
| **创建日期**     | 2026-05-22                            |
| **适用对象**     | 新手开发者                            |
| **目标 Feature** | specs/002-xiaobei-utils（小贝工具库） |

---

## 一、准备工作

### 1.1 环境要求

- **代码编辑器**：VS Code / WebStorm（推荐）
- **终端**：命令行工具（Terminal）
- **Node.js**：确保已安装（项目使用）
- **TypeScript**：已配置在项目中

### 1.2 项目结构概览

```text
你的项目根目录
├── apps/
│   └── web/                    ← 前端应用
│       ├── src/
│       │   └── utils/          ← 工具函数目录（我们要修改的地方）
│       │       └── string.ts   ← 目标文件
│       └── package.json        ← 依赖配置
└── specs/
    └── 002-xiaobei-utils/     ← 我们的 Feature 文档
        ├── tasks.md            ← 全局任务清单
        ├── spec.md             ← 全局规格
        └── stages/
            └── 01-string-utils/
                ├── tasks.md    ← 阶段任务清单
                ├── contract.md ← 接口契约
                └── plan.md     ← 实现计划
```

---

## 二、执行流程总览

```text
Phase 1: Global Setup（全局准备）
        ↓
Phase 2: Foundational（基础约束）
        ↓
Phase 3: Stage Execution（阶段执行）→ 我们的重点
        ↓
Phase 4: Final Validation（最终验证）
```

---

## 三、详细执行案例

### 3.1 Phase 1: Global Setup（全局准备）

**目标**：确认项目约束和目标位置

| 任务     | 操作步骤                                                   | 完成标记 |
| -------- | ---------------------------------------------------------- | -------- |
| **T001** | 打开 `specs/002-xiaobei-utils/spec.md`，阅读并确认全局约束 | ✅       |
| **T002** | 确认目标目录 `apps/web/src/utils/` 存在                    | ✅       |

**实际操作：**

1. 在编辑器中打开 `specs/002-xiaobei-utils/spec.md`
2. 阅读文档，了解项目的整体要求
3. 检查 `apps/web/src/utils/` 目录是否存在

---

### 3.2 Phase 2: Foundational（基础约束）

**目标**：确认所有阶段都要遵守的规则

| 任务     | 操作步骤                                                           | 完成标记 |
| -------- | ------------------------------------------------------------------ | -------- |
| **T003** | 阅读 `.claude/rules/typescript-common.md` 了解 TypeScript 风格要求 | ✅       |
| **T004** | 阅读 `.claude/rules/code-format-common.md` 了解代码格式化要求      | ✅       |
| **T005** | 确认三个目标文件：`string.ts`、`number.ts`、`array.ts`             | ✅       |
| **T006** | 确认 `apps/web/package.json` 中不需要新增依赖                      | ✅       |

---

### 3.3 Phase 3: Stage Execution（阶段执行）- 重点！

#### 执行 Stage 01: 字符串工具

**步骤 1：阅读阶段文档**

打开 `specs/002-xiaobei-utils/stages/01-string-utils/tasks.md`

```markdown
## Phase 1: Implementation

- [ ] S01-T001 Implement `trim(str)` in `apps/web/src/utils/string.ts`
- [ ] S01-T002 Implement `uppercase(str)` in `apps/web/src/utils/string.ts`
- [ ] S01-T003 Implement `lowercase(str)` in `apps/web/src/utils/string.ts`

## Phase 2: Validation

- [ ] S01-T004 Ensure exports only three utilities
- [ ] S01-T005 Verify explicit types
- [ ] S01-T006 Review contract alignment
```

**步骤 2：查看契约要求**

打开 `specs/002-xiaobei-utils/stages/01-string-utils/contract.md`

| 函数名      | 功能         | 输入          | 输出      |
| ----------- | ------------ | ------------- | --------- |
| `trim`      | 去除首尾空白 | `"  hello  "` | `"hello"` |
| `uppercase` | 转换大写     | `"Hello"`     | `"HELLO"` |
| `lowercase` | 转换小写     | `"HELLO"`     | `"hello"` |

**步骤 3：创建/修改代码文件**

打开 `apps/web/src/utils/string.ts`，编写代码：

```typescript
// apps/web/src/utils/string.ts

/**
 * 去除字符串首尾空白字符
 * @param str - 待处理的字符串
 * @returns 去除空白后的字符串
 */
export function trim(str: string): string {
  return str.trim();
}

/**
 * 将字符串转换为大写形式
 * @param str - 待处理的字符串
 * @returns 大写形式的字符串
 */
export function uppercase(str: string): string {
  return str.toUpperCase();
}

/**
 * 将字符串转换为小写形式
 * @param str - 待处理的字符串
 * @returns 小写形式的字符串
 */
export function lowercase(str: string): string {
  return str.toLowerCase();
}
```

**步骤 4：验证实现**

| 验证项   | 操作                              | 结果 |
| -------- | --------------------------------- | ---- |
| S01-T004 | 检查文件是否只导出三个函数        | ✅   |
| S01-T005 | 检查是否有明确的类型声明          | ✅   |
| S01-T006 | 对照 contract.md 检查功能是否符合 | ✅   |

---

#### 执行 Stage 02: 数字工具

**步骤 1：查看阶段任务**

打开 `specs/002-xiaobei-utils/stages/02-number-utils/tasks.md`

**步骤 2：查看契约**

打开 `specs/002-xiaobei-utils/stages/02-number-utils/contract.md`

**步骤 3：创建 `number.ts` 文件**

```typescript
// apps/web/src/utils/number.ts

/**
 * 加法运算
 * @param a - 第一个数字
 * @param b - 第二个数字
 * @returns 两数之和
 */
export function add(a: number, b: number): number {
  return a + b;
}

/**
 * 乘法运算
 * @param a - 第一个数字
 * @param b - 第二个数字
 * @returns 两数之积
 */
export function multiply(a: number, b: number): number {
  return a * b;
}

/**
 * 千分位格式化
 * @param num - 待格式化的数字
 * @returns 千分位格式的字符串
 */
export function formatThousands(num: number): string {
  return num.toLocaleString();
}
```

---

#### 执行 Stage 03: 数组工具

**步骤 1：查看阶段任务**

打开 `specs/002-xiaobei-utils/stages/03-array-utils/tasks.md`

**步骤 2：查看契约**

打开 `specs/002-xiaobei-utils/stages/03-array-utils/contract.md`

**步骤 3：创建 `array.ts` 文件**

```typescript
// apps/web/src/utils/array.ts

/**
 * 数组去重
 * @param arr - 待处理的数组
 * @returns 去重后的数组
 */
export function unique<T>(arr: T[]): T[] {
  return [...new Set(arr)];
}

/**
 * 数组排序（数字数组）
 * @param arr - 待排序的数组
 * @returns 排序后的数组
 */
export function sortNumbers(arr: number[]): number[] {
  return [...arr].sort((a, b) => a - b);
}

/**
 * 数组过滤
 * @param arr - 待过滤的数组
 * @param predicate - 过滤条件函数
 * @returns 过滤后的数组
 */
export function filter<T>(arr: T[], predicate: (item: T) => boolean): T[] {
  return arr.filter(predicate);
}
```

---

### 3.4 Phase 4: Final Validation（最终验证）

**目标**：验证所有实现是否符合要求

| 任务     | 操作步骤                       | 命令                              |
| -------- | ------------------------------ | --------------------------------- |
| **T010** | 运行 lint 检查                 | `cd apps/web && npm run lint`     |
| **T011** | 运行类型检查                   | `cd apps/web && npx tsc --noEmit` |
| **T012** | 确认没有添加单元测试文件       | 手动检查 `apps/web/src/utils/`    |
| **T013** | 确认 quickstart 示例与实现一致 | 对照 `quickstart.md` 检查         |

**实际操作：**

打开终端，依次执行：

```bash
# 进入前端目录
cd apps/web

# 运行 lint 检查
npm run lint

# 运行类型检查
npx tsc --noEmit
```

**预期输出：**

```
> npm run lint

> web@1.0.0 lint
> eslint .

✨  No lint errors found!

> npx tsc --noEmit

✨  No type errors found!
```

---

## 四、完整执行清单

### 全局任务清单

```markdown
# Tasks: 小贝工具库 - 完成状态

## Phase 1: Global Setup

- [✅] T001 Confirm global constraints
- [✅] T002 Confirm target source directory

## Phase 2: Foundational

- [✅] T003 Review TypeScript style requirements
- [✅] T004 Review code formatting requirements
- [✅] T005 Confirm target source files
- [✅] T006 Confirm no external dependency needed

## Phase 3: Stage Execution

- [✅] T007 Execute Stage 01 tasks
- [✅] T008 Execute Stage 02 tasks
- [✅] T009 Execute Stage 03 tasks

## Phase 4: Final Validation

- [✅] T010 Run npm run lint
- [✅] T011 Run npx tsc --noEmit
- [✅] T012 Confirm no unit test files
- [✅] T013 Confirm quickstart examples match
```

### Stage 01 任务清单

```markdown
# Tasks: 字符串工具 - 完成状态

## Phase 1: Implementation

- [✅] S01-T001 Implement trim(str)
- [✅] S01-T002 Implement uppercase(str)
- [✅] S01-T003 Implement lowercase(str)

## Phase 2: Validation

- [✅] S01-T004 Ensure exports only three utilities
- [✅] S01-T005 Verify explicit types
- [✅] S01-T006 Review contract alignment
```

---

## 五、常见问题

### Q1: 不知道目标文件在哪里？

**A**：查看全局任务清单中的 T005，明确写了目标文件路径：

- `apps/web/src/utils/string.ts`
- `apps/web/src/utils/number.ts`
- `apps/web/src/utils/array.ts`

### Q2: 不知道函数怎么实现？

**A**：查看对应阶段的 `contract.md`，里面详细说明了：

- 函数的目的（Purpose）
- 输入参数（Input）
- 输出结果（Output）
- 示例（Examples）

### Q3: 执行命令时出错？

**A**：

1. 确保当前目录正确（`cd apps/web`）
2. 确保已安装依赖（`npm install`）
3. 检查错误信息，通常会提示具体问题

### Q4: lint 检查失败？

**A**：根据错误提示修改代码：

- 检查代码缩进
- 检查分号
- 检查变量命名规范

### Q5: 类型检查失败？

**A**：确保所有函数都有明确的类型声明：

```typescript
// 错误示例
export function trim(str) {
  return str.trim();
}

// 正确示例
export function trim(str: string): string {
  return str.trim();
}
```

---

## 六、新手小贴士

### 1. 按顺序执行

严格按照 Phase 1 → Phase 2 → Phase 3 → Phase 4 的顺序执行

### 2. 仔细阅读文档

每个阶段的 `contract.md` 是最重要的参考文件

### 3. 保持专注

一次只完成一个任务，完成后打勾标记

### 4. 及时验证

每个阶段完成后都要进行验证

### 5. 不要着急

作为新手，慢慢理解比快速完成更重要

---

## 七、练习建议

1. **第一步**：按照本指南完整执行一次
2. **第二步**：尝试修改 `string.ts`，添加注释
3. **第三步**：尝试给函数添加空值安全处理
4. **第四步**：查看 `quickstart.md`，了解如何使用这些工具函数

---

## 八、版本历史

| 版本 | 日期       | 作者     | 变更说明 |
| ---- | ---------- | -------- | -------- |
| v1.0 | 2026-05-22 | 技术团队 | 初始版本 |

---

**文档结束**

---

_祝你学习顺利！如果遇到问题，可以随时查看文档或寻求帮助。_
