# T001 执行方案

## 任务概述
- 任务 ID：T001
- 任务名称：实现 Button 类型定义
- 模块：UI 组件

## 前置依赖检查
✅ 无任何前置依赖

## 实现方案详情
- 技术选型：TypeScript 严格模式
- 核心实现思路：定义 ButtonProps 接口和相关类型枚举

## 将修改/新增的文件
- ✅ src/components/Button/types.ts (新增)

## 完整代码实现

### 📄 src/components/Button/types.ts
```typescript
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';

export type ButtonSize = 'small' | 'medium' | 'large';

export interface ButtonProps {
  /**
   * 按钮样式变体
   * @default 'primary'
   */
  variant?: ButtonVariant;

  /**
   * 按钮尺寸
   * @default 'medium'
   */
  size?: ButtonSize;

  /**
   * 是否禁用
   * @default false
   */
  disabled?: boolean;

  /**
   * 是否为加载状态
   * @default false
   */
  loading?: boolean;

  /**
   * 是否占满父容器宽度
   * @default false
   */
  block?: boolean;

  /**
   * 按钮内容
   */
  children?: React.ReactNode;

  /**
   * 自定义类名
   */
  className?: string;

  /**
   * 点击事件回调
   */
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}
```

## 质量检查要点
- TypeScript 严格模式检查
- ESLint 规范检查
- 类型导出使用 `export type`
