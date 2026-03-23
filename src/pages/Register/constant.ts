/**
 * Register 模块常量定义
 */

// ==================== 页面配置 ====================
export const PAGE_TITLE = "用户注册";

// ==================== 表单标签 ====================
export const LABELS = {
  USERNAME: "用户名",
  PHONE: "手机号",
  VERIFY_CODE: "验证码",
  PASSWORD: "密码",
  CONFIRM_PASSWORD: "确认密码",
  AGREEMENT: "我已阅读并同意",
  TERMS: "用户协议",
  PRIVACY: "隐私政策",
  SEND_CODE: "获取验证码",
  SIGN_UP_BUTTON: "注册",
  LOGIN_PREFIX: "已有账号",
  LOGIN_SUFFIX: "去登录"
} as const;

// ==================== 正则表达式 ====================
export const REGEX = {
  PHONE: /^1[3-9]\d{9}$/
} as const;

// ==================== 验证码倒计时 ====================
export const CODE_COUNTDOWN = 60;
