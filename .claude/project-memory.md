# 项目开发记忆 - 错误记录

## CSS 命名规范错误记录

### 错误场景
新建页面和组件时，**根容器 class 直接使用通用名称 `.container`，没有添加页面/组件名称作为前缀**。

### 正确规范
> 在 CSS Modules 中，虽然不会发生命名冲突，但是**所有 class 名称都应该使用页面/组件名称作为前缀**，保持语义清晰：
> - 页面 `Notifications` → 根容器 `.notificationsContainer`，所有其他 class 如 `.notificationsHeader`, `.notificationsBackBtn`, 等等
> - 组件 `NotificationListItem` → 根容器 `.notificationListItemContainer`，所有其他 class 如 `.notificationListItemAvatar`, `.notificationListItemContent`, 等等

### 原因
这样做可以：
1. 保持样式语义化，一眼就能看出这个 class 属于哪个组件
2. 方便调试和查找
3. 避免在开发者工具中看到一堆通用的 `.container` `.header` `.content` 无法区分

### 示例
❌ 错误写法：
```scss
.container { ... }
.header { ... }
.content { ... }
```

✅ 正确写法：
```scss
.notificationsContainer { ... }
.notificationsHeader { ... }
.notificationsContent { ... }
```

---

**记录日期**: 2026-03-27
**错误原因**: 沿袭了其他项目习惯，忘记本项目要求所有 class 都加前缀

---

## Claude Code 命令路径规则

### 错误场景
要创建一个可以通过 `/command-name` 执行的命令，错误地将文件放在 `skills/` 目录下：`.claude/skills/workflow.md`，执行时报错 `Unknown skill: workflow`。

### 正确规则
> **Claude Code 斜杠命令路径约定**：
> - ✅ `commands/` 目录 → `.claude/commands/{command-name}.md` → 可以通过 `/{command-name}` 直接执行
> - ❌ `skills/` 目录 → `.claude/skills/{skill-name}.md` → **不能**通过 `/{skill-name}` 直接执行

### 原因
Claude Code 的设计：
- `commands/` - 存放可直接通过 `/` 调用的命令，每个文件对应一个命令名称
- `skills/` - 存放技能规范和审查规则，供其他命令/代理调用，不直接作为斜杠命令入口

### 正确示例
要创建 `/workflow` 命令：
- ✅ 正确路径：`.claude/commands/workflow.md`
- ❌ 错误路径：`.claude/skills/workflow.md`

---

**记录日期**: 2026-04-14
**错误原因**: 混淆了 commands 和 skills 目录的用途，两者职责不同

---

## Prisma 模型访问不需要多余的 as any 转换

### 错误场景
当 Prisma schema 模型名为 `model Articles` 时，错误地认为需要使用 `(this.prisma as any).articles` 来绕过 TypeScript 类型检查。

### 错误现象
- 代码中多出不必要的 `as any` 类型断言
- 降低了 TypeScript 类型安全性

### 原因分析
旧的错误记忆：误认为当模型名是大写复数时 (`Articles`)，映射到表名小写 (`articles`) 后，TypeScript 无法识别 `this.prisma.articles` 属性。

实际正确情况：**Prisma 可以正确生成类型**，当模型名为 `model Articles` 时：
- 生成的查询属性名就是 `prisma.articles` (小写复数)
- TypeScript 可以正确识别，不需要 `as any`

### 正确解决方法

❌ 错误写法：
```typescript
const [articlesWithCategories, total] = await Promise.all([
  (this.prisma as any).articles.findMany({
    where,
    orderBy,
    skip,
    take: pageSize,
    include: { categories: true },
  }),
  (this.prisma as any).articles.count({ where }),
]);
```

✅ 正确写法：
```typescript
const [articlesWithCategories, total] = await Promise.all([
  this.prisma.articles.findMany({
    where,
    orderBy,
    skip,
    take: pageSize,
    include: { categories: true },
  }),
  this.prisma.articles.count({ where }),
]);
```

### 什么时候才需要 as any？
只有当**模型名本身在 Prisma schema 中就是全小写**时（如 `model articles` 而不是 `model Articles`），才需要用 `as any` 绕过。但本项目所有模型名都使用首字母大写，所以永远不需要。

