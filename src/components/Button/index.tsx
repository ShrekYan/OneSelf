import React from 'react'
import { Button as AntdButton } from 'antd-mobile'
import type { ButtonProps } from 'antd-mobile'

interface CustomButtonProps extends ButtonProps {
  loading?: boolean
}

const Button: React.FC<CustomButtonProps> = ({
  loading,
  children,
  ...props
}) => {
  return (
    <AntdButton
      {...props}
      loading={loading}
    >
      {children}
    </AntdButton>
  )
}

export default Button
