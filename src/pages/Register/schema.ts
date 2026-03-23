import z from "zod";

/**
 * 注册表单验证 Schema
 * 使用 zod 进行表单验证
 */
export const registerSchema = z.object({
  username: z
    .string()
    .min(2, "用户名至少需要2个字符")
    .max(20, "用户名不能超过20个字符")
    .trim(),
  phone: z
    .string()
    .length(11, "请输入11位手机号码")
    .regex(/^1[3-9]\d{9}$/, "请输入正确的手机号码格式")
    .trim(),
  verifyCode: z
    .string()
    .length(6, "请输入6位验证码")
    .trim(),
  password: z
    .string()
    .min(6, "密码至少需要6个字符")
    .max(20, "密码不能超过20个字符")
    .trim(),
  confirmPassword: z
    .string()
    .min(6, "密码至少需要6个字符")
    .max(20, "密码不能超过20个字符")
    .trim(),
  agreement: z
    .boolean()
    .refine(val => val === true, "请同意用户协议和隐私政策")
}).refine((data) => data.password === data.confirmPassword, {
  message: "两次输入的密码不一致",
  path: ["confirmPassword"]
});

/**
 * 注册表单类型（从 Schema 推断）
 */
export type RegisterFormData = z.infer<typeof registerSchema>;
