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
