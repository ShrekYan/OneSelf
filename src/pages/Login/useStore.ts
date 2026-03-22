import { runInAction } from "mobx";
import { useLocalObservable } from "mobx-react";
import type { LoginFormData } from "./schema";

/**
 * 登录状态管理接口
 */
export interface LoginStoreType {
  // 状态数据
  isLoading: boolean; // 加载状态

  // 业务方法
  login: (formData: LoginFormData) => Promise<void>; // 登录
  resetForm: () => void; // 重置表单
}

type UseLoginStoreType = () => LoginStoreType;

/**
 * 登录模块状态管理 Hook
 * 使用 MobX 进行状态管理，包含登录功能
 * 表单验证由 react-hook-form 处理
 */
const useLoginStore: UseLoginStoreType = () => {
  const store = useLocalObservable<LoginStoreType>(() => ({
    isLoading: false,

    /**
     * 登录处理
     * @param formData - 表单数据（已通过验证）
     * @returns Promise
     */
    async login(formData: LoginFormData) {
      console.log(formData);
      runInAction(() => {
        store.isLoading = true;
      });

      try {
        // TODO: 调用登录 API
        await new Promise(resolve => setTimeout(resolve, 1500));

        runInAction(() => {
          store.isLoading = false;
        });
      } catch (error) {
        console.error("登录失败:", error);
        runInAction(() => {
          store.isLoading = false;
        });
        throw error;
      }
    },

    /**
     * 重置表单
     */
    resetForm() {
      // 表单重置由 react-hook-form 处理
    }
  }));

  return store;
};

export default useLoginStore;
