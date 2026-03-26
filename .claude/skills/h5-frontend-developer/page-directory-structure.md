# H5 页面目录结构规范

## 📁 标准目录结构

```
src/pages/[PageName]/
├── index.tsx                    # 页面主入口（只做组件组合）
├── index.module.scss           # 仅页面最外层容器样式
├── types.ts                     # 跨组件共享的数据类型定义
├── constant.ts                  # 常量配置聚合导出（仅非展示性常量）
├── schema.ts                    # (可选) Zod 表单验证 Schema（仅含表单页面需要）
├── mock.ts                      # Mock 数据 / 静态业务数据
├── useStore.ts                  # 页面级 MobX 局部状态（useLocalObservable）
└── components/                 # 页面内子组件目录
    ├── index.ts                # 统一聚合导出所有子组件
    ├── shared.tsx / icons.tsx  # (可选) 多个子组件共享的工具/图标
    ├── ComponentName/          # 每个子组件独立文件夹（高内聚）
    │   ├── index.tsx           # 组件代码
    │   └── index.module.scss   # 组件私有样式
    ├── AnotherComponent/
    │   ├── index.tsx
    │   └── index.module.scss
    ...
```

---

## 🎯 设计原则：单一职责 + 高内聚低耦合

| 文件 | 唯一职责 | 不该做什么 |
|------|----------|------------|
| `index.tsx` | 导入组件 → 组合布局 → 处理页面级事件 | 不写大量内联样式/HTML |
| `index.module.scss` | 页面根容器样式（背景、间距、最大宽度） | 不放各个子组件的样式 |
| `types.ts` | 集中定义**跨组件共享**的数据结构 | 组件私有 Props 不要放这里 |
| `constant.ts` | 聚合导出**非展示性**常量、枚举、配置项 | **禁止存放页面展示文案**，展示文案直接写在 JSX |
| `schema.ts` | Zod 表单验证 Schema 定义 + 类型派生 | 没有表单验证的页面不要创建此文件 |
| `mock.ts` | 存放 Mock 数据 / 静态业务数据 | 开发环境真实接口对接后可移除 |
| `useStore.ts` | MobX 管理页面局部状态 | 不需要全局状态时才用这个 |
| `components/` | 存放拆分后的功能区块组件 | 不放非组件文件 |

---

## 📝 每个文件详细规范

### 1. index.tsx - 页面主入口

```tsx
/**
 * 页面名称
 * @description 页面功能描述
 */
import React from 'react';
import { useObserver } from 'mobx-react';
import styles from './index.module.scss';
import usePageStore from './useStore';
import { ComponentA, ComponentB } from './components';

/**
 * 页面主组件
 */
const PageName: React.FC = () => {
  const store = usePageStore();

  const handleItemClick = (id: string): void => {
    // 页面级事件处理
    console.log('Item clicked:', id);
  };

  return useObserver(() => (
    <div className={styles.container}>
      <ComponentA title={store.title} />
      <ComponentB data={store.list} onItemClick={handleItemClick} />
    </div>
  ));
};

PageName.displayName = 'PageName';

export default PageName;
```

**要点：**
- ✅ 必须加 `displayName`，方便 React DevTools 调试
- ✅ `useObserver` 包裹返回内容（MobX Hook 写法规范）
- ✅ 只做组合，不写大量 JSX

---

### 2. index.module.scss - 页面容器样式

```scss
.container {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: calc(env(safe-area-inset-bottom));
  max-width: 750px; // H5 设计稿 750px，居中
  margin: 0 auto;
}
```

**要点：**
- ✅ 只放页面根容器的样式
- ✅ 所有子组件样式放在各组件自己文件夹内
- ✅ 符合 750px 设计稿自动转 vw 项目规范

---

### 3. components/ComponentName/ - 子组件

**结构：**
```
components/Header/
├── index.tsx
└── index.module.scss
```

**index.tsx：**
```tsx
import React from 'react';
import styles from './index.module.scss';

interface HeaderProps {
  appName: string;
  version: string;
}

const Header: React.FC<HeaderProps> = ({ appName, version }) => {
  return (
    <div className={styles.headerContainer}>
      <div className={styles.logoWrapper}>
        {/* ... */}
      </div>
      <h1 className={styles.appName}>{appName}</h1>
      <div className={styles.version}>{version}</div>
    </div>
  );
};

Header.displayName = 'Header';

export default Header;
```

