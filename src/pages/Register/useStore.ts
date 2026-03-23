import { runInAction } from "mobx";
import { useLocalObservable } from "mobx-react";
import { useEffect } from "react";
import type { RegisterFormData } from "./schema";
import { CODE_COUNTDOWN } from "./constant";

/**
 * 注册状态管理接口
 */
export interface RegisterStoreType {
  // 状态数据
  isLoading: boolean;       // 注册加载状态
  isSendingCode: boolean;   // 发送验证码加载状态
  countdown: number;        // 验证码倒计时
  codeTimer: NodeJS.Timeout | null;  // 倒计时定时器

  // 业务方法
  register: (formData: RegisterFormData) => Promise<void>;  // 注册
  sendVerifyCode: (phone: string) => Promise<void>;          // 发送验证码
  resetForm: () => void;                                     // 重置表单
  tick: () => void;                                          // 倒计时滴答
  clearTimer: () => void;                                    // 清理定时器
}

type UseRegisterStoreType = () => RegisterStoreType;

/**
 * 注册模块状态管理 Hook
 * 使用 MobX 进行状态管理，包含注册和发送验证码功能
 * 表单验证由 react-hook-form 处理
 */
const useRegisterStore: UseRegisterStoreType = () => {
  const store = useLocalObservable<RegisterStoreType>(() => ({
    isLoading: false,
    isSendingCode: false,
    countdown: 0,
    codeTimer: null,

    /**
     * 注册处理
     * @param formData - 表单数据（已通过验证）
     * @returns Promise
     */
    async register(formData: RegisterFormData) {
      console.log(formData);
      runInAction(() => {
        store.isLoading = true;
      });

      try {
        // TODO: 调用注册 API
        await new Promise(resolve => setTimeout(resolve, 1500));

        runInAction(() => {
          store.isLoading = false;
        });
      } catch (error) {
        console.error("注册失败:", error);
        runInAction(() => {
          store.isLoading = false;
        });
        throw error;
      }
    },

    /**
     * 发送验证码处理
     * @param phone - 手机号码
     * @returns Promise
     */
    async sendVerifyCode(phone: string) {
      console.log(`发送验证码到: ${phone}`);
      runInAction(() => {
        store.clearTimer();
        store.isSendingCode = true;
      });

      try {
        // TODO: 调用发送验证码 API
        await new Promise(resolve => setTimeout(resolve, 1000));

        runInAction(() => {
          store.isSendingCode = false;
          store.countdown = CODE_COUNTDOWN;
        });

        // 启动倒计时
        runInAction(() => {
          store.codeTimer = setInterval(() => {
            if (store.countdown <= 1) {
              store.clearTimer();
              runInAction(() => {
                store.countdown = 0;
              });
            } else {
              store.tick();
            }
          }, 1000);
        });
      } catch (error) {
        console.error("发送验证码失败:", error);
        runInAction(() => {
          store.isSendingCode = false;
        });
        throw error;
      }
    },

    /**
     * 倒计时滴答
     */
    tick() {
      runInAction(() => {
        store.countdown--;
      });
    },

    /**
     * 清理定时器
     */
    clearTimer() {
      if (store.codeTimer) {
        clearInterval(store.codeTimer);
        store.codeTimer = null;
      }
    },

    /**
     * 重置表单
     */
    resetForm() {
      runInAction(() => {
        store.clearTimer();
        store.countdown = 0;
      });
      // 表单重置由 react-hook-form 处理
    }
  }));

  // 组件卸载时清理定时器
  useEffect(() => {
    return () => {
      store.clearTimer();
    };
  }, [store]);

  return store;
};

export default useRegisterStore;
