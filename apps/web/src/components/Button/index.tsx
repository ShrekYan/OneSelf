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
