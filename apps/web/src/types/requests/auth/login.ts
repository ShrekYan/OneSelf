// 登录请求类型定义
export interface LoginRequest {
  username: string
  password: string
  rememberMe?: boolean
}

export interface RegisterRequest {
  username: string
  password: string
  email: string
}

export interface ForgotPasswordRequest {
  email: string
}

export interface ResetPasswordRequest {
  token: string
  newPassword: string
}

export interface LogoutRequest {
  token?: string
}

export interface RefreshTokenRequest {
  token: string
}

export interface VerifyCodeRequest {
  email: string
  code: string
}
