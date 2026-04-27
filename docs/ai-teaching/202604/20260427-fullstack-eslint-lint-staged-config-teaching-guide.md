# Monorepo ESLint + lint-staged 配置优化 - AI 协同教学指南

> 📅 日期：2026-04-27
> 🏷️ 任务类型：全栈工程化配置
> 🎯 覆盖范围：Monorepo 架构下 ESLint 配置重构 + pre-commit 钩子优化

---

## 💬 提示词优化复盘

### ✅ 本次哪些提示词写得好？好在哪里？

1. **"帮我分析一下我的想法是否合理"**
   - 开放式问题，引导 AI 做深度分析而不是直接执行
   - 先分析共识，再给方案，避免盲目操作
   - 好处：用户先理解问题本质，再做决策

2. **"先进入计划模式，进入深度分析后，给出结论和解决方案"**
   - 明确要求先调研再执行，避免冒进
   - 计划模式强制产出文档，便于后续复盘
   - 好处：执行前有清晰的方案和风险评估

### ⚠️ 哪些提示词可以改进？怎么改会更好？

**可以改进的点**：第一次提交时没有明确说明是"配置重构"，导致 AI 需要额外探索

**改进方式**：

```bash
# 改进前
修复每一次git提交都会出现的错误

# 改进后
【配置重构】Monorepo 下 git commit 时 lint-staged 报错，需要：
1. 先分析当前 ESLint 配置分布问题
2. 区分前端/后端各自需要的 ESLint 配置
3. 优化 pre-commit 钩子，避免重复检查
4. 给出完整方案后再执行
```

### 💡 下次遇到类似任务，最优的提问方式是什么？

```
【工程化配置重构】+ 具体现象 + 期望目标

示例：
【工程化】Monorepo 模式下 git commit lint-staged 配置混乱，需要：
1. 分析当前所有 ESLint 配置分布和问题
2. 前端 React 项目需要一套，后端 NestJS 三个项目需要统一一套
3. pre-commit 钩子分层设计，避免重复检查
4. 先给出分析报告和方案，我确认后再执行
```

---

## 🤔 关键决策回顾

### 决策 1：ESLint 配置分散到各项目，而非根目录统一

**背景**：

- Monorepo 下前端是 React + TypeScript，后端是 NestJS + TypeScript
- 技术栈差异大，需要的 ESLint 插件和规则完全不同

**决策依据**：

1. 前端需要 react-hooks、react-refresh 插件，后端不需要
2. 前端是 ESM 模块（"type": "module"），后端是 CommonJS
3. 各项目独立配置，修改互不影响

**备选方案对比**：
| 方案 | 优点 | 缺点 |
|------|------|------|
| 根目录统一配置 | 只有一份配置 | 配置复杂，需大量条件判断，难以维护 |
| 各项目独立配置 | 职责清晰，易维护，技术栈差异天然隔离 | 有少量重复代码 |

**决策结论**：选择各项目独立配置，遵循"高内聚、低耦合"原则

---

### 决策 2：lint-staged 只做格式化，eslint 交给 turbo lint

**背景**：

- 原架构：lint-staged 同时做 prettier + eslint，然后 npm run lint 又执行一次 eslint
- 问题：eslint 执行两次，且两次使用的配置不同，规则严格度不一致

**决策依据**：

1. prettier 自动格式化是 lint-staged 的核心价值，不可替代
2. eslint 重复检查是冗余，且容易因配置不一致产生困惑
3. turbo lint 可以利用缓存，全量检查效率更高

**备选方案对比**：
| 方案 | 优点 | 缺点 |
|------|------|------|
| 完全删除 lint-staged | 架构最简洁 | 失去自动格式化，代码风格不统一 |
| 保留原状 | 不需要改代码 | 重复检查，速度慢，配置不一致问题 |
| **lint-staged 只做格式化** | 保留核心价值，无重复检查，速度快 | 需要调整配置 |

**决策结论**：选择方案 C - lint-staged 只负责 prettier 格式化，eslint 统一由 turbo lint 负责

---

### 决策 3：根目录保留轻量级 ESLint 配置

**背景**：

- lint-staged 从根目录运行，eslint 也从根目录执行
- 如果根目录没有 eslint.config.js，eslint 会报错找不到配置

**决策依据**：

1. lint-staged 只做格式化，eslint 已经交给 turbo lint，所以根目录不需要严格检查
2. 根目录配置只需要满足"能运行"即可，不需要 type-aware 等严格规则
3. 严格的规则检查由各项目自己的配置在 turbo lint 阶段执行

**决策结论**：根目录保留最小化 ESLint 配置，仅作为 lint-staged 运行时的协调器

---

## 🐛 踩坑记录与教训

