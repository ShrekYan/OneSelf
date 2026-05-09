# T002 执行方案 - 实现 Badge 徽章核心组件

## 🎯 任务概述

- **任务 ID**：T002
- **所属模块**：组件实现
- **业务目标**：实现 Badge 徽章核心组件，支持三种类型、四种颜色主题、数字最大值、右上角定位
- **前置依赖**：✅ T001 - 已完成（Badge Props 类型）

---

## 📝 实现方案

### 1. 组件文件结构

```
apps/web/src/components/Badge/
├── types.ts          ✅ 已完成（T001）
├── index.tsx         （新增）组件主文件
└── index.module.scss （新增）样式文件
```

### 2. 组件实现核心逻辑

#### 2.1 数字处理逻辑

```typescript
// 数字最大值处理
function formatCount(count: number, max: number = 99): string | number {
  if (count > max) {
    return `${max}+`;
  }
  return count;
}
```

#### 2.2 组件渲染逻辑

根据 `variant` 渲染不同内容：
- **dot**：仅显示小红点
- **count**：显示数字，超过 max 显示 `99+`
- **text**：显示自定义文本

#### 2.3 定位与样式

- 使用 `position: absolute` 绝对定位
- 位置：右上角 `top: 0; right: 0`
- 支持自定义偏移（通过 className 扩展）
- 根据 color 属性应用不同颜色主题

### 3. 样式设计（SCSS Modules）

```scss
.badgeContainer {
  position: relative;
  display: inline-flex;
}

.badge {
  position: absolute;
  top: 0;
  right: 0;
  transform: translate(50%, -50%);

  // 颜色变体
  &.primary { background: #1677ff; }
  &.success { background: #52c41a; }
  &.warning { background: #faad14; }
  &.danger  { background: #ff4d4f; }

  // 类型变体
  &.dot { /* 红点样式 */ }
  &.count { /* 数字样式 */ }
  &.text { /* 文本样式 */ }
}
```

---

## 📁 将修改的文件

| 文件路径 | 操作 | 说明 |
|---------|------|------|
| `apps/web/src/components/Badge/index.tsx` | **新增** | Badge 组件主文件 |
| `apps/web/src/components/Badge/index.module.scss` | **新增** | Badge 组件样式文件 |

---

## ⚠️ 注意事项

1. ✅ 纯组件，仅依赖 Props，不使用 MobX
2. ✅ 遵循公共组件开发规范
3. ✅ 支持 className 扩展
4. ✅ children 为可选（可以单独显示徽章，不包裹元素）

---

## 🔍 质量检查

执行完成后将自动检查：
- ✅ ESLint 代码规范
- ✅ TypeScript 类型检查
