# React 第三方工具库使用规范

本文档定义项目中常用 React 生态第三方库的选型原则、使用规范和最佳实践，保持代码一致性，避免常见坑点。

---

## 选型原则

1. **优先成熟方案**: 选择维护活跃、社区接受度高的库，不盲目尝试未成熟的新项目
2. **移动端体积敏感**: 优先选择轻量级方案，关注包体积对首屏加载的影响
3. **Tree-shaking 友好**: 优先支持 ES 模块导出，便于按需加载减小打包体积
4. **TypeScript 原生支持**: 优先选择内置类型声明的库，减少 `@types/xxx` 依赖
5. **不重复造轮子**: 已有库能满足需求的情况下，不自行实现相同功能

---

## 各库使用规范

### 1. react-hook-form + @hookform/resolvers (表单处理)

**使用场景**: 任何表单处理场景，复杂表单尤其推荐。

**基本规则**:
- ✅ 推荐使用非受控模式 (`register`)，减少不必要的 re-render，性能更好
- ✅ 配合 **Zod** 做 schema 校验，从 schema derive TypeScript 类型，保证前后一致
- ✅ 表单状态由 react-hook-form 自己管理，不推荐同步到 MobX store（除非需要跨组件共享）
- ✅ 使用 `resolver: zodResolver(schema)` 集成 Zod 校验
- ❌ 不推荐使用 antd-mobile Form 封装（嵌套太深，性能较差）

**示例代码**:
```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// 1. 定义校验 schema
const loginSchema = z.object({
  mobile: z.string().length(11, '请输入11位手机号'),
  password: z.string().min(6, '密码至少6位'),
});

// 2. derive TypeScript 类型
export type LoginFormData = z.infer<typeof loginSchema>;

// 3. 使用
const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
  resolver: zodResolver(loginSchema),
  defaultValues: {
    mobile: '',
    password: '',
  },
});
```

**常见坑点**:
- `defaultValues` 需要一次性提供所有字段默认值，动态新增字段需要特殊处理
- 依赖 `@hookform/resolvers` 来集成 Zod，不要忘记安装

---

### 2. react-use (Hooks 工具集)

**使用场景**: 需要常用 Hooks 工具，避免自己重复实现。

**基本规则**:
- ✅ 只导入需要的 Hook: `import useDebounce from 'react-use/lib/useDebounce';`
- ✅ 优先使用 react-use 提供的成熟实现
- ❌ 禁止整体导入 `import { useDebounce } from 'react-use';`（不利于 tree-shaking）
- ❌ 项目 `src/hooks/` 已有的实现，不重复引入 react-use 版本

**推荐常用 Hooks**:
- `useDebounce` - 防抖
- `useLocalStorage` - 本地存储状态同步
- `useClickAway` - 点击外部区域检测（下拉框、弹框常用）
- `useWindowSize` - 监听窗口尺寸变化
- `useUpdateEffect` - 跳过首次的 effect

---

### 3. react-router-dom (路由管理)

**使用场景**: 项目全局路由管理。

**基本规则**:
- ✅ 使用 v6 新 API: `createBrowserRouter` + `RouterProvider`
- ✅ 路由配置统一放在 `src/routes/` 目录
- ✅ 使用 `useNavigate()` 代替旧的 `useHistory()`
- ✅ 动态路由参数使用 `useParams()` 获取
- ✅ 路由懒加载使用 `lazy()` + `Suspense`

---

### 4. react-activation + react-freeze (路由缓存 & 性能优化)

**使用场景**: 需要保留页面滚动位置和组件状态（列表页返回详情页再返回）。

**基本规则**:
- ✅ 只缓存不常变动的列表页面
- ✅ 配合 `react-freeze` 冻结不活跃页面，减少不必要 re-render
- ❌ 避免缓存过多页面，增加移动端内存占用
- **常见坑点**: 缓存页面的 `useEffect` 不会每次激活都执行，需要用 `useActivate` 生命周期

---

### 5. motion / react-spring (动画)

**使用场景**: 需要流畅的手势动画、过渡动画。

**选型建议**:
- 简单的 enter/leave 过渡 → **motion** (更简洁)
- 需要物理弹簧效果 → **react-spring**

