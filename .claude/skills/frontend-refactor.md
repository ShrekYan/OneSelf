# 重构建议规范

当需要分析现有代码并给出重构建议时，按照本规范进行分析和输出。

---

## 重构分析六步走

### 第一步：代码嗅探（Code Smell 识别）

#### 通用代码问题
检查以下常见问题：

1. **冗长** - 函数/组件太长，单个文件超过 500 行
2. **重复** - 复制粘贴代码，逻辑重复
3. **复杂** - 圈复杂度过高，分支太多
4. **模糊** - 命名不清晰，不知道代码做什么
5. **冗余** - 死代码、未使用的导入、未使用变量
6. **依赖过多** - 一个文件依赖太多外部模块
7. **违反单一职责** - 做太多不相关的事

#### 项目特定规范检查（必须检查）
结合本项目架构，额外检查：

| 检查项 | 规范要求 |
|--------|----------|
| **目录结构** | 页面是否遵循 `index.tsx` + `useStore.ts` + `handle.ts` + `constant.ts` + `components/` 拆分 |
| **useStore.ts** | 页面级 Store 是否使用 `useLocalObservable` + **对象字面量**，禁止 class 写法 |
| **handle.ts** | 是否只存放**纯函数**，无副作用、无 API 调用、不调用 React Hook |
| **样式文件** | 是否使用 `index.module.scss`，class 命名是否 camelCase，根容器是否遵循 `{pageName}Container` 命名规则 |
| **导入路径** | 是否使用路径别名 `@/`，禁止 `../../../../` 长相对路径 |
| **TypeScript** | 是否滥用 `any`，类型是否使用 `export type` 导出，是否优先使用联合类型代替 `enum` |
| **MobX 用法** | 是否使用 `useObserver` Hook，禁止 observer HOC |
| **第三方库导入** | 是否按需导入（如 `react-use` 需 `react-use/lib/useDebounce`） |

### 第二步：评估影响

| 严重程度 | 说明 |
|---------|------|
| 🔴 **严重** | 违反项目核心架构，影响功能、导致 bug、难以维护 |
| 🟠 **中等** | 违反规范，影响可读性，增加维护成本 |
| 🟡 **轻微** | 代码风格问题，不影响功能 |

### 第三步：匹配项目规范
根据本项目既定规范，确认重构方向是否正确：

- 📐 [API 设计规范](../rules/frontend-api-design.md)
- 📐 [TypeScript 规范](../rules/frontend-typescript.md)
- 📐 [CSS/SCSS 规范](../rules/frontend-css-scss.md)
- 📐 [handle.ts 规范](../rules/frontend-handle-ts.md)
- 📐 [Hooks 与错误处理规范](../rules/frontend-hooks-error-handling.md)
- 📐 [第三方库规范](../rules/frontend-third-party-libraries.md)

### 第四步：提出重构方案

针对每个问题，给出：
1. **怎么改** - 具体操作步骤
2. **为什么** - 好处是什么，符合哪条规范
3. **示例** - 改完之后代码什么样

### 第五步：评估风险

- 重构是否会影响现有功能？
- 需要什么测试确保不回归？
- 改动范围有多大？

### 第六步：排定优先级

---

## 常见重构场景速查

### 通用场景

| 场景 | 问题 | 解决方案 |
|------|------|----------|
| **超长组件 > 500 行** | 一个组件做太多事 | 拆分：抽取子组件、抽取自定义 Hook、拆分 Store |
| **重复代码** | 多处复制粘贴相同逻辑 | 抽取：工具函数/hook/公共组件放到 `src/utils/` `src/hooks/` |
| **复杂条件分支** | `if-else`/`switch` 太长 | 对象映射替代条件分支，抽取分支逻辑 |
| **命名不清晰** | `data`/`info`/拼音/看不懂的缩写 | 重命名为具体含义的名称 |
| **类型问题** | `any` 泛滥、重复定义 | 替换 `any`，共用类型统一放 `src/types/` |
| **不合理导入** | `../../../../` 长相对路径 | 使用路径别名 `@/` |
| **内存泄漏** | 事件监听/timer 没有清理 | 添加清理函数到 `useEffect` 返回值 |
| **魔术数字** | 代码中直接出现魔法数字 | 抽取为命名常量放到 `constant.ts` |