---

**记录日期**: 2026-04-16
**错误原因**: 基于过时错误记忆添加了不必要的 `as any` 类型断言

---

## Claude Code include 指令不递归解析

### 错误场景
在 Agent 或 Skill 文件中通过 `include:` 引用一个总入口文件（如 `h5-frontend-developer.md`），期望这个入口文件内部的 `#include:` 子文件也能被自动加载。

### 错误现象
- **代码生成准确率暴跌**：从 95% 下降到 < 50%
- Agent 完全不知道关键规范（MobX 写法、目录结构、样式规范等）
- 生成的代码频繁违反项目约定
- 排查困难，很难意识到是 include 没有生效

### 原因分析
**Claude Code 的 `include:` 解析器是单层的，不递归**：
- ✅ `frontend-project-info.md` → `include: h5-frontend-developer.md` → 能正常加载
- ❌ `h5-frontend-developer.md` 内部的 `#include: architecture-directory.md` 等 11 个子文件 → **不会被加载**

这是 Claude Code 目前的设计限制，不是 bug，只是行为不符合直觉。

### 正确解决方法

#### 方案 A：扁平化全量 include（当前推荐）
在所有 Agent 文件顶部**显式列出所有要 include 的文件**，不依赖嵌套引用：

```markdown
<!-- ✅ 正确：全部扁平化列出 -->
#include: ../skills/h5-frontend-developer/h5-frontend-developer.md
#include: ../skills/h5-frontend-developer/architecture-directory.md
#include: ../skills/h5-frontend-developer/page-directory-structure.md
#include: ../skills/h5-frontend-developer/ui-component-spec.md
#include: ../skills/h5-frontend-developer/logic-data-flow.md
#include: ../skills/h5-frontend-developer/troubleshooting.md
#include: ../skills/h5-frontend-developer/rules/frontend-typescript.md
#include: ../skills/h5-frontend-developer/rules/frontend-css-scss.md
<!-- ... 其他所有规则文件 -->
```

#### 方案 B：构建脚本自动化（长期优化）
写一个 Node 脚本递归解析 `#include:` 指令，生成扁平化后的最终产物，放在 `dist/` 目录供 Agent 引用。

#### 验证方式
在 Agent 文件开头加上说明文字，确认所有规范都已物理嵌入：
```markdown
<!-- 🔐 第一优先级：核心规则区 - 编译期 100% 物理嵌入 -->
<!-- 注意：全部扁平化列出，不嵌套，确保 Claude Code 解析器能加载 -->
```

---

**记录日期**: 2026-04-21
**错误原因**: 误以为 Claude Code 的 `include:` 指令会递归解析嵌套引用

---

## API 模块循环依赖导致 "Cannot access 'api' before initialization"

### 错误场景
在 `api/auth/index.ts` 中使用相对路径导入 `axios-instance`，修改接口函数后浏览器控制台报错无法初始化。

### 错误现象
```
Uncaught ReferenceError: Cannot access 'api' before initialization
    at index.ts:43:20
```

### 原因分析
**形成了循环依赖链**：
```
1. api/core/axios-instance.ts
   ↳ import defaultApi from '../index'  (第13行)

2. api/index.ts
   ↳ import * as authApi from './auth'  (第10行)

3. api/auth/index.ts
   ↳ import api from '../core/axios-instance'  (第1行)

↺ 回到第一步，形成死循环！
```

当模块初始化时，`api` 变量还未完成赋值就被引用，导致初始化顺序错误。

### 正确解决方法
**打破循环依赖链**，将相对路径导入改为从 `@/api` 入口导入：

❌ 错误写法：
```typescript
import api from '../core/axios-instance';
```

✅ 正确写法：
```typescript
import { api } from '@/api';
```

**原理**：从 `@/api` 入口导入时，`api` 变量已在 `api/index.ts:22` 完成导出声明，不会在初始化阶段直接引用 `axios-instance` 的默认导出。

---

**记录日期**: 2026-04-29
**错误原因**: API 模块间形成循环依赖链，相对路径导入导致初始化顺序错误

---
