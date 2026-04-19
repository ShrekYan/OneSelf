import { z } from 'zod';

/**
 * 忘记密码 - 完整表单 Schema
 * 一次性展示所有四个字段：手机号、验证码、新密码、确认密码
 */
export const forgotPasswordSchema = z
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
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

/**
 * 完整表单数据类型
 */
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
