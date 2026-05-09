# T001 - 实现 Button 类型定义 - 代码方案

## 任务信息
- **任务ID**: T001
- **任务名称**: 实现 Button 类型定义
- **描述**: 定义 Button 组件的 TypeScript 类型接口，包括 Props、Variant、Size 等所有类型定义

## 一、设计原则与设计方案

### 1.1 组件类型设计

#### ButtonVariant（按钮变体）
- primary（主要按钮）
- default（默认按钮）
- warning（警告按钮）
- danger（危险按钮）

#### ButtonSize（按钮尺寸）
- small（小尺寸）
- medium（中尺寸）
- default（默认尺寸）
- large（大尺寸）

#### ButtonHtmlType（按钮原生类型）
- button
- submit
- reset

### 1.2 Props 接口设计

```typescript
export type ButtonVariant = 'primary' | 'default' | 'warning' | 'danger';
export type ButtonSize = 'small' | 'medium' | 'default' | 'large';
export type ButtonHtmlType = 'button' | 'submit' | 'reset';

export interface ButtonProps {
  /**
   * 按钮类型
   * @default 'default'
   */
  variant?: ButtonVariant;

  /**
   * 按钮尺寸
   * @default 'default'
   */
  size?: ButtonSize;

  /**
   * 按钮宽度占满父容器
   * @default false
   */
  block?: boolean;

  /**
   * 是否禁用
   * @default false
   */
  disabled?: boolean;

  /**
   * 是否加载中
   * @default false
   */
  loading?: boolean;

  /**
   * 按钮原生 type 属性
   * @default 'button'
   */
  htmlType?: ButtonHtmlType;

  /**
   * 点击事件
   */
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;

  /**
   * 自定义类名
   */
  className?: string;

  /**
   * 子元素
   */
  children?: React.ReactNode;
}
```

## 二、方案验证清单

| 序号 | 验证项 | 预期结果 |
|------|--------|
| 1 | Variant 类型定义 | 正确定义 4 种按钮变体 | ✅ |
| 2 | Size 类型定义 | 正确定义 4 种按钮尺寸 | ✅ |
| 3 | HtmlType 类型定义 | 正确定义 3 种按钮原生类型 | ✅ |
| 4 | Props 接口完整性 | 包含所有必要属性 | ✅ |
| 5 | TypeScript 严格模式 | 无类型正确 | ✅ |

## 三、文件清单

### 输出文件
1. `src/components/Button/index.tsx
   - 包含完整的类型定义
   - 组件框架代码
   - 导出组件框架

2. `src/components/Button/index.module.scss`
   - 样式文件框架

3. `src/components/index.tsx`
   - 注册导出 Button 组件

## 四、执行步骤

1. 创建 Button 组件目录
2. 创建 index.tsx 并编写类型定义和组件框架
3. 创建 index.module.scss 样式文件
4. 在 components/index.tsx 中注册导出

## 五、代码实现

### index.tsx
```typescript
import React from 'react';
import classNames from 'classnames';
import styles from './index.module.scss';

export type ButtonVariant = 'primary' | 'default' | 'warning' | 'danger';
export type ButtonSize = 'small' | 'medium' | 'default' | 'large';
export type ButtonHtmlType = 'button' | 'submit' | 'reset';

export interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  block?: boolean;
  disabled?: boolean;
  loading?: boolean;
  htmlType?: ButtonHtmlType;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  children?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'default',
  size = 'default',
  block = false,
  disabled = false,
  loading = false,
  htmlType = 'button',
  onClick,
  className,
  children,
}) => {
  const buttonClass = classNames(
    styles.buttonContainer,
    styles[`variant${variant.charAt(0).toUpperCase() + variant.slice(1)}`],
    styles[`size${size.charAt(0).toUpperCase() + size.slice(1)}`],
    {
      [styles.block]: block,
      [styles.disabled]: disabled,
      [styles.loading]: loading,
    },
    className,
  );

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || loading) {
      event.preventDefault();
      return;
    }
    onClick?.(event);
  };

  return (
    <button
      type={htmlType}
      className={buttonClass}
      disabled={disabled || loading}
      onClick={handleClick}
    >
      {loading && <span className={styles.loadingIcon}>⏳</span>}
      {children}
    </button>
  );
};

export default Button;
```

### index.module.scss
```scss
.buttonContainer {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
  gap: 8px;

  &:active:not(:disabled) {
    transform: scale(0.98);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
}

.block {
  width: 100%;
}

.variantPrimary {
  background-color: #1677ff;
  color: #ffffff;

  &:active:not(:disabled) {
    background-color: #0958d9;
  }
}

.variantDefault {
  background-color: #ffffff;
  color: #333333;
  border: 1px solid #d9d9d9;

  &:active:not(:disabled) {
    background-color: #f5f5f5;
  }
}

.variantWarning {
  background-color: #faad14;
  color: #ffffff;

  &:active:not(:disabled) {
    background-color: #d48806;
  }
}

.variantDanger {
  background-color: #ff4d4f;
  color: #ffffff;

  &:active:not(:disabled) {
    background-color: #d9363e;
  }
}

.sizeSmall {
  padding: 4px 12px;
  font-size: 24px;
  height: 56px;
}

.sizeMedium {
  padding: 6px 16px;
  font-size: 28px;
  height: 72px;
}

.sizeDefault {
  padding: 8px 20px;
  font-size: 28px;
  height: 88px;
}

.sizeLarge {
  padding: 10px 24px;
  font-size: 32px;
  height: 104px;
}

.loadingIcon {
  display: inline-flex;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
```

### components/index.tsx 更新
```typescript
export { default as LazyImage } from './LazyImage';
export { default as ErrorFallback } from './ErrorFallback';
export { default as Button } from './Button';
export type { ButtonProps, ButtonVariant, ButtonSize, ButtonHtmlType } from './Button';
```