### 坑 1：lint-staged 在 Monorepo 下的工作目录问题

**现象**：

- lint-staged 从根目录运行，匹配到 `apps/web/src/xxx.ts` 文件
- 执行 eslint 时，也是从根目录启动，向上搜索配置文件
- 如果根目录没有 eslint.config.js，直接报错

**根因**：

- Monorepo 迁移时只考虑了各项目独立运行，没考虑到 git hooks 是在仓库根目录执行的
- ESLint 9.x 扁平化配置搜索逻辑，找不到配置就直接失败

**排查过程**：

1. 手动执行 `npx lint-staged --debug` 查看详细日志
2. 发现 lint-staged 搜索了所有子项目的 package.json 寻找配置
3. 发现 eslint 执行时的 cwd 是根目录，不是子项目目录

**避免方案**：

```bash
# 调试 lint-staged 的必用命令
npx lint-staged --debug
```

> 💡 教训：Monorepo 下的工具链配置一定要考虑"从根目录运行"这个场景

---

### 坑 2：apps/web 中冗余的 lint-staged 配置

**现象**：

- lint-staged 同时加载了根目录和 apps/web 的配置
- 同一个文件可能被两个配置匹配两次

**根因**：

- Monorepo 迁移时，前端项目原有配置没有删除
- lint-staged 会递归向上搜索所有 package.json 中的配置

**避免方案**：

- 迁移完成后要主动检查并删除冗余配置
- lint-staged 只在根目录配置一次即可

---

### 坑 3：ESLint 配置扩展名 + package.json type 的组合关系

**现象**：

- auth-service 有警告：`Module type ... is not specified and it doesn't parse as CommonJS`

**根因**：

- ESLint 配置文件的扩展名（.js vs .mjs）和 package.json 的 type 字段配合工作
- 如果 package.json 没有 type，.js 文件默认按 CommonJS 解析
- 但如果配置文件使用了 ESM 语法（export default），就会有警告

**组合规则表**：
| package.json type | eslint 配置扩展名 | 解析方式 | 场景 |
|-------------------|-------------------|----------|------|
| 无 type | `.mjs` | ESM | 后端 NestJS 项目（如 backend, log-service） |
| 无 type | `.js` | CommonJS（但配置是 ESM 语法会警告） | auth-service 当前状态 ⚠️ |
| `"type": "module"` | `.js` | ESM | 前端 React 项目（如 apps/web） |

**避免方案**：

- 后端项目统一用 `.mjs` 扩展名，不管 package.json 有没有 type
- 或者统一给后端 package.json 加上 `"type": "module"`

---

## ✅ 最佳实践提炼

### 最佳实践 1：Monorepo ESLint 配置分层原则

```
┌─────────────────────────────────────────────────────────┐
│ 根目录 eslint.config.js                                  │
│  职责：lint-staged 快速检查（非 type-aware）             │
│  规则：最基础的 recommended，不做严格检查                │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│ 各项目独立 eslint 配置                                    │
│  apps/web/eslint.config.js  → React + TypeScript 全套    │
│  services/*/eslint.config.mjs → NestJS 后端标准配置     │
│  职责：turbo lint 时的严格 type-aware 检查               │
│  规则：项目专属，含所有业务规则                          │
└─────────────────────────────────────────────────────────┘
```

**适用场景**：所有 Monorepo + ESLint 9.x 的项目

---

### 最佳实践 2：pre-commit 钩子的两层检查设计

```bash
#!/usr/bin/env sh

# 第一层：快速格式化（只处理暂存文件，速度快）
npx lint-staged  # 只做 prettier --write + stylelint --fix

# 第二层：严格类型检查（全项目并行，保证代码质量）
echo "Running TypeScript type check..."
npm run lint  # turbo lint 并行执行所有项目的 eslint --max-warnings=0
```

**核心思想**：

- 第一层：求快，不阻塞开发流程，只做可以自动修复的
- 第二层：求严，兜底保证代码质量，做不可自动修复的检查

**适用场景**：所有需要 pre-commit 检查的项目

---

### 最佳实践 3：lint-staged Monorepo 配置规范

```json
// ❌ 错误：每个子项目都配 lint-staged（重复、混乱）
// apps/web/package.json + services/*/package.json 都配置

// ✅ 正确：只在根目录 package.json 配置一次
{
  "lint-staged": {
    "!(.claude)/**/*.{ts,tsx,js,jsx,json,md}": ["prettier --write"],
    "!(.claude)/**/*.{css,scss}": ["stylelint --fix", "prettier --write"]
  }
}
```

**原则**：lint-staged 的 glob 模式是相对于仓库根目录的，所以只需要根目录配置一次即可覆盖所有子项目

---

