import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input, Button, Checkbox, Toast } from 'antd-mobile';
import { useObserver } from 'mobx-react';
import { useEffectOnce } from 'react-use';
import { useNavigate } from 'react-router-dom';
import useStore from './useStore';
import { PAGE_TITLE, LABELS, ROUTES } from './constant';
import {
  getRememberedUsername,
  saveLoginState,
  saveToken,
  loginApi,
} from './handle';
import { loginSchema, type LoginFormData } from './schema';

import style from './index.module.scss';

/**
 * 登录页面组件
 * 功能：用户登录、表单验证、记住用户名
 */
const Login: React.FC = () => {
  const store = useStore();
  const navigate = useNavigate();

  // 使用 react-hook-form 管理表单状态和验证
  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    control,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
      rememberMe: false,
      agreeTerms: false,
    },
  });

  // 初始化时恢复记住的用户名
  useEffectOnce(() => {
    const rememberedUsername = getRememberedUsername();
    if (rememberedUsername) {
      reset({
        username: rememberedUsername,
        rememberMe: true,
      });
    }
  });

  /**
   * 处理登录提交
   * 表单验证通过后调用登录 API
   */
  const handleLogin = handleSubmit(async (formData: LoginFormData) => {
    try {
      // 调用登录 API
      const apiResult = await loginApi(formData);
      // 调用 MobX store 的 login 方法
      await store.login(formData);

      if (apiResult.success) {
        // 保存登录令牌
        saveToken(apiResult.token);
        // 保存登录状态（记住用户名）
        saveLoginState(formData);

        Toast.show({
          icon: 'success',
          content: '登录成功！',
        });

        // 跳转到首页
        navigate('/home');
      } else {
        Toast.show({
          icon: 'fail',
          content: '登录失败，请检查用户名和密码',
        });
      }
    } catch (error: unknown) {
      console.error('登录错误:', error);
      Toast.show({
        icon: 'fail',
        content: '登录失败，请稍后重试',
      });
    }
  });

  return useObserver(() => {
    return (
      <div className={style.container}>
        <div className={style['login-box']}>
          {/* 页面头部 */}
          <div className={style.header}>
            <div className={style.logo}>🔐</div>
            <h1 className={style.title}>{PAGE_TITLE}</h1>
          </div>

          {/* 登录表单 */}
          <form className={style.form} onSubmit={handleLogin}>
            {/* 用户名输入框 */}
            <div className={style['form-item']}>
              <Controller
                name="username"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <>
                    <Input
                      placeholder={LABELS.USERNAME}
                      value={value}
                      onChange={onChange}
                      disabled={store.isLoading || isSubmitting}
                      clearable
                    />
                    {errors.username && (
                      <div className={style['error-text']}>
                        {errors.username.message}
                      </div>
                    )}
                  </>
                )}
              />
            </div>

            {/* 密码输入框 */}
            <div className={style['form-item']}>
              <Controller
                name="password"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <>
                    <Input
                      type="password"
                      placeholder={LABELS.PASSWORD}
                      value={value}
                      onChange={onChange}
                      disabled={store.isLoading || isSubmitting}
                      clearable
                    />
                    {errors.password && (
                      <div className={style['error-text']}>
                        {errors.password.message}
                      </div>
                    )}
                  </>
                )}
              />
            </div>

            {/* 记住我 */}
            <div className={style['form-item']}>
              <div className={style['remember-me']}>
                <Controller
                  name="rememberMe"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <Checkbox
                      checked={value}
                      onChange={onChange}
                      disabled={store.isLoading || isSubmitting}
                    >
                      {LABELS.REMEMBER_ME}
                    </Checkbox>
                  )}
                />
                <a
                  className={style['forgot-password']}
                  onClick={() => navigate(ROUTES.FORGOT_PASSWORD)}
                >
                  {LABELS.FORGOT_PASSWORD}
                </a>
              </div>
            </div>

            {/* 登录按钮 */}
            <div className={style['form-item']}>
              <Button
                type="submit"
                color="primary"
                block
                size="large"
                loading={store.isLoading || isSubmitting}
              >
                {LABELS.LOGIN_BUTTON}
              </Button>
            </div>

            {/* 注册链接 */}
            <div className={style['sign-up']}>
              <span className={style['sign-up-text']}>还没有账号？</span>
              <a
                className={style['sign-up-link']}
                onClick={() => navigate(ROUTES.REGISTER)}
              >
                {LABELS.SIGN_UP}
              </a>
            </div>

            {/* 用户协议和隐私政策勾选 */}
            <div className={style['terms-agreement']}>
              <Controller
                name="agreeTerms"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <>
                    <Checkbox
                      checked={value}
                      onChange={onChange}
                      disabled={store.isLoading || isSubmitting}
                    >
                      <span className={style['terms-text']}>
                        {LABELS.AGREE_TERMS_PREFIX}{' '}
                        <a
                          className={style['terms-link']}
                          onClick={e => {
                            e.stopPropagation();
                            navigate(ROUTES.USER_AGREEMENT);
                          }}
                        >
                          {LABELS.USER_AGREEMENT}
                        </a>{' '}
                        {LABELS.AND}{' '}
                        <a
                          className={style['terms-link']}
                          onClick={e => {
                            e.stopPropagation();
                            navigate(ROUTES.PRIVACY_POLICY);
                          }}
                        >
                          {LABELS.PRIVACY_POLICY}
                        </a>
                      </span>
                    </Checkbox>
                    {errors.agreeTerms && (
                      <div className={style['terms-error']}>
                        {errors.agreeTerms.message}
                      </div>
                    )}
                  </>
                )}
              />
            </div>
          </form>
        </div>
      </div>
    );
  });
};

export default Login;
