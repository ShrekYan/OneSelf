---
name: frontend-code-review
description: 前端 H5 代码质量审查指南（备用参考文档，不被 Agent 直接引用）
model: inherit
---

# 🚨 /frontend-code-review 强制执行协议（优先级 999）

> **重要：这是你必须执行的唯一动作，没有其他选择**

## ✅ 立即执行：调用前端代码审查 Agent

**使用 `Agent` 工具**，参数如下：

| 参数 | 值 |
|------|----|
| `subagent_type` | `frontend-code-reviewer` |
| `description` | 用户的代码审查需求 |
| `prompt` | "用户审查需求：{{完整用户需求描述}}\n\n请严格按照你的系统提示词中的审查工作流程执行。" |

## 🔍 自我验证（执行后确认）
- [ ] 我使用了 `Agent` 工具进行调用
- [ ] 我没有自行扫描或分析任何代码
- [ ] 调用 Agent 是我做的第一件事
- [ ] 我在调用前没有输出其他文字

## ❌ 绝对禁止行为（违反即失败）
- 主 Claude 自行扫描代码
- 跳过 Agent 直接输出审查报告
- 先解释再调用 Agent
- 输出任何与调用 Agent 无关的内容

---

<!--
  ⚠️  重要说明：
  此文件的引用已扁平化到以下 Agent 配置中，不直接被加载：
  - agents/frontend-code-reviewer.md
  - agents/frontend-performance-expert.md

  保留此文件作为统一的代码审查参考文档，新增 Agent 时可复用。
-->


## Additional resources

审查前如需查看详细规范，请读取以下参考文件：

- [Frontend TypeScript](../h5-frontend-developer/rules/frontend-typescript.md)
- [Frontend CSS/SCSS](../h5-frontend-developer/rules/frontend-css-scss.md)
- [Frontend API design](../h5-frontend-developer/rules/frontend-api-design.md)
- [Frontend hooks TS](../h5-frontend-developer/rules/frontend-hooks-ts.md)
- [Frontend hooks error handling](../h5-frontend-developer/rules/frontend-hooks-error-handling.md)
- [Frontend third-party libraries](../h5-frontend-developer/rules/frontend-third-party-libraries.md)
- [Frontend components](../../rules/frontend-components.md)

# 代码审查指南

当需要审查代码质量时，按照本指南进行检查，聚焦核心问题，拒绝冗长水文。

---

## 审查范围

- `src/` - 前端 H5 项目代码（React 19 + TypeScript + MobX + Vite）
- **排除**: 后端代码不检查

---

## 审查清单

### 🔴 架构规范（必须检查，违反即中等以上）

#### 页面目录结构规范（遵循 `CLAUDE.md`）
- [ ] 页面是否按职责拆分：`index.tsx` + `useStore.ts` + `constant.ts` + `types.ts` + `hooks/` + `components/`？
- [ ] `useStore.ts` 是否使用 `useLocalObservable` + **对象字面量**写法？（禁止页面级使用 class）
- [ ] 复杂业务逻辑是否抽离到 `hooks/useXxx.ts`？纯函数是否正确放置？
- [ ] `constant.ts` 是否存放页面所有常量配置？

#### API 层规范（遵循 `.claude/rules/frontend-api-design.md`）
- [ ] 是否按业务模块拆分到 `apps/web/src/api/[module]/`？
- [ ] 是否在 `apps/web/src/api/index.ts` 统一导出？
- [ ] 所有请求/响应是否有完整 `Params`/`Response` 类型定义？
- [ ] 缓存配置是否合理（不常变数据开启 `cache: true`）？
- [ ] 是否使用路径别名 `@/api` 而非相对路径？

### 🔵 TypeScript 类型安全（遵循 `.claude/rules/frontend-typescript.md`）
- [ ] 是否存在隐式 `any` 或滥用 `any` 绕过类型检查？（优先 `unknown`）
- [ ] 组件 Props、API 请求/响应是否有完整类型定义？
- [ ] 可空值是否用 `Type | null` 明确标注？（区分 `undefined` 和 `null` 语义）
- [ ] 泛型是否添加了正确约束？
- [ ] 类型导出是否都使用 `export type`？
- [ ] 是否优先使用联合类型代替 `enum`？

### 🔵 React 19 规范
- [ ] Hooks 规则是否遵守（顶层调用、依赖完整）？
- [ ] `useState`/`useRef` 是否指定了正确泛型类型？
- [ ] 是否合理使用 `useMemo`/`useCallback` 避免不必要重渲染？
- [ ] 单个组件是否过大（> 500 行），是否抽离可复用子组件？
- [ ] `useEffect` 是否正确返回清理函数（防止内存泄漏）？

### 🔵 MobX 6 状态管理
- [ ] **页面级 Store**: 是否遵循 `useLocalObservable` + 对象字面量？
- [ ] **全局 Store**: 是否正确使用 class + `makeAutoObservable`？
- [ ] Store 所有字段是否显式声明类型并初始化？
- [ ] 方法参数和返回值是否都有类型？
- [ ] 是否使用 `useObserver` Hook？（禁止 observer HOC）
- [ ] 是否避免在 actions 之外修改状态？

