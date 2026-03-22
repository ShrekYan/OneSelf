import { runInAction } from "mobx";
import { useLocalObservable } from "mobx-react";

/**
 * 忘记密码状态管理接口
 */
export interface ForgotPasswordStoreType {
  // 状态数据
  isLoading: boolean;           // 提交加载状态
  isSendingCode: boolean;        // 发送验证码状态
  countdown: number;             // 验证码倒计时
  canSendCode: boolean;          // 是否可以发送验证码

  // Setter 方法
  setIsLoading: (loading: boolean) => void;
  setIsSendingCode: (sending: boolean) => void;
  setCountdown: (countdown: number) => void;
  setCanSendCode: (canSend: boolean) => void;

  // 业务方法
  startCountdown: () => void;    // 开始倒计时
  reset: () => void;              // 重置状态
}

type UseForgotPasswordStoreType = () => ForgotPasswordStoreType;

/**
 * 忘记密码模块状态管理 Hook
 * 使用 MobX 进行状态管理，包含验证码倒计时和提交状态
 * 表单验证由 react-hook-form 处理
 */
const useForgotPasswordStore: UseForgotPasswordStoreType = () => {
  const store = useLocalObservable<ForgotPasswordStoreType>(() => ({
    isLoading: false,
    isSendingCode: false,
    countdown: 0,
    canSendCode: true,

    setIsLoading(loading: boolean) {
      store.isLoading = loading;
    },

    setIsSendingCode(sending: boolean) {
      store.isSendingCode = sending;
    },

    setCountdown(countdown: number) {
      store.countdown = countdown;
    },

    setCanSendCode(canSend: boolean) {
      store.canSendCode = canSend;
    },

    /**
     * 开始验证码倒计时
     */
    startCountdown() {
      runInAction(() => {
        store.setCanSendCode(false);
        store.setCountdown(60);
      });

      const timer = setInterval(() => {
        runInAction(() => {
          if (store.countdown > 0) {
            store.setCountdown(store.countdown - 1);
          } else {
            store.setCanSendCode(true);
            clearInterval(timer);
          }
        });
      }, 1000);
    },

    /**
     * 重置状态
     */
    reset() {
      runInAction(() => {
        store.setIsLoading(false);
        store.setIsSendingCode(false);
        store.setCountdown(0);
        store.setCanSendCode(true);
      });
    }
  }));

  return store;
};

export default useForgotPasswordStore;
