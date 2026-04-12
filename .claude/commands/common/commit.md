# Git 提交信息生成命令

**触发**: `/commit` （不带参数）或 `/commit 描述信息`
**行为**: 读取当前 `git status` 中的改动，分析文件变更，按照本文件定义的规范生成符合 Conventional Commits 的提交信息，然后执行 `git commit`。

---

## 执行流程

1. 运行 `git status` 获取当前已暂存（staged）的文件改动
2. 如果没有已暂存的文件，运行 `git add .` 将所有改动暂存
3. 分析每个文件的改动内容，判断提交类型（`feat`/`fix`/`refactor` 等）和影响范围（scope）
4. 严格按照本文件定义的规范生成提交信息
5. 展示生成的提交信息给用户预览
6. 确认后执行 `git commit` 完成提交

---

## Git Commit 信息生成规范

本文档定义了 Claude Code 生成 Git Commit 信息时必须遵循的规范。本项目严格遵循 **Conventional Commits** 约定式提交规范。

---

## 提交格式

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### 组成部分说明

1. **type**: 提交类型，必须小写（保持英文）
2. **scope**: 影响范围（可选），指明代码改动的领域/模块（中文/英文均可）
3. **description**: 简短描述，动词开头，使用中文
4. **body**: 详细说明（可选），多行文本，解释改动原因和背景（使用中文）
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
feat(discover): 添加全新底部导航组件
fix(api): 正确处理 401 未授权错误
refactor(components): 优化卡片组件渲染
```

---

## Description 书写规则

1. **长度限制**: 建议 20 个汉字以内，最长不超过 30 个汉字
2. **结尾**: 不加句号 `。`
3. **语气**: 使用祈使语气，动词开头
4. **清晰**: 准确描述改动内容，避免模糊词汇

**✅ 正确示例**:
```
feat: 添加商品按分类筛选功能
fix: 修复图片加载占位错误
refactor: 提取商品卡片为独立组件
```

**❌ 错误示例**:
```
feat: 添加了商品按分类筛选功能。（结尾有句号）
fix: 修复了一个bug （不清晰）
refactor: 对商品卡片做了一些修改 （描述模糊）
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
feat: 添加下拉刷新到商品列表

实现下拉刷新手势，允许用户手动刷新
商品列表数据。解决了用户需要
重新打开页面才能获取最新数据的问题。

刷新指示器匹配应用设计系统颜色。
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
BREAKING CHANGE: productApi.list 方法签名已变更，
page 参数现在为必填项。
```

---

## Revert 特殊格式

如果回滚之前的提交，格式如下：
```
revert: 回滚: <原始提交信息>

This reverts commit <原始 commit hash>.
```

---

## 检查清单 (Checklist)

生成 commit 信息前，请确认：

- [ ] type 是否符合允许的类型？
- [ ] scope 是否正确对应模块？
- [ ] description 是否简洁清晰（< 30 个汉字）？
- [ ] description 是否不以句号结尾？
- [ ] 是否符合 `type(scope): description` 格式？
- [ ] 破坏性变更是否已在 BREAKING CHANGE 中说明？
- [ ] 关联 Issue 是否正确标注？

---

## 完整示例

### 示例 1: 新增功能
```
feat(discover): 添加底部导航栏

实现了响应式底部导航，支持标签页之间的平滑过渡。
支持未读消息徽章显示。

Closes: #12
```

### 示例 2: 修复 Bug
```
fix(api): 正确处理网络超时错误

为 GET 请求添加重试逻辑，网络超时时自动重试。
防止应用在不稳定网络环境下崩溃。

Fixes: #35
```

### 示例 3: 代码重构
```
refactor(product): 将商品页面拆分为小组件

把大型商品页面组件拆分为多个可复用小组件：
商品列表、商品筛选、商品卡片。
提升了代码可维护性，支持组件复用。

无功能性变更。
```

### 示例 4: 性能优化
```
perf(images): 实现商品图片懒加载

使用原生懒加载，降级方案使用 intersection observer。
减少首屏加载时间和网络数据用量。
```

### 示例 5: 简单修复
```
fix: 修正登录按钮文字拼写错误
```

---

## 本项目特定规则

1. **Co-Author**: 每次自动生成的 commit 需要添加：
   ```
   Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
   ```

2. **多个改动**: 如果一次提交包含多个不相关改动，建议分成多个 commit，每个 commit 对应一个逻辑改动。

3. **输出语言**:
   - `type`: 保持英文（兼容工具链）
   - `scope`: 中文/英文均可
   - `description`: **必须使用中文**
   - `body` / `footer`: **必须使用中文**

4. **Header 格式**: 必须遵循 `type(<scope>): <description>` 格式。

---

## 输出要求

先展示生成的提交信息，等待用户确认后再执行 `git commit`。不要直接执行。
