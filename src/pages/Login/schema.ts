import z from "zod";

/**
 * 登录表单验证 Schema
 * 使用 zod 进行表单验证
 */
export const loginSchema = z.object({
  username: z
    .string()
    .min(2, "用户名至少需要2个字符")
    .max(20, "用户名不能超过20个字符")
    .trim(),
  password: z
    .string()
    .min(6, "密码至少需要6个字符")
    .max(20, "密码不能超过20个字符")
    .trim(),
  rememberMe: z.boolean()
});

/**
 * 登录表单类型（从 Schema 推断）
 */
export type LoginFormData = z.infer<typeof loginSchema>;