### 项目特定场景

| 场景 | 问题 | 解决方案 |
|------|------|----------|
| **所有逻辑都在 index.tsx** | 页面未按职责拆分 | 拆分为：`index.tsx`（UI 渲染） + `useStore.ts`（状态 + 动作） + `handle.ts`（纯函数） + `constant.ts`（常量） |
| **页面 Store 使用 class** | 违反项目 MobX 写法 | 重构为 `useLocalObservable(() => ({ ... }))` 对象字面量 |
| **handle.ts 中有 API 调用** | 副作用放错了位置 | API 调用移到 `useStore.ts` 或 `hooks/` |
| **handle.ts 调用 React Hook** | 违反 React 规则 | Hook 逻辑移到 `hooks/useXxx.ts` |
| **样式不是 *.module.scss** | 违反 CSS Modules 规范 | 重命名并调整 import 方式 |
| **class 使用 kebab-case** | 违反 camelCase 规范 | 重命名为 camelCase |
| **整体导入 react-use/lodash** | 不利于 tree-shaking，包体积过大 | 改为按需导入 |
| **用 enum 而不是联合类型** | 不利于 tree-shaking | 改为 `type Status = 'a' | 'b'` 联合类型 |
| **用 observer HOC 而不是 useObserver** | 违反项目 MobX 规范 | 改为 `return useObserver(() => (...))` Hook 写法 |

### 关键示例

**对象映射替代条件分支：**
```typescript
// ❌ Before
function getStatusText(status: string) {
  if (status === 'pending') return '待处理';
  else if (status === 'paid') return '已支付';
  // ...更多分支
}

// ✅ After
const statusMap: Record<string, string> = {
  pending: '待处理',
  paid: '已支付',
  shipped: '已发货',
  delivered: '已签收',
};

function getStatusText(status: string) {
  return statusMap[status] || '未知';
}
```

**抽取魔术数字到 constant.ts：**
```typescript
// ❌ Before - 散落在组件中
if (count > 10) {
  showMore = true;
}

// ✅ After - constant.ts
export const MAX_DISPLAY_ITEMS = 10;

// 组件中
import { MAX_DISPLAY_ITEMS } from '../constant';
if (count > MAX_DISPLAY_ITEMS) {
  showMore = true;
}
```

**页面职责拆分示例：**
```
# ❌ Before - 所有代码混在一起
src/pages/ArticleList/index.tsx  # 800 行，包含一切

# ✅ After - 按职责拆分
src/pages/ArticleList/
  ├── index.tsx         # 只做 UI 渲染和组件组合（~100 行）
  ├── useStore.ts       # MobX 状态 + 修改状态的动作（含 API 调用）
  ├── handle.ts         # 纯函数：数据格式化、过滤、排序
  ├── constant.ts       # 常量配置
  └── components/       # 拆分出的子组件
      ├── ArticleItem/
      └── FilterBar/
```

**useStore.ts 正确写法：**
```typescript
// ❌ Before - class 写法（禁止页面级使用）
class ArticleStore {
  loading = false;
  constructor() { makeAutoObservable(this) }
}

// ✅ After - 对象字面量写法（项目规范）
import { useLocalObservable } from 'mobx-react';

export function useArticleListStore() {
  const store = useLocalObservable(() => ({
    // 状态
    loading: false;
    articleList: [],

    // 动作
    setLoading: (state: boolean) => {
      this.loading = state;
    },

    fetchList: async () => {
      this.loading = true;
      this.articleList = await api.article.list();
      this.loading = false;
    },
  }));

  return store;
}
```

