import z from "zod";

/**
 * 忘记密码表单验证 Schema
 * 使用 zod 进行表单验证
 */
export const forgotPasswordSchema = z.object({
  username: z
    .string()
    .min(2, "用户名至少需要2个字符")
    .max(20, "用户名不能超过20个字符")
    .trim(),
  email: z
    .string()
    .email("请输入有效的邮箱地址")
    .trim(),
  phone: z
    .string()
    .regex(/^1[3-9]\d{9}$/, "请输入有效的手机号码")
    .trim(),
  verificationCode: z
    .string()
    .length(6, "验证码必须是6位数字")
    .regex(/^\d{6}$/, "验证码必须是6位数字")
    .trim()
});

/**
 * 忘记密码表单类型（从 Schema 推断）
 */
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