**index.module.scss：**
```scss
// 根容器：组件名 + Container → 调试时一目了然
.headerContainer {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 80px 40px 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #fff;
}

.logoWrapper {
  width: 160px;
  height: 160px;
  // ...
}

.logo {
  width: 100px;
  height: 100px;
  color: #fff;
}
```

**要点：**
- ✅ **根容器命名**：`componentNameContainer`（组件名前缀方案），调试快速定位
- ✅ **SCSS 类名**：kebab-case（如 `.logo-wrapper`），TS 自动转 camelCase
- ✅ **Props 类型**：在组件文件内定义 `ComponentNameProps`
- ✅ **displayName**：必须加
- ✅ **默认导出**：`export default ComponentName`

---

### 4. components/index.ts - 统一导出

```typescript
// 聚合导出所有子组件，方便页面导入
export { default as Header } from './Header';
export { default as Description } from './Description';
export { default as Features } from './Features';
export { default as Links } from './Links';
export { default as Footer } from './Footer';
```

**要点：**
- ✅ 页面中导入简洁：`import { Header, Description } from './components'`
- ✅ 不用每个组件都从深层路径导入

---

### 5. types.ts - 跨组件共享类型

```typescript
/**
 * 页面数据类型定义
 */

/**
 * 功能项数据结构
 */
export interface Feature {
  id: string;
  title: string;
  description: string;
  iconKey: IconKey;
}

/**
 * 链接项数据结构
 */
export interface Link {
  id: string;
  title: string;
  iconKey: IconKey;
}

/**
 * 图标 Key 联合类型（严格约束）
 */
export type IconKey =
  | 'discover'
  | 'recommend'
  | 'bookmark'
  | 'theme';
```

**要点：**
- ✅ 只有**跨多个组件共享**的数据类型才放这里
- ✅ 组件私有 `Props` 放在组件自己文件内
- ✅ 使用 PascalCase 命名接口

---

### 6. mock.ts - 静态 / Mock 数据

```typescript
/**
 * 页面 Mock 数据
 */

import type { Feature, Link, AppInfo } from './types';

// ==================== 分段注释，清晰分隔 ====================

export const FEATURES: Feature[] = [
  {
    id: 'feature-1',
    title: '发现优质内容',
    description: '精选各类优质文章...',
    iconKey: 'discover',
  },
];

export const LINKS: Link[] = [/* ... */];
export const APP_INFO: AppInfo = { /* ... */ };
```

**要点：**
- ✅ 按数据类别分段，用注释分隔
- ✅ 数据加上正确类型标注
- ✅ 对接真实 API 后可以删除或保留作为兜底

---

### 7. constant.ts - 常量配置

```typescript
/**
 * 页面常量定义
 * 仅存放非展示性常量、枚举、配置项
 * 页面展示文案请直接写在 JSX 中
 */

/** 列表请求每页条数 */
export const PAGE_SIZE = 10;

/** 登录状态枚举 */
export type LoginStatus = 'idle' | 'loading' | 'success' | 'error';

/** 最大密码长度限制 */
export const MAX_PASSWORD_LENGTH = 20;
```

**要点：**
- ✅ 只存放**非展示性常量、枚举、配置项**（如分页大小、状态枚举、长度限制、API 路径等）
- ❌ **禁止存放页面展示文案**（按钮文字、placeholder、标题等直接写在 JSX 中）
- ✅ 只有当多个组件共享同一个常量时，才需要抽取到这里
- ✅ 保持和 `mock.ts` 分离，职责清晰

---

### 8. schema.ts - Zod 表单验证 Schema

```typescript
/**
 * 登录表单 Zod 验证 Schema
 */
import { z } from 'zod';

/** 登录表单验证 Schema */
export const loginSchema = z.object({
  account: z
    .string()
    .min(1, '请输入手机号/用户名')
    .max(30, '账号长度不能超过30个字符'),
  password: z
    .string()
    .min(6, '密码长度不能少于6位')
    .max(20, '密码长度不能超过20位'),
  agreeTerms: z
    .literal(true, {
      errorMap: () => ({ message: '请同意用户协议和隐私政策' }),
    }),
});

/** 登录表单数据类型（从 Zod Schema 派生） */
export type LoginFormData = z.infer<typeof loginSchema>;
```

