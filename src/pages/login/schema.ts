import z from 'zod';

/**
 * 登录表单验证 Schema
 * 使用 zod 进行表单验证
 */
export const loginSchema = z.object({
  account: z.string().min(1, '手机号/用户名不能为空').trim(),
  password: z
    .string()
    .min(6, '密码至少需要6个字符')
    .max(32, '密码不能超过32个字符')
    .trim(),
  agreeTerms: z.literal<boolean>(true, {
    errorMap: () => ({ message: '请先同意用户协议和隐私政策' }),
  }),
});

/**
 * 登录表单类型（从 Schema 推断）
 */
export type LoginFormData = z.infer<typeof loginSchema>;
