# 10 - 常见问题与排错

## 注意事项

1. **移动端适配**: 所有样式使用 px 单位，自动转换为 vw，设计稿宽度 750px
2. **性能优化**: 使用 React.memo, useMemo, useCallback 优化渲染
3. **错误边界**: 使用 react-error-boundary 捕获组件错误
4. **代码分割**: 使用 lazy + Suspense 进行代码分割
5. **类型安全**: 严格使用 TypeScript，避免 any 类型
6. **Git 规范**: 使用 Commitlint 规范提交信息

---

## Node.js ERR_INTERNAL_ASSERTION 错误（stylelint 加载失败）

### 问题现象

```
Error [ERR_INTERNAL_ASSERTION]: Unexpected module status 5. Cannot require() ES Module /.../stylelint.config.js because it is not yet fully loaded.
```

### 根本原因

- 项目 `package.json` 设置了 `"type": "module"`，所有 `.js` 文件默认按 ES Module 处理
- `stylelint.config.js` 使用了 ES Module 语法
- cosmiconfig（被 lint-staged/stylelint 使用）尝试用 `require()` 同步加载这个 ES Module 文件
- Node.js 内部发生竞态条件，抛出断言错误

### 解决方案

1. 将 `stylelint.config.js` 重命名为 `stylelint.config.cjs`（`.cjs` 扩展名强制作为 CommonJS 处理）
2. 将 `import/export default` 语法改为 `require/module.exports`
3. stylelint 不需要 `createConfig` 包装，直接导出配置对象即可：

```cjs
// ✅ 正确：使用 CommonJS 格式，文件名为 stylelint.config.cjs
const standardScss = require('stylelint-config-standard-scss')
const scssPlugin = require('stylelint-scss')

module.exports = {
  extends: [standardScss],
  plugins: [scssPlugin],
  // ... 其他配置
}
```

**经验总结**: 当项目启用 `"type": "module"` 后，配置文件应该使用 `.cjs` 扩展名。

---

## ESLint 常见错误与修复

### 1. 空接口声明错误 `An empty interface declaration allows any non-nullish value`

**问题现象**:
```
✘ [Line X:X] An empty interface declaration allows any non-nullish value, including literals like `0` and "".
```

**根本原因**:
- ESLint `@typescript-eslint/no-empty-object-type` 规则不允许空接口
- 空接口`interface Props{}`实际上允许任何非空值，这不是类型安全的

**解决方案**:
- 如果组件**不需要任何 props**，直接移除空接口声明
- 不要使用 `({}: Props)`，直接改为 `()`

```tsx
// ❌ 错误写法
interface TopBarProps {}
export const TopBar = React.memo(({}: TopBarProps) => { ... })

// ✅ 正确写法
export const TopBar = React.memo(() => { ... })
```

---

### 2. React Hook 在普通函数中调用 `React Hook "useNavigate" is called in function`

**问题现象**:
```
✘ React Hook "useNavigate" is called in function "navigateToArticleDetail" that is neither a React function component nor a custom React Hook function.
```

**根本原因**:
- React Hook **只能在 React 组件或自定义 Hook 中调用**
- 在普通的工具函数中调用 Hook 违反了 React 规则

**解决方案**:
- 创建一个**自定义 Hook**来导出需要使用导航的回调函数
- 在组件中调用这个 Hook 获取回调函数

```tsx
// ❌ 错误写法：在普通函数中调用 Hook
export const navigateToArticleDetail = (articleId: string): void => {
  const navigate = useNavigate()
  navigate(`/article/${articleId}`)
}

// ✅ 正确写法：自定义 Hook 中使用 useCallback
export const useNavigationActions = () => {
  const navigate = useNavigate()

  const navigateToArticleDetail = useCallback((articleId: string): void => {
    navigate(`/article/${articleId}`)
  }, [navigate])

  return { navigateToArticleDetail }
}

// 在组件中使用
const Component = () => {
  const { navigateToArticleDetail } = useNavigationActions()
  return <div onClick={() => navigateToArticleDetail(id)} />
}
```

