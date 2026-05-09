export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'danger'
  | 'ghost';

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