**基本规则**:
- ✅ 移动端启用硬件加速
- ❌ 避免同时触发过多动画，影响性能

---

### 6. react-error-boundary (错误边界)

**使用场景**: 全局错误兜底，局部模块错误隔离。

**基本规则**:
- ✅ 根组件已经包裹全局错误边界，无需重复配置
- ✅ 动态加载模块可以额外嵌套错误边界隔离
- ✅ 使用项目内置 `ErrorFallback` 组件

---

### 7. dayjs (日期处理)

**使用场景**: 所有日期格式化、计算。

**基本规则**:
- ✅ 全部使用 dayjs，不使用 `Date` 原生方法手动处理
- ✅ 按需导入插件，保持体积最小

---

### 8. zod (数据校验)

**使用场景**: API 响应校验、表单校验、运行时类型检查，防御性编程。

**基本规则**:
- ✅ 先定义 schema，再 derive TypeScript 类型，保证前后一致
- ✅ API 层对关键响应数据做校验，防御后端数据结构变化
- ✅ 可复用的 schema 放在对应模块的 `schemas.ts` 文件中
- ✅ 对可能为 `null`/`undefined` 的字段，在 schema 中显式声明

**示例代码**:
```typescript
// src/api/user/schemas.ts
import { z } from 'zod';

export const userSchema = z.object({
  id: z.string(),
  nickname: z.string(),
  avatar: z.string().nullable(), // 允许 null
  bio: z.string().optional(),   // 可选字段
});

export type User = z.infer<typeof userSchema>;
```

---

### 9. es-toolkit (工具函数)

**使用场景**: 常用工具函数（防抖、节流、深拷贝等）。

**基本规则**:
- ✅ 优先使用 es-toolkit，代替 lodash
- ✅ 直接导入需要的函数: `import { debounce } from 'es-toolkit';`
- ✅ es-toolkit 天然支持 tree-shaking，打包只包含使用的函数
- ❌ 简单工具函数（一两行能搞定）不要为了用库而用库

**对比**:
| 库 | 体积 | Tree-shaking | 推荐度 |
|----|------|--------------|--------|
| es-toolkit | 小巧 | ✅ 优秀 | ⭐ 推荐 |
| lodash | 较大 | ❌ 一般 | 不推荐 |

---

### 10. classnames (className 拼接)

**使用场景**: 动态拼接多个 className。

**基本规则**:
- ✅ 所有动态拼接场景都使用 classnames
- ❌ 不手动字符串拼接，代码更整洁

**示例代码**:
```typescript
import classNames from 'classnames';

<div className={classNames(styles.button, styles.primary, disabled && styles.disabled)} />
```

---

### 11. 其他常用工具

| 库 | 使用场景 | 要点 |
|------|----------|------|
| `axios` | HTTP 请求 | 已经在 `src/api/axios-instance.ts` 配置好拦截器，直接使用 |
| `localforage` | 大体积本地存储 | 异步存储，替代 localStorage 存大数据 |
| `qrcode` | 生成二维码 | 需要分享二维码海报时使用 |
| `html2canvas` | HTML 转 Canvas | 生成分享海报图使用 |
| `compressorjs` | 图片压缩 | 上传图片前前端压缩，减少上传大小 |
| `uuid` | 生成唯一 ID | 需要随机唯一标识时使用 |

---

## 新增第三方库审批流程

引入新的第三方库之前，请评估:

1. **是否真的需要**: 现有代码或已有库能否满足？
2. **包体积大小**: 检查 `bundlephobia.com` 看看体积，移动端优先选择轻量方案
3. **维护状态**: 是否维护活跃，issue 多不多？
4. **类型支持**: 是否内置 TypeScript 支持？
5. **是否重复**: 已有功能相似的库吗？

---

## 检查清单

- [ ] 是否遵循了该库推荐的最佳实践？
- [ ] 是否按需导入，避免整体打包？
- [ ] 是否为使用的库添加了必要的类型声明？
- [ ] 是否避免了重复引入功能相似的库？
- [ ] 是否评估了新增库对包体积的影响？
