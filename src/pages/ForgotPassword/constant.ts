/**
 * ForgotPassword 模块常量定义
 */

// ==================== 页面配置 ====================
export const PAGE_TITLE = "忘记密码";
export const PAGE_DESCRIPTION = "找回您的账户访问权限";

// ==================== 表单字段标识 ====================
export const FORM_FIELDS = {
  USERNAME: "username",
  EMAIL: "email",
  PHONE: "phone",
  VERIFICATION_CODE: "verificationCode"
} as const;

// ==================== 表单标签 ====================
export const LABELS = {
  USERNAME: "用户名",
  EMAIL: "邮箱地址",
  PHONE: "手机号码",
  VERIFICATION_CODE: "验证码",
  SEND_CODE: "发送验证码",
  SUBMIT_BUTTON: "提交",
  BACK_TO_LOGIN: "返回登录"
} as const;

// ==================== 验证规则 ====================
export const VALIDATION = {
  USERNAME_MIN_LENGTH: 2,
  USERNAME_MAX_LENGTH: 20,
  VERIFICATION_CODE_LENGTH: 6,
  CODE_COUNTDOWN: 60 // 验证码倒计时时间（秒）
} as const;

// ==================== 配色方案 ====================
export const COLORS = {
  PRIMARY: "#1890ff",
  SUCCESS: "#52c41a",
  ERROR: "#ff4d4f",
  WARNING: "#faad14",
  INFO: "#1890ff"
} as const;

// ==================== 提示信息 ====================
export const MESSAGES = {
  SUCCESS: "重置密码链接已发送，请查收邮箱/短信",
  CODE_SENT: "验证码已发送",
  CODE_FAILED: "验证码发送失败",
  SUBMIT_FAILED: "提交失败，请稍后重试"
} as const;
