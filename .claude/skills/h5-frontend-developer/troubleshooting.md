# 04 - 常见问题与排错

## 环境配置
- **`.cjs` 扩展名**: 当项目 `type: "module"` 时，`stylelint.config.js` 等配置文件应重命名为 `.cjs` 以解决加载断言错误。

## ESLint 避坑
- **禁止空接口**: 不要定义 `interface Props {}`，无 props 时直接不写。
- **Hook 作用域**: Hook 只能在组件或自定义 Hook 中调用。如需在 `handle.ts` 中使用导航，应由组件通过参数传入或使用自定义 Hook 包装。

## 性能与安全
- **严格类型**: 严禁滥用 `any`，优先使用 `unknown` + 类型守卫。
- **渲染优化**: 避免在渲染函数中定义大对象，使用 `useMemo` 或 `useCallback`。