---

## 🎨 React 前端工具链配置复盘

### 🧐 前端 ESLint 配置的核心要素

**必备插件**：

```javascript
// ✅ React Hooks 规则检查（强制 Hooks 使用规范）
'react-hooks/rules-of-hooks': 'error'

// ✅ React Refresh HMR 规范（保证组件能热更新）
'react-refresh/only-export-components': 'warn'

// ✅ TypeScript type-aware 检查（类型安全）
extends: [...tseslint.configs.recommendedTypeChecked]
```

**配置位置**：`apps/web/eslint.config.js`

> 💡 要点：前端 ESLint 配置和后端差异巨大，绝对不能共用
>
> - 前端需要 React 相关插件
> - 前端是 ESM 模块系统
> - 前端需要浏览器环境 globals

---

### 📦 前端 lint 命令规范

```json
// ✅ 正确
{
  "lint": "eslint src --ext ts,tsx --report-unused-disable-directives --max-warnings 0"
}

// ❌ 错误 - 不要在 lint 脚本里配 lint-staged
{
  "lint": "npx lint-staged --allow-empty"
}
```

**为什么错误**：

1. `npm run lint` 的语义是"执行 lint 检查"，不是"只对 git 暂存文件 lint"
2. lint-staged 应该只在 git hook 中使用
3. 导致 eslint 被执行两次，而且使用的配置不一样

---

---

## 🏗️ NestJS 后端工具链配置复盘

### 📊 后端 ESLint 配置的一致性原则

**目标**：所有后端服务使用完全相同的 ESLint 规则

**实现方式**：

```javascript
// services/backend/eslint.config.mjs
// services/log-service/eslint.config.mjs
// services/auth-service/eslint.config.js
//
// 三个文件的配置结构保持一致，只有规则严格度可以微调
```

**配置结构**：

```javascript
export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked, // ✅ type-aware 检查
  eslintPluginPrettierRecommended, // ✅ Prettier 集成
  {
    languageOptions: {
      globals: {
        ...globals.node, // ✅ Node.js 环境（不是浏览器）
        ...globals.jest, // ✅ Jest 测试环境
      },
      sourceType: 'commonjs', // ✅ NestJS 默认是 CommonJS
      parserOptions: {
        projectService: true, // ✅ TypeScript 项目服务
        tsconfigRootDir: import.meta.dirname, // ✅ 配置所在目录为根
      },
    },
  },
  // 自定义规则...
);
```

> 💡 要点：后端三个服务的配置必须对齐，否则不同项目的代码质量标准不一样

---

### 🔧 后端规则严格度调整

**规则关闭/放宽原则**：

```javascript
{
  rules: {
    // ✅ 允许 any（后端 ORM 场景下不可避免）
    '@typescript-eslint/no-explicit-any': 'off',

    // ✅ 允许不安全的参数调用（与第三方库集成时需要）
    '@typescript-eslint/no-unsafe-argument': 'off',

    // ✅ 允许不安全的赋值（Prisma 返回类型有时需要）
    '@typescript-eslint/no-unsafe-assignment': 'off',

    // ✅ 允许不安全的调用（动态调用场景）
    '@typescript-eslint/no-unsafe-call': 'off',

    // ✅ 允许不安全的成员访问
    '@typescript-eslint/no-unsafe-member-access': 'off',

    // ⚠️ 未处理的 Promise 只告警，不报错（避免影响开发）
    '@typescript-eslint/no-floating-promises': 'warn',

    // ✅ Prettier 集成
    'prettier/prettier': ['error', { endOfLine: 'auto' }],
  }
}
```

> 💡 设计思路：后端项目需要和数据库、第三方服务集成，很多时候类型安全和开发效率需要权衡。把严格度调成"警告"而不是"错误"，既保留提醒，又不阻塞开发。

---

## 🎯 本次教学覆盖总结

| 维度    | 覆盖内容                                           |
| ------- | -------------------------------------------------- |
| 💬 通用 | 提示词优化、关键决策、踩坑记录、最佳实践           |
| 🎨 前端 | ESLint 分层配置、React 插件规范、lint 命令规范     |
| 🏗️ 后端 | NestJS ESLint 配置对齐、规则严格度调整、一致性原则 |

---

## 📚 核心知识点速查

1. **lint-staged Monorepo 只需要在根目录配置一次**
2. **ESLint 9.x 找不到配置就直接报错，根目录必须有**
3. **pre-commit 两层设计：快速格式化 + 严格类型检查**
4. **前端/后端 ESLint 配置差异巨大，必须分开**
5. **所有后端服务的 ESLint 配置必须保持一致**
6. **lint 脚本的语义是"全量 lint 检查"，不要写成 lint-staged**
