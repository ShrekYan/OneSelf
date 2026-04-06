/**
 * 移动端忘记密码页面
 * @description 单页表单重置密码：所有字段一次性展示
 */
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useObserver } from 'mobx-react';
import { Toast } from 'antd-mobile';
import { useNavigate } from 'react-router-dom';
import { useForgotPasswordStore } from './useStore';
import { forgotPasswordSchema, type ForgotPasswordFormData } from './schema';
import { handleGoToLogin, formatCountdown, isValidMobile } from './handle';
import styles from './index.module.scss';

/**
 * 移动端忘记密码页面组件
 */
const ForgotPassword: React.FC = () => {
  const store = useForgotPasswordStore();
  const navigate = useNavigate();

  // 单一表单：包含所有四个字段
  const {
    handleSubmit,
    register,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      mobile: '',
      code: '',
      password: '',
      confirmPassword: '',
    },
  });

  // 监听手机号用于发送验证码按钮校验
  const watchedMobile = watch('mobile');

  /**
   * 处理发送验证码点击
   */
  const handleSendCode = async () => {
    if (!isValidMobile(watchedMobile)) {
      Toast.show({
        content: 'Please enter a valid 11-digit phone number',
        position: 'bottom',
      });
      return;
    }

    try {
      const success = await store.sendCode(watchedMobile);
      if (success) {
        Toast.show({
          icon: 'success',
          content: 'Verification code sent',
        });
      }
    } catch (error) {
      console.error('Send code error:', error);
      Toast.show({
        icon: 'fail',
        content: 'Failed to send code, please try again',
      });
    }
  };

  /**
   * 处理表单提交：验证 + 重置密码一步完成
   */
  const onSubmit = handleSubmit(async (formData: ForgotPasswordFormData) => {
    try {
      const success = await store.submitResetPassword(formData);
      if (success) {
        Toast.show({
          icon: 'success',
          content: 'Password reset successful!',
        });
        // 重置成功后跳转到登录页
        setTimeout(() => {
          navigate('/login');
        }, 1500);
      } else {
        Toast.show({
          icon: 'fail',
          content: 'Incorrect verification code',
        });
      }
    } catch (error) {
      console.error('Reset password error:', error);
      Toast.show({
        icon: 'fail',
        content: 'Password reset failed, please try again',
      });
    }
  });

  /**
   * 处理返回登录点击
   */
  const handleBackToLogin = (e: React.MouseEvent) => {
    e.preventDefault();
    handleGoToLogin();
    navigate('/login');
  };

  return useObserver(() => (
    <div className={styles.forgotPasswordContainer}>
      {/* Logo 和标题区域 */}
      <div className={styles.logoSection}>
        <div className={styles.logo}>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>
        <h1 className={styles.appName}>Forgot Password</h1>
        <p className={styles.stepTitle}>Reset your password in one step</p>
      </div>

      {/* 表单区域 */}
      <div className={styles.formSection}>
        <form className={styles.form} onSubmit={onSubmit}>
          {/* 手机号 */}
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="mobile">
              Phone Number
            </label>
            <div className={styles.inputWrapper}>
              <span className={styles.inputIcon}>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M22 16V12a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1z" />
                  <path d="M15 1v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V1" />
                </svg>
              </span>
              <input
                id="mobile"
                type="tel"
                placeholder="Enter 11-digit phone number"
                maxLength={11}
                className={styles.input}
                {...register('mobile')}
                disabled={store.isLoading || isSubmitting}
              />
            </div>
            {errors.mobile && (
              <div className={styles.errorText}>{errors.mobile.message}</div>
            )}
          </div>

          {/* 验证码 */}
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="code">
              Verification Code
            </label>
            <div className={styles.inputWrapper}>
              <span className={styles.inputIcon}>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </span>
              <input
                id="code"
                type="text"
                placeholder="Enter 6-digit code"
                maxLength={6}
                className={`${styles.input} ${styles.inputWithCodeBtn}`}
                {...register('code')}
                disabled={store.isLoading || isSubmitting}
              />
              <button
                type="button"
                className={styles.codeButton}
                onClick={handleSendCode}
                disabled={
                  store.countdown > 0 || store.isLoading || isSubmitting
                }
              >
                {store.countdown > 0
                  ? formatCountdown(store.countdown)
                  : 'Get Code'}
              </button>
            </div>
            {errors.code && (
              <div className={styles.errorText}>{errors.code.message}</div>
            )}
          </div>

          {/* 新密码 */}
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="password">
              New Password
            </label>
            <div className={styles.inputWrapper}>
              <span className={styles.inputIcon}>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </span>
              <input
                id="password"
                type={store.showPassword ? 'text' : 'password'}
                placeholder="Enter 6-32 characters"
                className={styles.input}
                {...register('password')}
                disabled={store.isLoading || isSubmitting}
              />
              <button
                type="button"
                className={styles.passwordToggle}
                onClick={store.togglePasswordVisibility}
                disabled={store.isLoading || isSubmitting}
              >
                {store.showPassword ? (
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-4 4.61" />
                    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.625 9.625 0 0 0 4.01-.83" />
                    <line x1="2" y1="2" x2="22" y2="22" />
                  </svg>
                ) : (
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
            {errors.password && (
              <div className={styles.errorText}>{errors.password.message}</div>
            )}
          </div>

          {/* 确认密码 */}
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="confirmPassword">
              Confirm Password
            </label>
            <div className={styles.inputWrapper}>
              <span className={styles.inputIcon}>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </span>
              <input
                id="confirmPassword"
                type={store.showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm your new password"
                className={styles.input}
                {...register('confirmPassword')}
                disabled={store.isLoading || isSubmitting}
              />
              <button
                type="button"
                className={styles.passwordToggle}
                onClick={store.toggleConfirmPasswordVisibility}
                disabled={store.isLoading || isSubmitting}
              >
                {store.showConfirmPassword ? (
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-4 4.61" />
                    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.625 9.625 0 0 0 4.01-.83" />
                    <line x1="2" y1="2" x2="22" y2="22" />
                  </svg>
                ) : (
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <div className={styles.errorText}>
                {errors.confirmPassword.message}
              </div>
            )}
          </div>

          {/* 提交按钮 */}
          <button
            type="submit"
            className={styles.submitButton}
            disabled={store.isLoading || isSubmitting}
          >
            {store.isLoading || isSubmitting
              ? 'Resetting...'
              : 'Reset Password'}
          </button>
        </form>
      </div>

      {/* 底部返回登录 */}
      <div className={styles.footerSection}>
        <span className={styles.backText}>
          Remember your password?{' '}
          <a href="#" className={styles.backLink} onClick={handleBackToLogin}>
            Back to Login
          </a>
        </span>
      </div>
    </div>
  ));
};

ForgotPassword.displayName = 'ForgotPassword';

export default ForgotPassword;
