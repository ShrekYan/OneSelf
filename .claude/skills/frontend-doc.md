# 文档生成规则

本文档定义了组件和模块的文档生成规范，确保代码可读性和可维护性，给 AI 执行提供清晰指引。

---

## 文档类型定位

| 文档类型 | 存放位置 | 适用场景 |
|----------|----------|----------|
| 组件文档 | `src/components/ComponentName/README.md` | **公共可复用组件必须写** |
| 页面文档 | `src/pages/PageName/README.md` | **仅复杂业务页面需要**，简单页面不用写 |
| API/Hook | JSDoc 注释写在代码中 | 所有导出的 API 接口、自定义 Hook、工具函数 |

---

## 公共组件 README 模板

**每个公共可复用组件必须包含 `README.md`**，位于组件目录下：

```
src/components/
└── CountDown/
    ├── index.tsx
    ├── index.module.scss
    ├── __tests__/          # 可选，单元测试
    └── README.md           # 必填，组件文档
```

### 模板内容必须包含以下章节：

```markdown
# ComponentName 组件

一句话清晰介绍组件的用途。

## 引入方式

\`\`\`tsx
import ComponentName from '@/components/ComponentName';
\`\`\`

## Props 参数说明

| 参数名 | 类型 | 必填 | 默认值 | 说明 |
|--------|------|------|--------|------|
| `propName` | `Type` | ✅/❌ | `-` | 参数作用描述 |

## 使用示例

\`\`\`tsx
<ComponentName />
\`\`\`

**要求示例是最简可运行版本**，复制粘贴就能用。

## 注意事项

列出需要注意的问题：
- 特殊使用场景限制
- 移动端适配注意事项
- 依赖项或兼容性说明
- 边界情况处理
```

---

## 代码注释规范

### JSDoc 快速参考

| 代码元素 | 规范要求 |
|----------|---------|
| **接口/类型** | 每个导出接口必须添加注释，**每个字段都要说明含义** |
| **组件函数** | 一句话说明组件用途，复杂组件需要示例 |
| **自定义 Hook** | 说明用途，标注每个参数和返回值，建议提供使用示例 |
| **工具函数** | 说明用途，标注每个参数和返回值类型 |
| **MobX Store** | 类说明整体用途，每个字段和方法说明作用 |

### JSDoc 示例

```typescript
/**
 * 格式化文章发布时间为相对时间
 * @param publishAt 发布时间 ISO 字符串
 * @param relative 是否返回相对时间，false 返回绝对日期
 * @returns 格式化后的时间字符串
 */
export const formatPublishTime = (
  publishAt: string,
  relative = true,
): string => {
  // 实现...
};
```

### JSX 注释规范

- ✅ **正确**：使用 `{/* 区块说明 */}` 格式，前后保留空格
- ✅ **推荐**：对分块结构（头部、列表、底部）添加说明
- ✅ **推荐**：复杂条件渲染说明判断条件
- ❌ **错误**：不要使用 `//` 或 `/* ... */` 在 JSX 中

### JSX 示例

```tsx
return (
  <div className={styles.container}>
    {/* 头部导航栏 */}
    <header className={styles.header}>
      <BackButton />
      <h1>{title}</h1>
    </header>

    {/* 内容列表 */}
    <div className={styles.content}>
      {list.map(item => (
        <ListItem key={item.id} data={item} />
      ))}
    </div>

    {/* 只有用户登录才显示收藏按钮 */}
    {isLogin && <FavoriteButton />}
  </div>
);
};
```

### 何时需要添加注释

✅ **必须添加注释：**
- 复杂业务逻辑：说明**为什么**这么做（不是怎么做）
- 处理边界特殊情况：说明处理了什么异常情况
- Hack 或 workaround：说明原因和解决了什么问题
- 复杂算法：说明整体思路

❌ **不需要添加注释：**
- 显而易见的简单代码（代码本身已经说清楚了）
- 好的命名本身就是文档，不要再重复说明

---

## 页面模块文档（仅复杂页面需要）

当页面业务逻辑复杂、涉及多步骤流程时，添加 `README.md` 说明：

```markdown
# PageName 页面

一句话描述页面整体功能。

## 业务流程

1. 用户进入页面，加载 XXX 数据
2. 用户操作 YYY，触发 ZZZ 逻辑
3. ...按步骤梳理清晰

## 数据流向

- API 接口: `api.xxx.getYyy`, `api.xxx.saveYyy`
- 状态管理: `xxxStore` 管理页面状态
- 页面跳转: `→ /pageA`, `→ /pageB`

## 特殊业务规则

列出特殊的业务规则说明：
- 规则一...
- 规则二...
```

---

## API 文档规范

API 文档**通过 TypeScript 类型 + JSDoc 注释实现**，不需要单独的 README 文件：

```typescript
// src/api/user/types.ts
/** 用户信息 */
export interface UserInfo {
  /** 用户ID */
  id: string;
  /** 用户昵称 */
  nickname: string;
  /** 用户头像URL，可能为空 */
  avatar: string | null;
}

/** 登录请求参数 */
export interface LoginRequest {
  /** 手机号（11位） */
  mobile: string;
  /** 验证码（6位） */
  code: string;
}

// src/api/user/index.ts
/** 手机号验证码登录 */
export async function login(
  params: LoginRequest
): Promise<LoginResponse> {
  return await api.post('/auth/login', params);
}
```

---

## 文档编写原则

1. **受众明确**：组件文档给**使用者**看，页面文档给**维护者**看，注释给**队友**看
2. **不写废话**：不要重复代码已经说清楚的内容
3. **示例简洁**：示例代码必须是**最简可运行版本**，复制就能用
4. **保持同步**：修改代码后**必须**同步更新文档，文档和代码不一样比没文档更糟

---

## 统一检查清单

生成文档后对照检查：

| 检查项 | 组件 | 页面 | API | JSX |
|--------|:----:|:----:|:---:|:---:|
| 是否有一句话功能描述 | ✅ | ✅ | - | - |
| Props/参数是否完整说明 | ✅ | - | ✅ | - |
| 是否提供了可运行的使用示例 | ✅ | - | - | - |
| 是否说明了需要注意的特殊情况 | ✅ | ✅ | - | - |
| 复杂逻辑是否有说明 | - | ✅ | - | ✅ |
| 是否删除了过时的注释 | - | - | ✅ | ✅ |
| 是否没有多余的废话注释 | - | - | ✅ | ✅ |
