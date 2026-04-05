import { z } from 'zod';

/**
 * 注册表单验证 Schema
 * 使用 zod 进行表单验证
 */
export const registerSchema = z
  .object({
    mobile: z
      .string()
      .length(11, 'Phone number must be 11 digits')
      .regex(/^1[3-9]\d{9}$/, 'Please enter a valid phone number')
      .trim(),
    code: z.string().length(6, 'Verification code must be 6 digits').trim(),
    password: z
      .string()
      .min(6, 'Password must be at least 6 characters')
      .max(32, 'Password cannot exceed 32 characters')
      .trim(),
    confirmPassword: z
      .string()
      .min(6, 'Password must be at least 6 characters')
      .trim(),
    agreeTerms: z.literal<boolean>(true, {
      errorMap: () => ({
        message: 'Please agree to the User Agreement and Privacy Policy',
      }),
    }),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

/**
 * 注册表单类型（从 Schema 推断）
 */
export type RegisterFormData = z.infer<typeof registerSchema>;
