# 超大型移动端 H5 应用架构设计方案

针对超大型（千+页面、十人+团队）移动端 H5 应用，在现有技术栈基础上，推荐采用**"模块化分层 + 按业务域垂直拆分"**架构方案。

---

## 一、问题分析：超大型项目的痛点

| 问题 | 影响 |
|------|------|
| 代码量巨大 | 打包变慢，启动开发服务器慢 |
| 多人协作 | 合并冲突多，模块依赖混乱 |
| 首屏加载 | 包体积太大，加载慢影响体验 |
| 新人上手 | 找不到代码在哪，理解成本高 |
| 依赖管理 | 循环依赖、不合理依赖难以发现 |

---

## 二、架构方案：模块化分层架构

### 总体原则

**"按业务域垂直拆分，公共能力水平分层"**

```
├── packages/               # 共享包（独立版本管理）
│   ├── ui-components/      # 公共业务组件库
│   ├── hooks/              # 通用 Hooks
│   ├── utils/              # 通用工具函数
│   ├── types/              # 共享类型定义
│   ├── constants/          # 全局常量
│   └── theme/              # 主题样式/设计令牌
├── src/
│   ├── core/               # 应用核心层（整个应用只一份）
│   │   ├── bootstrap/      # 应用启动初始化
│   │   ├── store/          # 全局状态（用户、app、auth）
│   │   ├── router/         # 路由配置入口
│   │   ├── interceptors/   # axios 拦截器
│   │   └── providers/      # React Context 提供者
│   ├── features/           # 业务特性层（按业务域拆分）
│   │   ├── auth/           # 认证模块（登录/注册/忘记密码）
│   │   ├── user/           # 用户个人中心
│   │   ├── product/        # 商品模块（列表/详情/搜索）
│   │   ├── order/          # 订单模块
│   │   ├── cart/           # 购物车
│   │   ├── pay/            # 支付模块
│   │   └── ...             # 其他业务域
│   ├── shared/             # 项目内共享（不发布到npm）
│   │   ├── components/     # 项目内通用业务组件
│   │   └── utils/          # 项目内通用工具
│   ├── App.tsx
│   └── main.tsx
└── scripts/               # 自动化脚本
```

---

### 1. 代码组织：从"技术分层" → "业务分层"

#### ❌ 现状（适合中小型项目）
```
src/
├── pages/          # 所有页面堆在一起
│   ├── Home/
│   ├── Login/
│   ├── ProductList/
│   ├── ProductDetail/
│   ├── OrderList/
│   ├── OrderDetail/
│   └── ...
├── components/     # 所有公共组件堆在一起
└── store/          # 全局状态
```

**问题**: 业务变大后，`pages/` 会有上百个目录，找起来很困难，跨业务代码复用不方便。

#### ✅ 推荐方案（超大型项目）
```
src/features/
├── auth/                     # 认证业务域
│   ├── components/           # 模块内私有组件
│   ├── pages/                # 模块内页面
│   │   ├── login/            # 登录页
│   │   ├── register/         # 注册页
│   │   └── forgot-password/  # 忘记密码
│   ├── store/                # 模块局部状态
│   ├── constant.ts           # 模块常量
│   ├── types.ts              # 模块类型定义
│   └── index.ts              # 模块出口（导出可供其他模块用的内容）
├── product/                  # 商品业务域
│   ├── components/
│   ├── pages/
│   │   ├── list/
│   │   ├── detail/
│   │   └── search/
│   ├── store/
│   ├── api.ts
│   ├── types.ts
│   └── index.ts
├── order/                    # 订单业务域
│   └── ...
└── ...
```

**优势**:
- 同业务域的代码放在一起，找代码方便
- 一个人/团队负责一个业务域，协作冲突少
- 模块可以独立测试、独立构建
- 按需加载，只加载当前访问业务域的代码

---

### 2. 代码分割：按需加载，减小首屏包体积

#### 路由层面：按业务域懒加载

```tsx
// src/core/router/index.tsx
import { createBrowserRouter, lazy } from 'react-router-dom';

// ✅ 每个业务域懒加载
const Auth = lazy(() => import('@/features/auth'));
const Product = lazy(() => import('@/features/product'));
const Order = lazy(() => import('@/features/order'));

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/auth/*',
    element: (
      <Suspense fallback={<PageLoading />}>
        <Auth />
      </Suspense>
    ),
  },
  // ...
]);
```

#### 打包优化：Splitting 策略

```typescript
// vite.config.ts
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        // 第三方库基础包单独拆分
        'react-vendor': ['react', 'react-dom', 'react-router-dom'],
        'mobx-vendor': ['mobx', 'mobx-react'],
        'antd-mobile': ['antd-mobile'],
        // 把共享包也单独拆分
        'shared': ['@/packages/ui-components'],
      },
    },
  },
}
```

**预期效果**:
- 首屏包体积: `react-vendor + antd-mobile + 当前页面代码` ≈ 150-200KB gzip
- 访问其他页面才加载对应业务代码
- 浏览器缓存稳定，第三方包不经常变，缓存命中率高

---

### 3. 状态管理架构：分层状态管理

#### 状态分类管理

| 状态类型 | 放哪里 | 示例 |
|----------|--------|------|
| **全局共享状态** | `src/core/store/` 全局 Store | 用户信息、token、app主题、网络配置 |
| **业务模块状态** | 模块内 `store/` 局部 Store | 商品筛选条件、购物车状态、订单查询条件 |
| **页面状态** | 页面内 `useStore.ts` (useLocalObservable) | 表单加载状态、页面局部数据 |
| **组件状态** | 组件内部 useState/localObservable | 弹窗展开收起、tabs 激活项 |

