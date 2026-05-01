# AI 协同开发成果 - Login 页面性能优化

---

## 📅 协同基本信息

- **协同日期**：2026-04-27
- **开发模块**：apps/web/src/pages/Login/
- **协同时长**：约 30 分钟
- **协同类型**：前端性能优化 + 架构规范修正

---

## 🎯 本次协同目标

1. 对 Login 页面进行前端性能优化审查
2. 修复架构不规范问题（handle.ts 有副作用、缺少 types.ts）
3. 减少不必要的组件重渲染
4. 确保符合项目 5 文件拆分规范

---

## 📝 完成的工作内容

### 代码变更清单

| 文件路径 | 修改类型 | 变更内容简述 |
|----------|---------|-------------|
| `apps/web/src/pages/Login/types.ts` | ✨ 新增 | 类型定义文件，统一管理 LoginFormData 和 LoginApiResponse |
| `apps/web/src/pages/Login/useStore.ts` | 🔧 修改 | 从 types.ts 导入类型，移除重复的接口定义 |
| `apps/web/src/pages/Login/handle.ts` | 🔧 修改 | 移除 Toast.show() 调用，保持纯函数，只保留 console.log |
| `apps/web/src/pages/Login/index.tsx` | 🔧 修改 | 添加 useCallback，缓存 4 个事件回调 + 2 个导航函数 |

### 功能实现说明

**1. 架构规范化**
- 严格遵循项目 5 文件拆分规范
- 新增独立的 `types.ts` 文件，类型定义不再分散
- `handle.ts` 彻底纯函数化，移除所有 UI 副作用

**2. 性能优化**
- 6 个函数使用 `useCallback` 缓存：
  - `handleForgotPasswordClick` - 忘记密码点击
  - `handleUserAgreementClick` - 用户协议点击
  - `handlePrivacyPolicyClick` - 隐私政策点击
  - `handleRegisterLinkClick` - 注册链接点击
  - `goToRegister` - 跳转到注册页面
  - `goToForgotPassword` - 跳转到忘记密码页面
- 保持函数引用稳定，避免子组件不必要重渲染

**3. 命令规范更新**
- 更新 `/save-ai` 命令规范，强制生成 3 个文档
- 修改存储规则，统一目录，不再分散存放

---

## 💡 关键技术决策

### 决策 1：架构规范优先于微优化

**背景**：Login 页面存在架构不规范问题（无 types.ts、handle.ts 有副作用）

**方案**：优先修复架构规范问题，再做性能优化

**理由**：
- 架构不规范导致的维护成本远大于微小性能收益
- 项目统一规范是团队协作的基础
- 养成好习惯比单次优化更重要

**备选方案**：先做性能优化，再改架构 → **否定**：不规范的架构会让优化效果打折扣

---

### 决策 2：handle.ts 严格纯函数，副作用上移

**背景**：handle.ts 中调用了 Toast.show()，违反纯函数规范

**方案**：Toast 调用全部移到 index.tsx 的 useCallback 中，handle.ts 只保留 console.log

**理由**：
- 纯函数更容易单元测试，没有外部依赖
- 副作用集中管理，便于追踪和调试
- 符合项目既定的架构规范

**备选方案**：Toast 封装成 Hook 再导入 handle.ts → **否定**：handle.ts 应该无任何外部依赖，保持纯粹

---

### 决策 3：跳过点击区域优化，尊重用户判断

**背景**：性能专家建议增大密码切换按钮点击区域到 ≥ 44px

**方案**：用户明确表示不需要优化，严格遵循用户判断，不强行优化

**理由**：
- 用户是业务决策者，可能有产品层面的考虑
- 过度优化反而可能引入视觉或布局问题
- AI 是助手，不是决策者

**备选方案**：强行优化点击区域 → **否定**：越俎代庖，不符合助手定位

---

## 🔧 核心代码实现

> 📌 记录本次协同所有重要的代码变更，后续回顾不用翻 git 历史

---

### 1. `types.ts` - ✨ 新增类型定义文件
> 解决类型定义分散的问题，统一管理页面所有类型，符合 5 文件拆分规范

```typescript
/**
 * 登录页面类型定义
 */
import type { LoginFormData } from './schema';

export type { LoginFormData };

/**
 * 登录 API 响应结果
 */
export interface LoginApiResponse {
  success: boolean;
  message?: string;
}
```

---

### 2. `handle.ts` - 🔧 修改：移除 Toast 副作用，保持纯函数
> 解决 handle.ts 不符合架构规范的问题，移除所有 UI 副作用，只保留纯函数

```typescript
/**
 * 处理忘记密码点击
 */
export const handleForgotPassword = (): void => {
  console.log('Navigate to forgot password page');
};

/**
 * Handle register click
 */
export const handleRegister = (): void => {
  console.log('Navigate to register page');
};

/**
 * Handle user agreement click
 */
export const handleUserAgreement = (): void => {
  console.log('Open user agreement page');
};

/**
 * Handle privacy policy click
 */
export const handlePrivacyPolicy = (): void => {
  console.log('Open privacy policy page');
};
```

---

### 3. `useStore.ts` - 🔧 修改：统一从 types.ts 导入类型
> 解决重复定义接口的问题，类型定义统一管理

```typescript
import { useLocalObservable } from 'mobx-react';
import { authApi } from '@/api';
import type { LoginFormData, LoginApiResponse } from './types';
import type { LoginResponse } from '@/api/auth';

export const useLoginStore = () => {
  const store = useLocalObservable<LoginStoreType>(() => ({
    isLoading: false,
    showPassword: false,

    setLoading(loading: boolean) {
      this.isLoading = loading;
    },

    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },

    async login(formData: LoginFormData) {
      this.isLoading = true;
      // ... 登录逻辑
    },
  }));

  return store;
};
```

