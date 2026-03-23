/**
 * Login 模块常量定义
 */

// ==================== 页面配置 ====================
export const PAGE_TITLE = "登录";

// ==================== 表单字段标识 ====================
export const FORM_FIELDS = {
  USERNAME: "username",
  PASSWORD: "password",
  REMEMBER_ME: "rememberMe",
  AGREE_TERMS: "agreeTerms"
} as const;

// ==================== 表单标签 ====================
export const LABELS = {
  USERNAME: "用户名",
  PASSWORD: "密码",
  REMEMBER_ME: "记住我",
  LOGIN_BUTTON: "登录",
  FORGOT_PASSWORD: "忘记密码？",
  SIGN_UP: "立即注册",
  AGREE_TERMS_PREFIX: "我已阅读并同意",
  USER_AGREEMENT: "《用户协议》",
  AND: "和",
  PRIVACY_POLICY: "《隐私政策》"
} as const;

// ==================== 路由路径 ====================
export const ROUTES = {
  USER_AGREEMENT: "/user-agreement",
  PRIVACY_POLICY: "/privacy-policy",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password"
} as const;

// ==================== 验证规则 ====================
export const VALIDATION = {
  USERNAME_MIN_LENGTH: 2,
  USERNAME_MAX_LENGTH: 20,
  PASSWORD_MIN_LENGTH: 6,
  PASSWORD_MAX_LENGTH: 20
} as const;

// ==================== 配色方案 ====================
export const COLORS = {
  PRIMARY: "#1890ff",
  SUCCESS: "#52c41a",
  ERROR: "#ff4d4f",
  WARNING: "#faad14"
} as const;
