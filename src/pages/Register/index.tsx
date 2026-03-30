/**
 * 移动端注册页面
 * @description 移动端用户注册页面，包含手机号、验证码、密码、昵称等输入和协议勾选功能
 */
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useObserver } from 'mobx-react';
import { Checkbox, Toast } from 'antd-mobile';
import { useRegisterStore } from './useStore';
import { registerSchema, type RegisterFormData } from './schema';
import {
  handleUserAgreement,
  handlePrivacyPolicy,
  handleGoToLogin,
  formatCountdown,
  isValidMobile,
} from './handle';
import styles from './index.module.scss';
import { useNavigate } from 'react-router-dom';

/**
 * 移动端注册页面组件
 */
const Register: React.FC = () => {
  const store = useRegisterStore();
  const navigate = useNavigate();

  // 使用 react-hook-form 管理表单状态和验证
  const {
    handleSubmit,
    register,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      mobile: '',
      code: '',
      password: '',
      confirmPassword: '',
      nickname: '',
      agreeTerms: false,
    },
  });

  // 监听协议勾选状态
  const agreeTerms = watch('agreeTerms');
  // 监听手机号输入，用于验证码按钮启用判断
  const mobileValue = watch('mobile');

  /**
   * 处理获取验证码点击
   */
  const handleSendCode = async () => {
    if (!isValidMobile(mobileValue)) {
      Toast.show({
        content: 'Please enter a valid phone number',
        position: 'bottom',
      });
      return;
    }

    try {
      const success = await store.sendCode(mobileValue);
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
   * 处理注册提交
   * 表单验证通过后调用注册 API
   */
  const onSubmit = handleSubmit(async (formData: RegisterFormData) => {
    try {
      const apiResult = await store.register(formData);

      if (apiResult.success) {
        Toast.show({
          icon: 'success',
          content: 'Registration successful!',
        });
        // 注册成功后跳转到首页或登录页
        setTimeout(() => {
          navigate('/login');
        }, 1000);
      } else {
        Toast.show({
          icon: 'fail',
          content: apiResult.message || 'Registration failed, please try again',
        });
      }
    } catch (error) {
      console.error('Register error:', error);
      Toast.show({
        icon: 'fail',
        content: 'Registration failed, please try again later',
      });
    }
  });

  return useObserver(() => {
    return (
      <div className={styles.registerContainer}>
        {/* Logo 和标题区域 */}
        <div className={styles.logoSection}>
          <div className={styles.logo}>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="8.5" cy="7" r="4" />
              <line x1="20" y1="8" x2="20" y2="14" />
              <line x1="23" y1="11" x2="17" y2="11" />
            </svg>
          </div>
          <h1 className={styles.appName}>Create Account</h1>
        </div>

        {/* 表单区域 */}
        <div className={styles.formSection}>
          <form className={styles.form} onSubmit={onSubmit}>
            {/* 手机号输入框 */}
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

            {/* 验证码输入框 */}
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

            {/* 密码输入框 */}
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="password">
                Password
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
                <div className={styles.errorText}>
                  {errors.password.message}
                </div>
              )}
            </div>

            {/* 确认密码输入框 */}
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
                  placeholder="Confirm your password"
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

            {/* 昵称输入框 */}
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="nickname">
                Nickname
              </label>
              <div className={styles.inputWrapper}>
                <span className={styles.inputIcon}>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </span>
                <input
                  id="nickname"
                  type="text"
                  placeholder="Enter your nickname"
                  maxLength={20}
                  className={styles.input}
                  {...register('nickname')}
                  disabled={store.isLoading || isSubmitting}
                />
              </div>
              {errors.nickname && (
                <div className={styles.errorText}>
                  {errors.nickname.message}
                </div>
              )}
            </div>

            {/* 协议勾选 */}
            <div className={styles.agreementRow}>
              <Checkbox
                checked={agreeTerms}
                disabled={store.isLoading || isSubmitting}
                onChange={checked => setValue('agreeTerms', checked)}
              />
              <span className={styles.agreementText}>
                I have read and agree to{' '}
                <a
                  href="#"
                  className={styles.link}
                  onClick={e => {
                    e.preventDefault();
                    handleUserAgreement();
                  }}
                >
                  User Agreement
                </a>
                {' and '}
                <a
                  href="#"
                  className={styles.link}
                  onClick={e => {
                    e.preventDefault();
                    handlePrivacyPolicy();
                  }}
                >
                  Privacy Policy
                </a>
              </span>
            </div>
            {errors.agreeTerms && (
              <div className={styles.errorText}>
                {errors.agreeTerms.message}
              </div>
            )}

            {/* 注册按钮 */}
            <button
              type="submit"
              className={styles.registerButton}
              disabled={store.isLoading || isSubmitting}
            >
              {store.isLoading || isSubmitting
                ? 'Creating account...'
                : 'Sign Up'}
            </button>
          </form>
        </div>

        {/* 底部登录链接 */}
        <div className={styles.footerSection}>
          <span className={styles.loginText}>
            Already have an account?
            <a
              href="#"
              className={styles.loginLink}
              onClick={e => {
                e.preventDefault();
                handleGoToLogin();
                navigate('/login');
              }}
            >
              Sign In
            </a>
          </span>
        </div>
      </div>
    );
  });
};

Register.displayName = 'Register';

export default Register;
