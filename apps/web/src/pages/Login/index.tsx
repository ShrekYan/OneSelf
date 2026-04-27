/**
 * 移动端登录页面
 * @description 移动端用户登录页面，包含手机号/用户名、密码输入、协议勾选等功能
 */
import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useObserver } from 'mobx-react';
import { Checkbox, Toast } from 'antd-mobile';
import { useLoginStore } from './useStore';
import { loginSchema, type LoginFormData } from './schema';
import {
  handleForgotPassword,
  handleRegister,
  handleUserAgreement,
  handlePrivacyPolicy,
} from './handle';
import { safeRedirectUrl } from '@/utils/security';
import styles from './index.module.scss';

/**
 * 移动端登录页面组件
 */
const Login: React.FC = () => {
  const store = useLoginStore();
  const navigate = useNavigate();

  // 使用 react-hook-form 管理表单状态和验证
  const {
    handleSubmit,
    register,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
      agreeTerms: false,
    },
  });

  /**
   * 从 URL query 获取安全的重定向地址
   * 使用安全验证函数防止开放重定向攻击
   */
  const getRedirectUrl = (): string => {
    const params = new URLSearchParams(window.location.search);
    const redirect = params.get('redirect');
    return safeRedirectUrl(redirect);
  };

  // 监听协议勾选状态
  const agreeTerms = watch('agreeTerms');

  /**
   * 跳转到注册页面
   */
  const goToRegister = useCallback(() => {
    navigate('/register');
  }, [navigate]);

  /**
   * 跳转到忘记密码页面
   */
  const goToForgotPassword = useCallback(() => {
    navigate('/forgot-password');
  }, [navigate]);

  /**
   * 处理忘记密码点击
   */
  const handleForgotPasswordClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    handleForgotPassword();
    goToForgotPassword();
  }, [goToForgotPassword, handleForgotPassword]);

  /**
   * 处理用户协议点击
   */
  const handleUserAgreementClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    handleUserAgreement();
    Toast.show({
      content: 'Open user agreement page',
      position: 'bottom',
    });
  }, [handleUserAgreement]);

  /**
   * 处理隐私政策点击
   */
  const handlePrivacyPolicyClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    handlePrivacyPolicy();
    Toast.show({
      content: 'Open privacy policy page',
      position: 'bottom',
    });
  }, [handlePrivacyPolicy]);

  /**
   * 处理注册链接点击
   */
  const handleRegisterLinkClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    handleRegister();
    goToRegister();
  }, [goToRegister, handleRegister]);

  /**
   * 处理登录提交
   * 表单验证通过后调用登录 API
   */
  const onSubmit = handleSubmit(async (formData: LoginFormData) => {
    try {
      const apiResult = await store.login(formData);
      console.log(apiResult);
      if (apiResult.success) {
        Toast.show({
          icon: 'success',
          content: 'Login successful!',
        });
        // 登录成功，跳转到重定向地址或首页
        setTimeout(() => {
          const redirectTo = getRedirectUrl();
          navigate(redirectTo);
        }, 1000);
      } else {
        Toast.show({
          icon: 'fail',
          content:
            apiResult.message ||
            'Login failed, please check your account and password',
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      Toast.show({
        icon: 'fail',
        content: 'Login failed, please try again later',
      });
    }
  });

  return useObserver(() => {
    return (
      <div className={styles.loginRoot}>
        {/* Logo 和标题区域 */}
        <div className={styles.logoSection}>
          <div className={styles.logo}>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" />
            </svg>
          </div>
          <h1 className={styles.appName}>Welcome</h1>
        </div>

        {/* 表单区域 */}
        <div className={styles.formSection}>
          <form className={styles.form} onSubmit={onSubmit}>
            {/* 账号输入框 */}
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="username">
                Username/Phone
              </label>
              <div className={styles.inputWrapper}>
                <span className={styles.inputIcon}>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                  </svg>
                </span>
                <input
                  id="username"
                  type="text"
                  placeholder="Enter username or phone"
                  className={styles.input}
                  {...register('username')}
                  disabled={store.isLoading || isSubmitting}
                />
              </div>
              {errors.username && (
                <div className={styles.errorText}>
                  {errors.username.message}
                </div>
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
                  placeholder="Enter password"
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

            {/* 忘记密码 */}
            <div className={styles.forgotRow}>
              <a
                href="#"
                className={styles.forgotLink}
                onClick={handleForgotPasswordClick}
              >
                Forgot Password
              </a>
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
                  onClick={handleUserAgreementClick}
                >
                  User Agreement
                </a>
                {' and '}
                <a
                  href="#"
                  className={styles.link}
                  onClick={handlePrivacyPolicyClick}
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

            {/* 登录按钮 */}
            <button
              type="submit"
              className={styles.loginButton}
              disabled={store.isLoading || isSubmitting}
            >
              {store.isLoading || isSubmitting ? 'Logging in...' : 'Login'}
            </button>

            {/* 注册按钮 */}
            <button
              type="button"
              className={styles.registerButton}
              disabled={store.isLoading || isSubmitting}
              onClick={goToRegister}
            >
              Sign Up
            </button>
          </form>
        </div>

        {/* 底部注册提示 */}
        <div className={styles.footerSection}>
          <span className={styles.registerText}>
            Don't have an account?
            <a
              href="#"
              className={styles.registerLink}
              onClick={handleRegisterLinkClick}
            >
              Sign Up
            </a>
          </span>
        </div>
      </div>
    );
  });
};

Login.displayName = 'Login';

export default Login;