#### 原则:
> **"能局部不全局，能页面不模块"**

#### 避免:
- ❌ 把所有状态都扔到全局 store
- ❌ 跨模块直接修改另一个模块的状态
- ✅ 通过调用 API 或 事件 通信

---

### 4. API 架构：按业务模块拆分

保持现有规范，但放入对应业务模块：

```
src/features/product/
├── api.ts          # 商品模块所有 API
├── types.ts        # 商品模块类型定义
└── index.ts
```

**优势**:
- 找 API 直接去对应业务模块找
- 只加载当前业务模块 API 代码
- 一个业务域的 API 不会散落在各处

---

### 5. 共享组件：Monorepo 结构管理公共组件

如果项目很大，公共组件很多，推荐使用 **Monorepo** 把公共包放到 `packages/` 目录：

```
packages/
├── ui-components/
│   ├── src/
│   │   ├── Avatar/
│   │   ├── ProductCard/
│   │   ├── PriceTag/
│   │   └── ...
│   └── package.json
├── hooks/
│   ├── src/
│   │   ├── use-pagination.ts
│   │   ├── use-search.ts
│   │   └── ...
│   └── package.json
└── theme/
    ├── variables.scss
    ├── tokens.scss
    └── package.json
```

**配置 pnpm workspaces**:
```yaml
# pnpm-workspace.yaml
packages:
  - packages/*
```

**优势**:
- 公共包可以独立版本管理
- 可以在多个项目之间共享
- 独立测试公共组件
- 不需要发布到 npm，本项目内使用

---

### 6. 构建性能优化

#### 开发体验优化

```typescript
// vite.config.ts
export default defineConfig({
  // 1. 依赖预构建 - 把第三方库提前构建好
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'mobx', 'mobx-react', 'antd-mobile'],
  },
  // 2. 缓存优化
  cacheDir: 'node_modules/.vite',
  // 3. 只构建当前开发的模块
  server: {
    watch: {
      // 忽略不怎么修改的目录
      ignored: ['**/packages/**/node_modules/**'],
    },
  },
});
```

#### 持续集成优化

- 只检查修改的文件（lint-staged 已经做到）
- 类型检查可以并行
- 构建使用缓存

---

### 7. 类型系统优化

```
packages/types/
├── user.ts          # 用户共享类型
├── product.ts       # 商品共享类型
├── order.ts         # 订单共享类型
└── index.ts         # 统一导出
```

**规则**:
- 如果类型需要跨多个业务模块使用，放到 `packages/types/`
- 如果只在一个模块内使用，留在模块内
- 避免循环依赖：A 引用 B，B 引用 A → 把共用类型提到上层

---

### 8. 权限路由设计

超大型项目通常有不同角色（用户/商家/管理员），推荐:

```
src/features/
├── user/           # C端用户业务
└── merchant/       # B端商家业务（独立拆分）
```

路由层面根据角色加载对应模块：

```tsx
const UserApp = lazy(() => import('@/features/user'));
const MerchantApp = lazy(() => import('@/features/merchant'));

// 根据用户角色渲染对应应用
function Root() {
  const { userRole } = useAppStore();
  return userRole === 'merchant' ? <MerchantApp /> : <UserApp />;
}
```

---

## 三、对比现有架构变化总结

| 方面 | 现有的中小型方案 | 超大型推荐方案 |
|------|------------------|----------------|
| 代码组织 | `src/pages/` + `src/components/` 按技术分层 | `src/features/` 按业务域垂直分层 |
| 代码分割 | 页面级别分割 | 业务域级别懒加载 + 手动分块vendor |
| 状态管理 | 全局store + 页面局部 | 分层状态管理：全局/模块/页面/组件 |
| 公共组件 | `src/components/` | `packages/` Monorepo 独立管理 |
| API 组织 | `src/api/` 统一放 | 按业务模块放到 `features/[module]/api.ts` |
| 类型定义 | `src/types/` 全局放 | 共享放 packages，模块私有放模块内 |

---

## 四、协作流程建议

1. **按业务域分工** - 一个开发/小组负责一个或多个完整业务域
2. **独立开发测试** - 一个业务域的修改不影响其他业务域
3. **CI 只检查修改文件** - lint-staged 已经配置，保持这个习惯
4. **类型检查** - 利用 TypeScript 编译检查提前发现问题
5. **代码评审** - 跨业务依赖需要评审，保证接口稳定

---

## 五、什么时候需要这个方案？

| 项目规模 | 推荐方案 |
|----------|----------|
| 中小型（< 30页面，< 5人） | 保持现有结构足够用 |
| 大型（30-100页面，5-10人） | 可以开始按业务域拆分 features |
| 超大型（> 100页面，> 10人） | 完整采用本方案 + Monorepo |

---

## 六、迁移建议

如果当前项目已经是中小型，未来要变大，可以**渐进式迁移**:

1. **第一步**：新增功能按新的 `features/` 业务域结构开发
2. **第二步**：逐步把老业务模块迁移到 `features/`
3. **第三步**：稳定后把公共组件抽到 `packages/`
4. **第四步**：优化打包分割配置

不需要一次性重构，渐进迁移就可以。

---

## 总结

核心思想就是**"分而治之"**:

- **垂直拆分** - 按业务域拆分代码，一个业务域内聚在一起
- **水平分层** - 核心层、业务层、共享层，职责清晰
- **按需加载** - 访问哪个业务才加载哪个业务代码
- **渐进迁移** - 不需要一次性重构，逐步演进

这个方案完全兼容你现在使用的技术栈（React 19 + TypeScript + MobX + Vite），只需要调整目录组织方式，不需要换技术栈。
