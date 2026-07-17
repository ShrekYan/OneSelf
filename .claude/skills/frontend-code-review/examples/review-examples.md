# 代码审查示例

## 示例1：组件审查

**用户输入**：审查 src/components/LazyImage/index.tsx

**审查输出**：
```markdown
## 代码审查结果

### 一、审查范围
- src/components/LazyImage/index.tsx
- src/components/LazyImage/index.module.scss

### 二、核心发现

| 严重程度 | 类别 | 问题数 |
|---------|------|--------|
| 🔴 严重 | 安全/性能 | 0 |
| 🟠 中等 | 类型/规范 | 2 |
| 🟡 轻微 | 风格/命名 | 1 |

### 三、详细分析

#### 🟠 中等问题
1. **类型不安全** - `src/components/LazyImage/index.tsx:15`
   - 位置：src/components/LazyImage/index.tsx:15
   - 影响：Props 中 `src` 未定义类型，使用隐式 any
   - 建议：定义完整的 Props 类型，包含 `src: string; alt?: string; className?: string`

#### 🟡 轻微问题
1. **命名不规范** - `src/components/LazyImage/index.module.scss:5`
   - 位置：src/components/LazyImage/index.module.scss:5
   - 影响：class 名使用下划线而非 camelCase
   - 建议：将 `.lazy_image` 改为 `.lazyImage`

### 四、总体评价
组件结构清晰，懒加载逻辑实现正确。主要问题是类型定义不完整。

### 五、修复优先级
1. 🟠 中优先级：补充 Props 类型定义
2. 🟡 低优先级：统一 class 命名规范

### 六、验证提示
修复完成后，请运行：
```bash
npm run lint
npx tsc --noEmit
```
```

## 示例2：页面审查

**用户输入**：审查 src/pages/About/ 目录下所有文件

**审查输出**：
```markdown
## 代码审查结果

### 一、审查范围
- src/pages/About/index.tsx
- src/pages/About/useStore.ts
- src/pages/About/constant.ts
- src/pages/About/components/Header/index.tsx

### 二、核心发现

| 严重程度 | 类别 | 问题数 |
|---------|------|--------|
| 🔴 严重 | 安全/性能 | 0 |
| 🟠 中等 | 类型/规范 | 1 |
| 🟡 轻微 | 风格/命名 | 3 |

### 三、详细分析

#### 🟠 中等问题
1. **MobX 状态修改违规** - `src/pages/About/index.tsx:30`
   - 位置：src/pages/About/index.tsx:30
   - 影响：在 action 之外直接修改 store 状态，违反 MobX 规范
   - 建议：在 `useStore.ts` 中定义 action 方法，通过 action 修改状态

#### 🟡 轻微问题
1. **未使用的导入** - `src/pages/About/index.tsx:5`
   - 位置：src/pages/About/index.tsx:5
   - 影响：`useEffect` 导入未使用
   - 建议：删除未使用的导入

### 四、总体评价
页面结构符合规范，状态管理模式正确。需要修复 MobX 状态修改问题。

### 五、修复优先级
1. 🟠 中优先级：修复 MobX 状态修改规范问题
2. 🟡 低优先级：清理未使用的导入

### 六、验证提示
修复完成后，请运行：
```bash
npm run lint
npx tsc --noEmit
npm run test:run
```
```