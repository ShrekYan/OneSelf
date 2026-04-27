# Login 登录页面 - 功能说明文档

> 📚 模块类型：前端 React 组件（性能优化）
> 📁 文件路径：apps/web/src/pages/Login/
> 📅 更新日期：2026-04-27

---

## 📋 功能概述

移动端用户登录页面，提供用户名/密码登录功能，包含表单验证、密码可见性切换、协议勾选等交互。

**本次优化内容**：
1. 完善页面 5 文件拆分架构规范
2. 移除 `handle.ts` 中的副作用，保持纯函数
3. 使用 `useCallback` 缓存事件回调，减少不必要重渲染

---

## 🔧 技术实现

### 核心技术栈
- React 19 + TypeScript
- MobX 状态管理（useLocalObservable）
- React Hook Form + Zod 表单验证
- Ant Design Mobile 组件库
- CSS Modules 样式方案

### 架构设计
采用项目标准的 **页面 5 文件拆分规范**：

| 文件 | 职责 | 说明 |
|------|------|------|
| `index.tsx` | 组件渲染、事件处理 | UI 层，包含 JSX 和事件回调 |
| `useStore.ts` | MobX 状态管理 | 登录状态、API 调用、业务逻辑 |
| `handle.ts` | 纯函数处理 | 无副作用，只放纯函数 |
| `schema.ts` | 表单验证 Schema | Zod 验证规则 |
| ✅ **`types.ts`** | 类型定义 | 新增，统一管理类型 |
| `index.module.scss` | 组件样式 | CSS Modules 隔离 |

---

## 📁 文件清单

| 文件路径 | 修改类型 | 说明 |
|----------|---------|------|
| `apps/web/src/pages/Login/types.ts` | ✨ 新增 | 类型定义文件，导出 LoginFormData 和 LoginApiResponse 类型 |
| `apps/web/src/pages/Login/useStore.ts` | 🔧 修改 | 从 `types.ts` 导入类型，移除本地接口定义 |
| `apps/web/src/pages/Login/handle.ts` | 🔧 修改 | 移除 Toast 调用，保持纯函数，仅留 console.log |
| `apps/web/src/pages/Login/index.tsx` | 🔧 修改 | 添加 useCallback，缓存 4 个事件回调 + 2 个导航函数 |

---

## 🎨 React 组件设计检查清单

- ✅ Props 类型定义是否完整，有没有必要的默认值
- ✅ 是否处理了 Loading 和 Error 状态
- ✅ 样式是否使用 CSS Modules，根容器命名是否规范 `xxxContainer`
- ✅ 组件是否符合单一职责，有没有过大的组件需要拆分
- ✅ Hooks 使用是否正确，有没有违反 Hooks 规则
- ✅ **已优化**：有没有不必要的重渲染，是否需要 useMemo/useCallback
- ✅ 有没有正确清理 useEffect 的副作用
- ⏸️ 移动端点击区域是否 ≥ 44px（用户确认跳过）
- ✅ 可点击元素是否有 :active 反馈效果
- ✅ 是否适配了底部安全区域 `env(safe-area-inset-bottom)`
- ✅ 是否复用了已有组件，有没有重复造轮子
- ✅ 图片是否处理了懒加载和占位图

---

## 🎯 使用示例

### handle.ts 纯函数使用规范

```typescript
// ✅ 正确：handle.ts 只放纯函数，无副作用
export const handleForgotPassword = (): void => {
  console.log('Navigate to forgot password page');
};

// ❌ 错误：不应该在 handle.ts 中调用 Toast
export const handleForgotPassword = (): void => {
  Toast.show('...'); // ❌ 有 UI 副作用
};
```

### useCallback 缓存回调函数

```typescript
// ✅ 正确：所有事件回调都用 useCallback 缓存
const handleForgotPasswordClick = useCallback((e: React.MouseEvent) => {
  e.preventDefault();
  handleForgotPassword();
  goToForgotPassword();
}, [goToForgotPassword, handleForgotPassword]);

// JSX 中直接使用
<a onClick={handleForgotPasswordClick}>Forgot Password</a>
```

### 导航函数也缓存

```typescript
const goToRegister = useCallback(() => {
  navigate('/register');
}, [navigate]);
```

---

## 📝 注意事项与后续优化

### ⚠️ 重要注意事项

1. **handle.ts 必须是纯函数**：不能包含 Toast、API 调用、localStorage 等任何副作用
2. **类型必须统一管理**：所有页面类型定义放在 `types.ts` 中，不要分散在各文件
3. **useCallback 依赖数组必须完整**：所有外部引用的变量都要列在依赖数组中

### 🚀 后续可以继续优化的点

1. **缩小 MobX 订阅范围**：当前 `useObserver` 包裹整个组件，可以改为顶层读取精确订阅
2. **getRedirectUrl 用 useMemo 缓存**：URL 解析只需执行一次
3. **登录请求支持 AbortController**：组件卸载时可以取消未完成的请求
4. **添加单元测试**：为 handle.ts 纯函数和 useStore 方法添加测试

---

## ✅ 通用质量检查清单

- ✅ 命名是否规范（变量/函数/文件）
- ✅ 是否有必要的注释
- ✅ 是否处理了异常情况
- ✅ 代码是否有重复可以提取
- ✅ 是否符合项目现有代码风格

---

*本文档由 `/save-ai` 命令自动生成*