**要点：**
- ✅ **仅用于** Zod 表单验证 Schema 定义
- ✅ 使用 `z.infer` 派生 TypeScript 类型，避免重复定义
- ✅ 一个页面多个表单可以在同一个 `schema.ts` 中定义多个 Schema
- ✅ 只有包含表单验证的页面才需要创建此文件
- ❌ 没有表单验证的页面不要创建此文件
- ❌ 不要把非 Schema 类型定义放在这里，普通类型请放在 `types.ts`

---

### 9. useStore.ts - MobX 局部状态

```typescript
import { useLocalObservable } from 'mobx-react';
import { FEATURES, APP_INFO } from './mock';
import type { Feature, Link } from './types';

/**
 * Store 接口定义
 */
export interface PageStoreType {
  appName: string;
  version: string;
  description: string;
  features: Feature[];
  links: Link[];
}

type UsePageStoreType = () => PageStoreType;

const usePageStore: UsePageStoreType = () => {
  const store = useLocalObservable<PageStoreType>(() => ({
    appName: APP_INFO.name,
    version: APP_INFO.version,
    description: APP_INFO.description,
    features: FEATURES,
    links: LINKS,
  }));

  return store;
};

export default usePageStore;
```

**要点：**
- ✅ 使用 `useLocalObservable`（MobX Hook 写法）
- ✅ 禁止使用 observer HOC，必须用 `useObserver`
- ✅ 页面局部状态，不需要放到全局 Store

---

## 📋 检查清单（新建页面时对照）

- [ ] `index.tsx` 页面入口，只做组件组合
- [ ] `index.module.scss` 仅页面容器样式
- [ ] `types.ts` 存放跨组件共享数据类型
- [ ] `mock.ts` 存放 Mock/静态数据
- [ ] `constant.ts` 聚合导出常量
- [ ] `schema.ts` 有表单验证时才创建，存放 Zod Schema（无表单则不需要）
- [ ] `useStore.ts` MobX 局部状态
- [ ] `components/index.ts` 统一导出子组件
- [ ] 每个子组件 `ComponentName/index.tsx` + `index.module.scss`
- [ ] 子组件根容器类名：`componentNameContainer`
- [ ] 每个组件都添加了 `displayName`
- [ ] Props 类型在组件文件内定义（不放到 `types.ts`）
- [ ] 共享工具放在 `components/shared.tsx`
- [ ] `npx tsc --noEmit` 通过
- [ ] `npm run lint` 通过

---

## ✅ 优点总结

| 优点 | 说明 |
|------|------|
| **组件自治** | 每个组件包含自己的逻辑和样式，不依赖外部 |
| **快速定位** | 类名带组件前缀，调试一秒找到对应代码 |
| **易于维护** | 修改哪个组件就进哪个文件夹，不用在大文件搜索 |
| **可移植性** | 需要复用组件直接复制整个文件夹带走 |
| **可扩展** | 新增组件不影响现有结构，不会让单个文件膨胀 |
| **符合规范** | 和 `src/components/` 公共组织结构一致，统一风格 |
| **类型安全** | 完整 TypeScript 类型标注，哪里用哪里定义 |

---

## ❌ 不推荐做法

| 做法 | 问题 |
|------|------|
| 所有组件平级放 `components/` 共享一个样式文件 | 样式耦合，文件越来越臃肿 |
| 所有样式都放页面 `index.module.scss` | 样式文件巨大，难以维护 |
| 所有类型都放 `types.ts` 包括组件 Props | 修改组件需要跳文件，代码分散 |
| 多个组件挤在一个 `.tsx` 文件 | 文件太大，代码难读 |

---

## 🎯 适用场景

✅ **推荐使用这个模板：**
- 页面代码超过 100 行
- 页面可以按功能区块拆分
- 需要长期维护的项目

❌ **不需要这么复杂：**
- 极简单页（< 50 行代码）