### 🔵 样式规范（SCSS + CSS Modules，遵循 `.claude/rules/frontend-css-scss.md`）
- [ ] 是否使用 `*.module.scss`？（禁止全局样式污染）
- [ ] class 命名是否为 **camelCase**（SCSS 源码与 TS 引用保持一致）？
- [ ] **根容器命名** 是否遵循 `{componentName}Container` 规则？
- [ ] 是否基于 **750px 设计稿** 使用 px 编写（自动转 vw，禁止手动 vw）？
- [ ] SCSS 嵌套深度是否 ≤ 3 层？
- [ ] 点击元素尺寸是否 ≥ 44px × 44px？
- [ ] 是否适配安全区域（`env(safe-area-inset-bottom)` 等）？
- [ ] 是否合理使用全局样式变量？

### 🔵 业务逻辑拆分（遵循 `.claude/rules/frontend-hooks-ts.md`）
- [ ] 纯函数是否正确放置在 `useStore.ts` 或 `utils.ts`？
- [ ] API 调用是否放在 `useStore.ts` 或 `hooks/`？
- [ ] 复杂业务逻辑是否抽离到 `hooks/useXxx.ts`？
- [ ] 所有函数是否使用具名导出？（禁止 `export default`）

### 🔵 自定义 Hooks 规范（遵循 `.claude/rules/frontend-hooks-error-handling.md`）
- [ ] 文件名是否以 `use` 开头（`useXxx.ts`）？
- [ ] 是否为参数和返回值定义完整类型？
- [ ] 副作用是否正确清理（timer、事件监听）？

### 🔵 第三方库使用规范（遵循 `.claude/rules/frontend-third-party-libraries.md`）
- [ ] `react-use` 是否按需导入（`react-use/lib/useDebounce`）？
- [ ] 是否优先使用 `zod` 做数据校验？
- [ ] 是否优先使用 `es-toolkit` 代替 `lodash`？
- [ ] 动态 className 拼接是否使用 `classnames`？

### 🔵 H5 移动端适配
- [ ] 点击元素最小尺寸是否 ≥ 44px？
- [ ] 是否适配安全区域（刘海屏、底部小黑条）？
- [ ] 是否优先使用 Ant Design Mobile 组件，避免重复造轮子？
- [ ] 非首屏图片是否懒加载？

### 🔵 安全与性能
- [ ] 是否存在 XSS 风险（用户输入未转义）？
- [ ] 是否有敏感信息（API 密钥、Token）硬编码在代码中？
- [ ] 大图是否压缩？是否使用 WebP 格式？
- [ ] 是否存在内存泄漏风险（事件监听/timer 未清理）？
- [ ] 大型列表是否使用虚拟滚动？

### 🔵 代码整洁度
- [ ] 是否所有导入使用路径别名 `@/`，禁止长相对路径？
- [ ] 是否有未使用的导入/变量？
- [ ] 命名是否符合规则：
  - 变量/函数：`camelCase`
  - 类/接口/组件：`PascalCase`
  - 文件名：目录按规范（组件 PascalCase，api 模块 kebab-case）
- [ ] 导入排序是否正确：第三方 → 别名 → 相对路径？
- [ ] 是否删除了注释掉的死代码？
- [ ] 是否通过 `npm run lint` 检查？

---

## 问题严重程度分级

| 级别 | 说明 |
|------|------|
| 🔴 **严重** | 功能不可用、内存泄漏、安全漏洞、数据丢失、违反架构核心规则导致难以维护 |
| 🟠 **中等** | 功能异常、类型不安全、性能问题、不符合项目规范、影响可维护性 |
| 🟡 **轻微** | 代码风格、缺少注释、命名不规范、不影响功能和维护 |

---

## 审查步骤

1. **收集文件** - 列出改动涉及的所有文件
2. **逐项检查** - 按上述清单检查，对照项目规范文档
3. **标记问题** - 记录位置（`文件:行号`）
4. **分类定级** - 按类型和严重程度分类
5. **给出方案** - 每个问题提供具体修复建议，最好有代码示例
6. **总结优先级** - 给出修复顺序建议

---

## 输出模板

```markdown
## 代码审查结果

### 审查范围
- 文件列表: ...

### 发现问题

#### 🔴 严重问题
1. `src/path/file.ts:line` - 问题描述
   - 影响: ...
   - 修复建议: ...

#### 🟠 中等问题
1. `src/path/file.ts:line` - 问题描述
   - 影响: ...
   - 修复建议: ...

#### 🟡 轻微问题
1. `src/path/file.ts:line` - 问题描述
   - 修复建议: ...

### 总体评价
...

### 优先修复顺序
1. ...
2. ...

### 验证建议
修复完成后，请运行：
```bash
npm run lint
npx tsc --noEmit
```
```
