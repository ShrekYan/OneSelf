import React, { useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input, Button, Toast } from "antd-mobile";
import { useObserver } from "mobx-react";
import useStore from "./useStore";
import { PAGE_TITLE, PAGE_DESCRIPTION, LABELS, MESSAGES } from "./constant";
import {
  sendVerificationCode,
  submitForgotPassword,
  formatCountdown
} from "./handle";
import { forgotPasswordSchema, type ForgotPasswordFormData } from "./schema";
import style from "./index.module.scss";

/**
 * 忘记密码页面组件
 * 功能：用户忘记密码时重置密码，需要验证码验证
 */
const ForgotPassword: React.FC = () => {
  const store = useStore();

  // 使用 react-hook-form 管理表单状态和验证
  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    control,
    getValues
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      username: "",
      email: "",
      phone: "",
      verificationCode: ""
    }
  });

  /**
   * 处理发送验证码
   * 检查手机号是否有效，然后发送验证码
   */
  const handleSendCode = useCallback(async () => {
    const phone = getValues("phone");
    console.log(reset);
    // 简单验证手机号格式
    if (!phone || !/^1[3-9]\d{9}$/.test(phone)) {
      Toast.show({
        icon: "fail",
        content: "请先输入有效的手机号码"
      });
      return;
    }

    if (store.isSendingCode || !store.canSendCode) {
      return;
    }

    store.setIsSendingCode(true);

    try {
      const result = await sendVerificationCode(phone);

      if (result.success) {
        Toast.show({
          icon: "success",
          content: MESSAGES.CODE_SENT
        });
        store.startCountdown();
      } else {
        Toast.show({
          icon: "fail",
          content: MESSAGES.CODE_FAILED
        });
      }
    } catch (error) {
      console.error("发送验证码失败:", error);
      Toast.show({
        icon: "fail",
        content: MESSAGES.CODE_FAILED
      });
    } finally {
      store.setIsSendingCode(false);
    }
  }, [store, getValues]);

  /**
   * 处理表单提交
   * 表单验证通过后调用重置密码 API
   */
  const handleSubmitForm = handleSubmit(async (formData: ForgotPasswordFormData) => {
    try {
      store.setIsLoading(true);

      // 调用重置密码 API
      const result = await submitForgotPassword(formData);

      if (result.success) {
        Toast.show({
          icon: "success",
          content: MESSAGES.SUCCESS
        });

        // 延迟跳转到登录页
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
      } else {
        Toast.show({
          icon: "fail",
          content: result.message || MESSAGES.SUBMIT_FAILED
        });
      }
    } catch (error) {
      console.error("提交失败:", error);
      Toast.show({
        icon: "fail",
        content: MESSAGES.SUBMIT_FAILED
      });
    } finally {
      store.setIsLoading(false);
    }
  });

  /**
   * 返回登录页
   */
  const handleBackToLogin = useCallback(() => {
    window.location.href = "/login";
  }, []);

  return useObserver(() => {
    return (
      <div className={style.container}>
        <div className={style.forgotPasswordBox}>
          {/* 页面头部 */}
          <div className={style.header}>
            <div className={style.logo}>🔐</div>
            <h1 className={style.title}>{PAGE_TITLE}</h1>
            <p className={style.description}>{PAGE_DESCRIPTION}</p>
          </div>

          {/* 忘记密码表单 */}
          <form className={style.form} onSubmit={handleSubmitForm}>
            {/* 用户名输入框 */}
            <div className={style.formItem}>
              <label className={style.formLabel}>{LABELS.USERNAME}</label>
              <Controller
                name="username"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <>
                    <Input
                      placeholder={`请输入${LABELS.USERNAME}`}
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

            {/* 邮箱地址输入框 */}
            <div className={style.formItem}>
              <label className={style.formLabel}>{LABELS.EMAIL}</label>
              <Controller
                name="email"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <>
                    <Input
                      placeholder={`请输入${LABELS.EMAIL}`}
                      value={value}
                      onChange={onChange}
                      disabled={store.isLoading || isSubmitting}
                      clearable
                    />
                    {errors.email && (
                      <div className={style.errorText}>{errors.email.message}</div>
                    )}
                  </>
                )}
              />
            </div>

            {/* 手机号码输入框 */}
            <div className={style.formItem}>
              <label className={style.formLabel}>{LABELS.PHONE}</label>
              <Controller
                name="phone"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <>
                    <Input
                      placeholder={`请输入${LABELS.PHONE}`}
                      value={value}
                      onChange={onChange}
                      disabled={store.isLoading || isSubmitting}
                      clearable
                    />
                    {errors.phone && (
                      <div className={style.errorText}>{errors.phone.message}</div>
                    )}
                  </>
                )}
              />
            </div>

            {/* 验证码输入框 */}
            <div className={style.formItem}>
              <label className={style.formLabel}>{LABELS.VERIFICATION_CODE}</label>
              <div className={style.verificationCodeContainer}>
                <div className={style.verificationCodeInput}>
                  <Controller
                    name="verificationCode"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <>
                        <Input
                          placeholder={`请输入${LABELS.VERIFICATION_CODE}`}
                          value={value}
                          onChange={onChange}
                          disabled={store.isLoading || isSubmitting}
                          clearable
                          maxLength={6}
                        />
                        {errors.verificationCode && (
                          <div className={style.errorText}>
                            {errors.verificationCode.message}
                          </div>
                        )}
                      </>
                    )}
                  />
                </div>
                <Button
                  className={style.sendCodeButton}
                  color="primary"
                  size="small"
                  onClick={handleSendCode}
                  disabled={
                    store.isLoading ||
                    isSubmitting ||
                    store.isSendingCode ||
                    !store.canSendCode
                  }
                  loading={store.isSendingCode}
                >
                  {store.canSendCode
                    ? LABELS.SEND_CODE
                    : formatCountdown(store.countdown)}
                </Button>
              </div>
            </div>

            {/* 提交按钮 */}
            <div className={style.formItem}>
              <Button
                type="submit"
                color="primary"
                block
                size="large"
                loading={store.isLoading || isSubmitting}
              >
                {LABELS.SUBMIT_BUTTON}
              </Button>
            </div>
          </form>

          {/* 底部链接 */}
          <div className={style.footer}>
            <div className={style.backToLogin}>
              记得密码？
              <a className={style.backToLoginLink} onClick={handleBackToLogin}>
                {LABELS.BACK_TO_LOGIN}
              </a>
            </div>

            {/* 温馨提示 */}
            <div className={style.tips}>
              <div className={style.tipsTitle}>💡 温馨提示</div>
              <div>
                1. 请确保输入的用户名、邮箱和手机号均为注册时的信息<br/>
                2. 验证码有效期为 10 分钟<br/>
                3. 重置链接将通过邮箱和短信发送，请注意查收<br/>
                4. 如有疑问，请联系客服
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  });
};

export default ForgotPassword;
