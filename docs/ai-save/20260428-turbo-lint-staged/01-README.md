# 模块功能文档 - Turbo lint-staged 改造

## 📋 模块信息
| 项 | 值 |
|----|-----|
| **模块名称** | Git 提交钩子优化 |
| **模块路径** | 根目录 + 4 个子项目 package.json |
| **开发日期** | 2026-04-28 |
| **功能定位** | 优化 Monorepo 架构下的 Git 提交代码检查机制 |

---

## 🎯 功能概述

解决 **Turbo lint 全量检查导致历史代码误伤的问题**，将 git commit 时的代码检查从**全项目全量扫描**改为**仅检查本次提交的 staged 文件**。

---

## ✅ 核心功能特性

### 1. 仅检查 staged 文件
- 只对 `git add` 的文件执行 eslint
- 历史代码完全不影响本次提交
- 从根源解决"改一行被 100 个历史错误阻断"的问题

### 2. Turbo 并行编排
- 保留 Turbo 任务并行执行能力
- 4 个子项目同时执行 lint:staged
- 无变更子项目毫秒级跳过
- 总耗时 ~300ms

### 3. 子项目规则隔离
- 每个子项目使用自己的 eslint 配置
- 前端 React 规则与后端 NestJS 规则完全隔离
- 新增子项目无需改根目录配置

### 4. 零自定义脚本
- 完全使用成熟的 `lint-staged` 第三方插件
- 跨平台兼容（Mac/Windows/Linux）
- 维护成本极低

---

## 🏗️ 架构设计

### 执行流程
```
git commit 触发
    ↓
.husky/pre-commit
    ├─ 第一步：根目录 lint-staged → prettier 格式化所有文件
    └─ 第二步：npm run lint:staged
         └── turbo lint:staged（并行进入所有子项目）
              ├── apps/web → lint-staged（前端 eslint 规则）
              ├── services/backend → lint-staged（后端 eslint 规则）
              ├── services/auth-service → lint-staged
              └── services/log-service → lint-staged
```

### 工作原理
- lint-staged 在子项目目录下执行
- 自动从执行目录向上查找 eslint 配置文件
- glob 路径是相对路径，只匹配自己目录下的文件
- 同一个文件只会被一个子项目匹配到

---

## 📝 修改文件清单

| 文件路径 | 修改内容 |
|----------|---------|
| 根目录 `package.json` | 新增 `lint:staged: "turbo lint:staged"` |
| 根目录 `turbo.json` | 新增 `lint:staged` 任务（cache: false） |
| `.husky/pre-commit` | `npm run lint` → `npm run lint:staged` |
| `apps/web/package.json` | 新增 `lint:staged` 脚本 + lint-staged 配置 |
| `services/backend/package.json` | 同上 |
| `services/auth-service/package.json` | 同上 |
| `services/log-service/package.json` | 同上 |

---

## 🧪 已验证场景

| 场景 | 验证结果 |
|------|---------|
| 无 staged 文件 | ✅ 4 个子项目全部快速通过（~300ms） |
| staged 非 ts/tsx 文件 | ✅ 正确识别不匹配，跳过 |
| staged 有 eslint 错误 | ✅ 精确捕获错误，阻止提交（退出码 1） |
| staged 无错误文件 | ✅ 通过检查 |
| 子项目规则隔离 | ✅ 每个子项目使用自己的 eslint 配置 |

---

## 📌 注意事项

### 与根目录 lint-staged 的关系

| 位置 | 职责 | 检查内容 |
|------|------|---------|
| 根目录 lint-staged | 格式化 | prettier（所有文件）+ stylelint（样式文件） |
| 子项目 lint:staged | 代码质量 | eslint（ts/tsx 文件） |

### 原有的 `npm run lint` 仍然保留
- 可以手动执行全量检查
- CI 环境可以继续使用
- 本地 commit 只检查 staged

---

## 🔮 后续优化方向

1. **TypeScript 类型检查**：目前只做 eslint，类型检查可以考虑增量方案
2. **lint-staged 版本统一**：确保所有子项目使用相同版本
3. **缓存优化**：对于大型项目，可以考虑进一步优化 eslint 缓存

---

## 📚 相关参考

- [lint-staged 官方文档](https://github.com/okonet/lint-staged)
- [Turbo 官方文档](https://turbo.build/repo/docs)
