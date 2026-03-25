import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useObserver } from 'mobx-react';
import useStore from './useStore';
import {
  BRAND_NAME,
  PAGE_TITLE,
  PAGE_SUBTITLE,
  QUOTE_TEXT,
  USER_NAME,
  USER_TITLE,
  EMAIL_PLACEHOLDER,
  PASSWORD_PLACEHOLDER,
  FORGOT_PASSWORD,
  SIGN_IN,
  OR_CONTINUE_WITH,
  GITHUB,
  TWITTER,
  NO_ACCOUNT,
  SIGN_UP,
} from './constant';
import { loginSchema, type LoginFormData } from './schema';
import {
  loginApi,
  saveToken,
  handleGithubLogin,
  handleTwitterLogin,
  handleForgotPassword,
  handleSignUp,
  type LoginApiResponse,
} from './handle';
import styles from './index.module.scss';
import { Toast } from 'antd-mobile';

/**
 * PC 端登录页面组件
 * 功能：分屏登录页面，左侧品牌宣传，右侧登录表单
 */
const PCLogin: React.FC = () => {
  const store = useStore();

  // 使用 react-hook-form 管理表单状态和验证
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  /**
   * 处理登录提交
   * 表单验证通过后调用登录 API
   */
  const onSubmit = handleSubmit(async (formData: LoginFormData) => {
    try {
      await store.login(formData);
      const apiResult: LoginApiResponse = await loginApi(formData);

      if (apiResult.success) {
        saveToken(apiResult.token);
        Toast.show({
          icon: 'success',
          content: '登录成功！',
        });
        // 跳转到首页
        setTimeout(() => {
          window.location.href = '/';
        }, 1000);
      } else {
        Toast.show({
          icon: 'fail',
          content: apiResult.message || '登录失败，请检查邮箱和密码',
        });
      }
    } catch (error) {
      console.error('登录错误:', error);
      Toast.show({
        icon: 'fail',
        content: '登录失败，请稍后重试',
      });
    }
  });

  return useObserver(() => {
    return (
      <div className={styles.container}>
        {/* 左侧紫色宣传区域 */}
        <div className={styles.leftPanel}>
          {/* Logo 和品牌名称 */}
          <div className={styles.brand}>
            <div className={styles.logo}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"
                  fill="#8c44ff"
                />
              </svg>
            </div>
            <span className={styles.brandName}>{BRAND_NAME}</span>
          </div>

          {/* 引用文案 */}
          <div className={styles.testimonial}>
            <blockquote className={styles.quote}>{QUOTE_TEXT}</blockquote>
            <div className={styles.author}>
              <div className={styles.avatar}>
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face"
                  alt={USER_NAME}
                  className={styles.avatarImg}
                />
              </div>
              <div className={styles.authorInfo}>
                <div className={styles.authorName}>{USER_NAME}</div>
                <div className={styles.authorTitle}>{USER_TITLE}</div>
              </div>
            </div>
          </div>
        </div>

        {/* 右侧白色登录表单区域 */}
        <div className={styles.rightPanel}>
          <div className={styles.loginCard}>
            {/* 标题区域 */}
            <div className={styles.header}>
              <h1 className={styles.title}>{PAGE_TITLE}</h1>
              <p className={styles.subtitle}>{PAGE_SUBTITLE}</p>
            </div>

            {/* 登录表单 */}
            <form className={styles.form} onSubmit={onSubmit}>
              {/* 邮箱输入框 */}
              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="email">
                  Email
                </label>
                <div className={styles.inputWrapper}>
                  <span className={styles.inputIcon}>
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <rect x="2" y="4" width="20" height="16" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                  </span>
                  <input
                    id="email"
                    type="email"
                    placeholder={EMAIL_PLACEHOLDER}
                    className={styles.input}
                    {...register('email')}
                    disabled={store.isLoading || isSubmitting}
                  />
                </div>
                {errors.email && (
                  <div className={styles.errorText}>{errors.email.message}</div>
                )}
              </div>

              {/* 密码输入框 */}
              <div className={styles.formGroup}>
                <div className={styles.passwordRow}>
                  <label className={styles.label} htmlFor="password">
                    Password
                  </label>
                  <a
                    href="#"
                    className={styles.forgotLink}
                    onClick={e => {
                      e.preventDefault();
                      handleForgotPassword();
                    }}
                  >
                    {FORGOT_PASSWORD}
                  </a>
                </div>
                <div className={styles.inputWrapper}>
                  <span className={styles.inputIcon}>
                    <svg
                      width="20"
                      height="20"
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
                    placeholder={PASSWORD_PLACEHOLDER}
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
                        width="20"
                        height="20"
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
                        width="20"
                        height="20"
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

              {/* 登录按钮 */}
              <button
                type="submit"
                className={styles.signInButton}
                disabled={store.isLoading || isSubmitting}
              >
                {store.isLoading || isSubmitting ? 'Signing in...' : SIGN_IN}
              </button>
            </form>

            {/* 分隔线 */}
            <div className={styles.divider}>
              <div className={styles.dividerLine} />
              <span className={styles.dividerText}>{OR_CONTINUE_WITH}</span>
              <div className={styles.dividerLine} />
            </div>

            {/* 第三方登录按钮 */}
            <div className={styles.socialButtons}>
              <button
                type="button"
                className={styles.socialButton}
                onClick={handleGithubLogin}
              >
                <span className={styles.socialIcon}>
                  <svg
                    viewBox="0 0 24 24"
                    width="20"
                    height="20"
                    fill="currentColor"
                  >
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                </span>
                {GITHUB}
              </button>
              <button
                type="button"
                className={styles.socialButton}
                onClick={handleTwitterLogin}
              >
                <span className={styles.socialIcon}>
                  <svg
                    viewBox="0 0 24 24"
                    width="20"
                    height="20"
                    fill="currentColor"
                  >
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                </span>
                {TWITTER}
              </button>
            </div>

            {/* 底部注册链接 */}
            <div className={styles.footer}>
              <span className={styles.footerText}>
                {NO_ACCOUNT}
                <a
                  href="#"
                  className={styles.signUpLink}
                  onClick={e => {
                    e.preventDefault();
                    handleSignUp();
                  }}
                >
                  {SIGN_UP}
                </a>
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  });
};

export default PCLogin;