---

### 3. SCSS `line-clamp` 兼容性警告

**问题现象**:
```
⚠ Also define the standard property 'line-clamp' for compatibility [vendorPrefix]
```

**根本原因**:
- 只写了 `-webkit-line-clamp`，缺少标准的 `line-clamp` 属性
- 为了兼容性需要同时定义标准属性

**解决方案**:
```scss
// ❌ 错误写法
.title {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

// ✅ 正确写法：添加标准 line-clamp
.title {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
```

---

### 4. 空对象解构警告 `Unexpected empty object pattern`

**问题现象**:
```
✘ Unexpected empty object pattern.
```

**根本原因**:
- `({})` 空对象解构没有意义，应该直接去掉

**解决方案**:
```tsx
// ❌ 错误写法
const Component = ({}: Props) => { ... }

// ✅ 正确写法
const Component = () => { ... }
```

---

## 组件错误分析与修复检查清单

当分析现有组件的报错问题时，请按以下步骤检查：

### 1. TypeScript 类型检查
- [ ] **返回值类型**：函数返回类型是否与实际使用场景匹配？
- [ ] **枚举/联合类型匹配**：`string` 类型是否需要收窄为联合类型？
- [ ] **未使用变量**：声明后未使用的变量是否需要删除？
- [ ] **类型断言**：是否存在不必要的类型断言 `as`？

### 2. SVG/图标检查
- [ ] **viewBox 一致性**：`viewBox` 尺寸与 `width/height` 是否匹配？
- [ ] **path 坐标比例**：缩放图标时 `path` 坐标是否同步调整？
- [ ] **统一尺寸**：同一组件内多个图标是否保持相同尺寸？

### 3. SCSS 样式规范检查
- [ ] **全局变量自动注入**：`$variables.scss` 已全局注入，**不需要** `@import` 或 `@use`
- [ ] **直接使用变量**：直接使用 `$primary-color`，不需要 `vars.$primary-color` 命名空间
- [ ] **颜色规范**：颜色、字体、间距、过渡等是否使用 `@/styles/variables.scss` 变量？
- [ ] **清理硬编码**：移除硬编码数值，优先使用全局变量

### 4. 产品体验检查
- [ ] **文案国际化**：中文项目是否使用中文文案，而非英文？
- [ ] **无障碍访问**：交互元素是否添加 `aria-*` 属性（如 `aria-current`）？
- [ ] **可访问标签**：按钮是否有文字或 `aria-label` 标签？

### 5. 代码清理
- [ ] **核心原则**：**没有使用就不要引入** - 如果不需要 store 就不要导入 store
- [ ] **未使用导入**：是否有导入但未使用的模块？
- [ ] **未使用变量**：声明后未使用的变量是否需要删除？
- [ ] **冗余代码**：是否存在注释掉的死代码需要删除？
- [ ] **console 日志**：是否遗留调试用的 `console.log`？

### 修复案例 - bottom-nav 组件

| 问题 | 修复方式 |
|------|----------|
| `getActiveNavId(): string` 返回类型不匹配 | 改为 `: BottomNavId` 并添加有效性校验 |
| SVG `viewBox="0 0 14 18"` 不匹配 | 改为 `0 0 24 24` 并按比例缩放 `path` 坐标 |
| 颜色硬编码 `#8848f9` `#ffffff` | 添加 `$primary-purple` 变量，SCSS 中直接使用变量 |
| **SCSS 变量导入** | `$variables.scss` 已全局注入，不需要 `@import` |
| **核心原则** | 组件不需要 store → 不导入 store，保持代码干净 |
| 导航名称显示英文 Home/Explore | 改为中文 首页/发现/收藏/我的 |
| 缺少无障碍标记 | 添加 `aria-current={isActive ? 'page' : undefined}` 和 `aria-label` |
