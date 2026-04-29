# 04 - 常见问题与排错

## 环境配置
- **`.cjs` 扩展名**: 当项目 `type: "module"` 时，`stylelint.config.js` 等配置文件应重命名为 `.cjs` 以解决加载断言错误。

## ESLint 避坑
- **禁止空接口**: 不要定义 `interface Props {}`，无 props 时直接不写。
- **Hook 作用域**: Hook 只能在组件或自定义 Hook 中调用。如需在 `handle.ts` 中使用导航，应由组件通过参数传入或使用自定义 Hook 包装。

## 性能与安全
- **严格类型**: 严禁滥用 `any`，优先使用 `unknown` + 类型守卫。
- **渲染优化**: 避免在渲染函数中定义大对象，使用 `useMemo` 或 `useCallback`。

---

## 🔍 循环依赖问题排查

### 常见症状

- Vite 控制台出现 `Circular dependency` 警告
- 模块导出为 `undefined` 或部分属性丢失
- 类型定义引用异常
- 热更新（HMR）行为异常

### 本项目典型场景

#### 场景 1：API 拦截器调用刷新接口

**问题**：axios-instance 导入 defaultApi 调用 auth.refreshToken()
**修复**：在 axios-instance 内部直接构造请求

```typescript
// ✅ 正确：直接调用，不依赖聚合层
async function refreshTokenInternal(refreshToken?: string) {
  return await api.post('/api/v1/auth/refresh', { refreshToken }, {
    skipErrorToast: true,
    skipAuth: true,
  });
}
```

#### 场景 2：Store 与 API 互相引用

**问题**：Store 导入 API，API 拦截器导入 Store 更新状态
**修复**：使用延迟获取函数，避免模块顶层导入

```typescript
// ✅ 正确：延迟获取，运行时才引用
import { getRootStore } from '@/store';

function onTokenExpired() {
  const rootStore = getRootStore(); // 运行时调用，非初始化时
  rootStore.app.reset();
}
```

### 排查工具

```bash
# 全局检测循环依赖
npx madge --circular src/

# 仅检测 API 模块
npx madge --circular src/api/

# 生成依赖图（需要 graphviz）
npx madge --image graph.png src/api/
```

### 快速修复清单

- [ ] 检查 `apps/web/src/api/core/axios-instance.ts` 是否导入了 `@/api` 或 `../index`
- [ ] 检查业务 API 模块是否导入了聚合层（应只导入 core 层）
- [ ] 使用动态 import 延迟加载仅在运行时需要的模块
- [ ] 将互相依赖的逻辑抽离到共同的工具层
