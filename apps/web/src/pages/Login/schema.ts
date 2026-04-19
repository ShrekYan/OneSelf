import { z } from 'zod';

/**
 * 登录表单验证 Schema
 * 使用 zod 进行表单验证
 */
export const loginSchema = z.object({
  username: z.string().min(1, 'Username/Phone is required').trim(),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(20, 'Password cannot exceed 20 characters')
    .trim(),
  agreeTerms: z.literal<boolean>(true, {
    errorMap: () => ({
      message: 'Please agree to the User Agreement and Privacy Policy',
    }),
  }),
});

/**
 * 登录表单类型（从 Schema 推断）
 */
export type LoginFormData = z.infer<typeof loginSchema>;
