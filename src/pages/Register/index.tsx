import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input, Button, Checkbox, Toast } from "antd-mobile";
import { useObserver } from "mobx-react";
import { useNavigate } from "react-router-dom";
import useStore from "./useStore";
import { PAGE_TITLE, LABELS, REGEX } from "./constant";
import { sendVerifyCodeApi, registerApi, saveToken } from "./handle";
import { registerSchema, type RegisterFormData } from "./schema";
import style from "./index.module.scss";

/**
 * 注册页面组件
 * 功能：用户注册、手机号验证码、表单验证、密码确认
 */
const Register: React.FC = () => {
  const store = useStore();
  const navigate = useNavigate();

  // 使用 react-hook-form 管理表单状态和验证
  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
    watch
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      phone: "",
      verifyCode: "",
      password: "",
      confirmPassword: "",
      agreement: false
    }
  });

  // 监听手机号用于发送验证码验证
  const phoneValue = watch("phone");

  /**
   * 处理发送验证码
   */
  const handleSendCode = async () => {
    // 先验证手机号格式
    if (!phoneValue || phoneValue.length !== 11 || !REGEX.PHONE.test(phoneValue)) {
      Toast.show({
        icon: "fail",
        content: "请输入正确的手机号码"
      });
      return;
    }

    try {
      await store.sendVerifyCode(phoneValue);
      await sendVerifyCodeApi(phoneValue);
      Toast.show({
        icon: "success",
        content: "验证码已发送"
      });
    } catch (error) {
      console.error("发送验证码失败:", error);
      Toast.show({
        icon: "fail",
        content: "发送验证码失败，请稍后重试"
      });
    }
  };

  /**
   * 处理注册提交
   * 表单验证通过后调用注册 API
   */
  const handleRegister = handleSubmit(async (formData: RegisterFormData) => {
    try {
      // 调用注册 API
      const apiResult = await registerApi(formData);
      // 调用 MobX store 的 register 方法
      await store.register(formData);

      if (apiResult.success && apiResult.token) {
        // 保存登录令牌
        saveToken(apiResult.token);

        Toast.show({
          icon: "success",
          content: apiResult.message || "注册成功！"
        });

        // 跳转到首页
        setTimeout(() => {
          window.location.href = "/home";
        }, 1000);
      } else {
        Toast.show({
          icon: "fail",
          content: apiResult.message || "注册失败，请稍后重试"
        });
      }
    } catch (error) {
      console.error("注册错误:", error);
      Toast.show({
        icon: "fail",
        content: "注册失败，请稍后重试"
      });
    }
  });

  return useObserver(() => {
    return (
      <div className={style.container}>
        <div className={style.registerBox}>
          {/* 页面头部 */}
          <div className={style.header}>
            <div className={style.logo}>📝</div>
            <h1 className={style.title}>{PAGE_TITLE}</h1>
          </div>

          {/* 注册表单 */}
          <form className={style.form} onSubmit={handleRegister}>
            {/* 用户名输入框 */}
            <div className={style.formItem}>
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
                      <div className={style.errorText}>{errors.username.message}</div>
                    )}
                  </>
                )}
              />
            </div>

            {/* 手机号输入框 */}
            <div className={style.formItem}>
              <Controller
                name="phone"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <>
                    <Input
                      type="tel"
                      placeholder={LABELS.PHONE}
                      value={value}
                      onChange={onChange}
                      disabled={store.isLoading || isSubmitting}
                      clearable
                      maxLength={11}
                    />
                    {errors.phone && (
                      <div className={style.errorText}>{errors.phone.message}</div>
                    )}
                  </>
                )}
              />
            </div>

            {/* 验证码输入框 + 发送按钮 */}
            <div className={style.formItem}>
              <div className={style.verifyCodeRow}>
                <div className={style.verifyCodeInput}>
                  <Controller
                    name="verifyCode"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <>
                        <Input
                          type="number"
                          placeholder={LABELS.VERIFY_CODE}
                          value={value}
                          onChange={onChange}
                          disabled={store.isLoading || isSubmitting}
                          clearable
                          maxLength={6}
                        />
                        {errors.verifyCode && (
                          <div className={style.errorText}>{errors.verifyCode.message}</div>
                        )}
                      </>
                    )}
                  />
                </div>
                <Button
                  className={style.codeButton}
                  color="primary"
                  size="large"
                  disabled={store.isLoading || isSubmitting || store.countdown > 0 || store.isSendingCode}
                  loading={store.isSendingCode}
                  onClick={handleSendCode}
                >
                  {store.countdown > 0 ? `${store.countdown}s后重发` : LABELS.SEND_CODE}
                </Button>
              </div>
            </div>

            {/* 密码输入框 */}
            <div className={style.formItem}>
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
                      <div className={style.errorText}>{errors.password.message}</div>
                    )}
                  </>
                )}
              />
            </div>

            {/* 确认密码输入框 */}
            <div className={style.formItem}>
              <Controller
                name="confirmPassword"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <>
                    <Input
                      type="password"
                      placeholder={LABELS.CONFIRM_PASSWORD}
                      value={value}
                      onChange={onChange}
                      disabled={store.isLoading || isSubmitting}
                      clearable
                    />
                    {errors.confirmPassword && (
                      <div className={style.errorText}>{errors.confirmPassword.message}</div>
                    )}
                  </>
                )}
              />
            </div>

            {/* 用户协议 */}
            <div className={style.formItem}>
              <div className={style.agreement}>
                <Controller
                  name="agreement"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <Checkbox
                      checked={value}
                      onChange={onChange}
                      disabled={store.isLoading || isSubmitting}
                    />
                  )}
                />
                <span>
                  {LABELS.AGREEMENT}{" "}
                  <a
                    href="#"
                    onClick={(e) => e.preventDefault()}
                  >
                    {LABELS.TERMS}
                  </a>{" "}
                  和{" "}
                  <a
                    href="#"
                    onClick={(e) => e.preventDefault()}
                  >
                    {LABELS.PRIVACY}
                  </a>
                </span>
              </div>
              {errors.agreement && (
                <div className={style.errorText}>{errors.agreement.message}</div>
              )}
            </div>

            {/* 注册按钮 */}
            <div className={style.formItem}>
              <Button
                type="submit"
                color="primary"
                block
                size="large"
                loading={store.isLoading || isSubmitting}
              >
                {LABELS.SIGN_UP_BUTTON}
              </Button>
            </div>

            {/* 去登录链接 */}
            <div className={style.loginLink}>
              <span className={style.loginText}>{LABELS.LOGIN_PREFIX}，</span>
              <a
                className={style.loginLinkAnchor}
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/login");
                }}
              >
                {LABELS.LOGIN_SUFFIX}
              </a>
            </div>
          </form>
        </div>
      </div>
    );
  });
};

export default Register;
