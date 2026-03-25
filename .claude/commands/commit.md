# Git Commit 信息生成规范

## 概述

本文档定义了 Claude Code 生成 Git Commit 信息时必须遵循的规范。本项目严格遵循 **Conventional Commits** 约定式提交规范。

---

## 提交格式

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### 组成部分说明

1. **type**: 提交类型，必须小写
2. **scope**: 影响范围（可选），指明代码改动的领域/模块
3. **description**: 简短描述，动词开头，全部小写（首字母不大写）
4. **body**: 详细说明（可选），多行文本，解释改动原因和背景
5. **footer**: 脚注（可选），关联 Issue 或破坏性变更说明

---

## 允许的 type 类型

| 类型 | 说明 | 使用场景 |
|------|------|----------|
| `feat` | 新功能 | 新增产品功能、业务特性 |
| `fix` | 修复缺陷 | 修复 bug、解决线上问题 |
| `docs` | 文档更新 | 修改 README、API 文档、注释等 |
| `style` | 代码格式 | 不影响代码逻辑的格式调整（空格、分号、缩进等） |
| `refactor` | 代码重构 | 既不新增功能也不修复 bug 的代码结构调整 |
| `perf` | 性能优化 | 提升性能的代码改动 |
| `test` | 测试相关 | 添加或修改单元测试、集成测试 |
| `chore` | 构建/工具 | 修改构建工具、脚手架、CI/CD、依赖管理 |
| `ci` | CI 配置 | 修改 CI 配置文件和脚本 |
| `revert` | 回滚 | 回滚之前的提交 |

---

## Scope 命名约定

scope 应当对应代码改动的业务模块或目录结构：

- `api`: API 接口层
- `components`: 公共组件
- `pages`: 页面组件
- `hooks`: 自定义 Hooks
- `store`: MobX 状态管理
- `styles`: 样式文件
- `config`: 项目配置
- `routes`: 路由配置
- `utils`: 工具函数
- `deps`: 依赖更新
- `discover`: Discover 页面业务
- `product`: Product 页面业务

**示例**:
```
feat(discover): add new bottom navigation component
fix(api): handle 401 unauthorized error correctly
refactor(components): optimize card component rendering
```

---

## Description 书写规则

1. **长度限制**: 建议 50 字符以内，最长不超过 72 字符
2. **大小写**: 全部小写，首字母不大写
3. **结尾**: 不加句号 `.`
4. **语气**: 使用祈使语气，动词开头
5. **清晰**: 准确描述改动内容，避免模糊词汇

**✅ 正确示例**:
```
feat: add product filtering by category
fix: correct image loading placeholder
refactor: extract product card into separate component
```

**❌ 错误示例**:
```
feat: Added product filtering （首字母大写）
fix: bug fixed （不清晰）
refactor: changes to product card. （结尾有句号）
```

---

## Body 使用规范

- 如果是简单改动，可以省略 body
- 复杂改动需要在 body 说明：
  - **为什么**要做这个改动？
  - **解决**了什么问题？
  - 和之前的行为有什么不同？
- 使用正常句子，每句首字母大写，结尾加句号
- 每行建议不超过 80 字符

**示例**:
```
feat: add pull-to-refresh for product list

implement pull-to-refresh gesture to allow users manually refresh
the product list data. closes the issue where users need to
reopen page to get latest data.

the refresh indicator matches app design system colors.
```

---

## Footer 使用规范

### 关联 Issue

```
Closes: #123
Fixes: #456
```

### 破坏性变更 (Breaking Change)

如果你的改动引入了不兼容的破坏性变更，必须在 footer 中说明：

```
BREAKING CHANGE: <description>
```

**示例**:
```
BREAKING CHANGE: the productApi.list signature has changed,
the page parameter is now required.
```

---

## Revert 特殊格式

如果回滚之前的提交，格式如下：

```
revert: commit: <原始提交信息>

This reverts commit <原始 commit hash>.
```

---

## 检查清单 (Checklist)

生成 commit 信息前，请确认：

- [ ] type 是否符合允许的类型？
- [ ] scope 是否正确对应模块？
- [ ] description 是否简洁清晰（< 72 字符）？
- [ ] description 是否全部小写且不以句号结尾？
- [ ] 是否符合 Conventional Commits 格式？
- [ ] 破坏性变更是否已在 BREAKING CHANGE 中说明？
- [ ] 关联 Issue 是否正确标注？

---

## 完整示例

### 示例 1: 新增功能
```
feat(discover): add bottom navigation bar

implement new responsive bottom navigation with smooth transitions
between tabs. supports badge for unread messages.

Closes: #12
```

### 示例 2: 修复 Bug
```
fix(api): handle network timeout error properly

add retry logic for GET requests when network timeout occurs.
prevents app from crashing on unstable network connections.

Fixes: #35
```

### 示例 3: 代码重构
```
refactor(product): split product page into smaller components

split the large product page component into smaller reusable
components: product-list, product-filter, product-card.
improves code maintainability and enables component reuse.

no functional changes.
```

### 示例 4: 性能优化
```
perf(images): implement lazy loading for product images

use native lazy loading with intersection observer fallback.
reduces initial page load time and network data usage.
```

### 示例 5: 简单修复
```
fix: correct typo in login button text
```

---

## 本项目特定规则

1. **Co-Author**: 每次自动生成的 commit 需要添加：
   ```
   Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
   ```

2. **多个改动**: 如果一次提交包含多个不相关改动，建议分成多个 commit，每个 commit 对应一个逻辑改动。

3. **中文**: 允许使用中文编写 body，但 header（type/scope/description）必须使用英文。