---

### 4. `index.tsx` - 🔧 修改：useCallback 缓存回调函数
> 解决内联函数导致的不必要重渲染，保持函数引用稳定

```typescript
import React, { useCallback } from 'react';

// ===== 导航函数也缓存，保持引用稳定 =====
const goToRegister = useCallback(() => {
  navigate('/register');
}, [navigate]);

const goToForgotPassword = useCallback(() => {
  navigate('/forgot-password');
}, [navigate]);

// ===== 事件回调函数全部用 useCallback 缓存 =====
const handleForgotPasswordClick = useCallback((e: React.MouseEvent) => {
  e.preventDefault();
  handleForgotPassword();
  goToForgotPassword();
}, [goToForgotPassword, handleForgotPassword]);

const handleUserAgreementClick = useCallback((e: React.MouseEvent) => {
  e.preventDefault();
  handleUserAgreement();
  Toast.show({
    content: 'Open user agreement page',
    position: 'bottom',
  });
}, [handleUserAgreement]);

const handlePrivacyPolicyClick = useCallback((e: React.MouseEvent) => {
  e.preventDefault();
  handlePrivacyPolicy();
  Toast.show({
    content: 'Open privacy policy page',
    position: 'bottom',
  });
}, [handlePrivacyPolicy]);

const handleRegisterLinkClick = useCallback((e: React.MouseEvent) => {
  e.preventDefault();
  handleRegister();
  goToRegister();
}, [goToRegister, handleRegister]);
```

---

## ⚠️ 遇到的问题与解决方案

### 问题 1：lint-staged 只检查暂存文件，不是全部文件

**现象**：执行 `npm run lint` 显示 `No staged files found`，误以为代码没问题，但实际上新文件没有被检查

**根因分析**：
- 项目 `lint` 脚本配置的是 `lint-staged`，只检查 git 已暂存（staged）的文件
- 新创建的 types.ts 和未 git add 的修改文件都不会被检查
- 这是项目配置的陷阱，容易让人产生"检查通过"的错觉

**解决方案**：
```bash
# 不要只用 npm run lint，要直接用 eslint 检查指定目录
npx eslint apps/web/src/pages/Login --ext .ts,.tsx
```

**经验总结**：
- 执行任何 npm scripts 前，先看 `package.json` 中具体执行的是什么命令
- 不要想当然，"lint" 不一定是检查全部代码
- CI 环境的 lint 规则和本地可能也不一样

---

### 问题 2：Node 版本不兼容导致命令失败

**现象**：执行 eslint 时报错 `No such built-in module: node:stream/promises`

**根因分析**：
- `node:stream/promises` 是 Node 15+ 才支持的协议头语法
- 当前环境是 Node 14，缺少这个内置模块
- 项目依赖的新版本 eslint 只支持 Node 16+

**解决方案**：
- 切换到 Node 22 版本
- 建议项目在 package.json 中添加 engines 字段声明版本要求

**经验总结**：
- Node 版本问题是前端开发的常见坑
- 新项目尽量用 LTS 版本，不要追太新的版本
- 团队统一 Node 版本非常重要

---

### 问题 3：/save-ai 命令规范与实现不同步

**现象**：用户发现执行 /save-ai 只生成了教学文档，缺少模块文档和协同记录

**根因分析**：
- 原命令设计只侧重教学沉淀
- 没有明确规定必须生成哪些文档
- 缺少统一的目录管理规范

**解决方案**：
- 更新 /save-ai 命令规范
- 明确强制 3 文档要求
- 设计统一目录结构，序号前缀命名

**经验总结**：
- 命令规范要写得非常明确，不能有歧义
- "智能保存"要定义清楚保存什么内容
- 输出格式必须标准化，让用户有稳定预期

---

## 📌 代码审查要点

### ✅ 做得好的地方

1. **类型定义完整**：没有 any，所有参数和返回值都有明确类型
2. **useCallback 依赖正确**：所有外部引用的变量都正确列在依赖数组中
3. **遵循项目规范**：严格按照 5 文件拆分架构组织代码
4. **handle.ts 彻底纯函数**：没有任何副作用，只有 console.log

### ⚠️ 可以继续改进的地方

1. **useObserver 范围过大**：当前包裹整个 JSX，可以优化为顶层精确订阅
2. **缺少 AbortController**：登录请求没有取消机制，组件卸载时可能内存泄漏
3. **没有单元测试**：纯函数和 store 方法都可以补充测试

---

## 📚 后续建议与待办

### 🔨 建议继续优化

1. **优化 MobX 订阅粒度**：
   ```typescript
   // ❌ 当前：整个组件包裹
   return useObserver(() => <div>...</div>);

   // ✅ 建议：顶层解构，精确订阅
   const { isLoading, showPassword } = store;
   return <div>...</div>;
   ```

2. **添加请求取消机制**：
   ```typescript
   // useStore.ts 中添加 abortController
   async login(formData) {
     const controller = new AbortController();
     // ... 组件卸载时调用 controller.abort()
   }
   ```

3. **补充单元测试**：
   - handle.ts 纯函数测试
   - useStore 方法测试（初始状态、toggle 行为）

### 📋 待办事项

- [ ] 将本次优化模式推广到其他页面
- [ ] 补充 /save-ai 命令的自动实现逻辑
- [ ] 考虑添加 ESLint 规则，自动检查 handle.ts 是否有副作用

---

*本文档由 `/save-ai` 命令自动生成*
