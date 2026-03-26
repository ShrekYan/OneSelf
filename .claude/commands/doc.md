# 文档生成规则

本文档定义了组件和模块的文档生成规范，确保代码可读性和可维护性。

## 文档类型

| 文档类型 | 位置 | 适用场景 |
|----------|------|----------|
| 组件文档 | `src/components/ComponentName/README.md` | 公共可复用组件 |
| 页面文档 | `src/pages/PageName/README.md` | 复杂业务页面 |
| API/Hook | JSDoc 注释在代码中 | API 接口、自定义 Hook |

---

## 公共组件 README 模板

每个公共可复用组件必须包含 `README.md`，位于组件目录下：

```
src/components/
└── CountDown/
    ├── index.tsx
    ├── index.module.scss
    ├── __tests__/
    └── README.md
```

```markdown
# ComponentName 组件

一句话介绍组件的用途。

## 引入方式

```tsx
import ComponentName from '@/components/ComponentName';
```

## Props 参数说明

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `propName` | `Type` | ✅/❌ | `-` | 参数描述 |

## 使用示例

```tsx
<ComponentName />
```

## 注意事项

- 特殊使用场景需要注意的问题
- 移动端适配相关事项
- 依赖项或兼容性说明

## 相关组件

- [xxx](../xxx/README.md) - 相关关联组件链接
```

---

## 代码注释规范

### JSDoc 快速参考

| 代码元素 | 规范要求 |
|----------|---------|
| **接口/类型** | 每个导出接口必须添加注释，每个字段说明含义 |
| **组件函数** | 一句话说明组件用途，带 Props 的组件需要示例 |
| **自定义 Hook** | 说明用途，标注参数和返回值，建议提供示例 |
| **工具函数** | 说明用途，标注每个参数和返回值 |
| **MobX Store** | 类说明整体用途，每个字段和方法说明作用 |

### JSX 注释规范

- ✅ 使用 `{/* 区块说明 */}` 格式，前后保留空格
- ✅ 对分块结构（头部、列表、底部）添加说明
- ✅ 复杂条件渲染说明判断条件
- ❌ 不要使用 `//` 或 `/* ... */` 在 JSX 中

### 何时需要注释

✅ **需要添加注释：**
- 复杂业务逻辑：说明**为什么**这么做
- 处理边界特殊情况：说明处理了什么情况
- Hack 或 workaround：说明原因
- 复杂算法：说明思路

❌ **不需要添加注释：**
- 显而易见的简单代码
- 好的命名本身就是文档

---

## 页面模块文档（仅复杂页面需要）

页面业务逻辑复杂时，添加 `README.md` 说明：

```markdown
# PageName 页面

页面功能一句话描述。

## 业务流程

1. 用户进入页面，加载 XXX 数据
2. 用户操作 YYY，触发 ZZZ 逻辑
3. ...

## 数据流向

- API 接口: `xxx`, `yyy`
- 状态管理: `xxxStore`
- 页面跳转: `→ /pageA`, `→ /pageB`

## 特殊业务规则

- 列出特殊的业务规则说明
- 特殊交互或依赖说明
```

---

## API 文档规范

API 文档通过 TypeScript 类型 + JSDoc 注释实现，不需要单独 README：

```typescript
// types.ts
/** 用户信息 */
export interface UserInfo {
  /** 用户ID */
  id: string;
  /** 用户昵称 */
  nickname: string;
  /** 用户头像URL */
  avatar: string;
}

/** 登录请求参数 */
export interface LoginRequest {
  /** 手机号 */
  phone: string;
  /** 验证码 */
  code: string;
}

// index.ts
/** 手机号验证码登录 */
export async function login(params: LoginRequest): Promise<LoginResponse> {
  return await api.post('/auth/login', params);
}
```

---

## 文档编写原则

1. **受众明确**：组件文档给使用者看，页面文档给维护者看，注释给队友看
2. **不写废话**：不要重复代码已经说清楚的内容
3. **示例简洁**：示例代码应该是最简可运行版本，复制就能用
4. **保持同步**：修改代码后必须同步更新文档

---

## 统一检查清单

| 检查项 | 组件 | 页面 | API | JSX |
|--------|:----:|:----:|:---:|:---:|
| 是否有一句话功能描述 | ✅ | ✅ | - | - |
| Props/参数是否完整说明 | ✅ | - | ✅ | - |
| 是否提供了可运行的使用示例 | ✅ | - | - | - |
| 是否说明了需要注意的特殊情况 | ✅ | ✅ | - | - |
| 复杂逻辑是否有说明 | - | ✅ | - | ✅ |
| 是否删除了过时的注释 | - | - | ✅ | ✅ |
| 是否没有多余的废话注释 | - | - | ✅ | ✅ |