**handle.ts 正确分工：**
```typescript
// ✅ handle.ts - 只放纯函数，无副作用
export const formatPublishTime = (publishAt: string): string => {
  return dayjs(publishAt).format('YYYY-MM-DD');
};

export const filterArticlesByCategory = (
  articles: ArticleItem[],
  categoryId: string,
): ArticleItem[] => {
  if (categoryId === 'all') return articles;
  return articles.filter(item => item.categoryId === categoryId);
};

export const confirmDeleteArticle = async (): Promise<boolean> => {
  return await Dialog.confirm({ ... }); // 简单交互允许
};

// ❌ 这些不能放 handle.ts
// - API 调用 → 放 useStore.ts
// - 调用 React Hook → 放 hooks/useXxx.ts
// - 自定义 Hook (useXXX) → 放 hooks/useXxx.ts
// - MobX 状态定义 → 放 useStore.ts
```

**根容器 CSS 命名规范：**
```scss
// ✅ About 页面 → aboutContainer
.aboutContainer {
  padding: 16px;
  .header { ... }
}

// ✅ ArticleListItem 组件 → articleListItemContainer
.articleListItemContainer {
  display: flex;
}

// ❌ 不推荐通用 container 命名（污染搜索）
.container { ... }
```

**react-use 按需导入：**
```typescript
// ❌ Before - 整体导入，不利于 tree-shaking
import { useDebounce } from 'react-use';

// ✅ After - 按需导入
import useDebounce from 'react-use/lib/useDebounce';
```

**联合类型代替 enum：**
```typescript
// ❌ Before - enum
enum Status {
  Idle,
  Loading,
  Success,
  Error,
}

// ✅ After - 联合类型（tree-shaking 友好）
type Status = 'idle' | 'loading' | 'success' | 'error';
```

---

## 重构原则

### 男孩法则
> "每次你离开，都要让代码比你发现它的时候更干净"

不需要一次性全部重构，问题发现了就逐步修复。

### 三问重构
重构前问自己：
1. **我能理解这段代码做什么吗？** - 如果不能，需要重构
2. **修改这个功能容易吗？** - 如果不容易，需要重构
3. **这段代码会被经常修改吗？** - 如果会，需要重构

### 不要过度重构
- 简单问题简单处理，不需要设计模式过度设计
- **YAGNI** - 不要实现现在不需要的功能
- 能够工作并且易于理解就是好代码

---

## 优先级划分

| 优先级 | 需要处理的问题 |
|--------|--------------|
| 🔴 **必须立即改** | 内存泄漏、安全漏洞、any 泛滥、违反项目核心架构规范、重复逻辑导致 bug 风险 |
| 🟠 **有空就改** | 拆分过长组件、抽取重复代码、改善命名、清理死代码、调整目录结构分工 |
| 🟡 **可改可不改** | 代码风格、格式问题、已经稳定很少修改的代码 |

---

## 输出模板

```markdown
## 重构分析：`文件路径`

### 代码现状

简要描述当前代码的功能和规模。

### 发现问题

| 位置 | 问题 | 严重程度 | 违反规范 |
|------|------|----------|----------|
| `file.ts:line` | 问题描述 | 🔴/🟠/🟡 | 规范名称 |

---

### 重构建议

#### 1. 问题标题

**问题描述:**
> 详细描述问题，为什么不好，违反哪条规范

**重构方案:**
```typescript
// 修改后的代码示例
```

**预期收益:**
- 收益 1
- 收益 2

**风险评估:**
- 改动范围: 小 / 中 / 大
- 风险: 低 / 中 / 高

---

#### 2. 下一个问题...

### 重构步骤建议

按优先级排序：

1. **高优先级** - 先改这些
   - [ ] 任务一
   - [ ] 任务二

2. **低优先级** - 可以后续再改
   - [ ] 任务三

### 测试建议

重构后需要测试哪些点确保没有问题：
- [ ] 测试点一
- [ ] 测试点二
```

---

## 检查清单

给出重构建议后，请检查：
- [ ] 是否识别出了所有主要的代码坏味道？
- [ ] 是否检查了项目特定的规范遵守情况？
- [ ] 每个问题是否评估了严重程度？
- [ ] 重构方案是否具体，给出符合项目规范的代码示例？
- [ ] 是否说明了预期收益？
- [ ] 是否评估了风险和改动范围？
- [ ] 是否给出了优先级排序？
- [ ] 是否给出了测试建议？
- [ ] 建议是否符合项目现有的代码规范？
- [ ] 是否引用了项目中对应的规范文档？
