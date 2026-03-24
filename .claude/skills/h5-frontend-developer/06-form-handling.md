# 06 - 表单处理规范

项目使用 **React Hook Form + Zod** 处理表单，遵循以下规范。

## 整体架构

| 层次 | 职责 | 文件 |
|------|------|------|
| Schema 层 | 验证规则定义 | `schema.ts` |
| 常量层 | 标签、配置常量 | `constant.ts` |
| 业务逻辑层 | API 调用、工具函数 | `handle.ts` |
| 状态管理层 | 业务状态管理 | `useStore.ts` |
| 视图层 | 表单渲染交互 | `index.tsx` |

---

## 步骤一：定义验证 Schema（schema.ts）

使用 **Zod** 定义验证规则，并从 Schema 推断表单类型：

```tsx
import z from "zod";

/**
 * 登录表单验证 Schema
 * 使用 zod 进行表单验证
 */
export const loginSchema = z.object({
  username: z
    .string()
    .min(2, "用户名至少需要2个字符")
    .max(20, "用户名不能超过20个字符")
    .trim(),
  password: z
    .string()
    .min(6, "密码至少需要6个字符")
    .max(20, "密码不能超过20个字符")
    .trim(),
  rememberMe: z.boolean()
});

/**
 * 登录表单类型（从 Schema 推断）
 */
export type LoginFormData = z.infer<typeof loginSchema>;
```

---

## 步骤二：定义表单常量（constant.ts）

将页面标题、标签、验证规则等配置抽离为常量：

```tsx
/**
 * Login 模块常量定义
 */

// ==================== 页面配置 ====================
export const PAGE_TITLE = "登录";

// ==================== 表单字段字段标识 ====================
export const FORM_FIELDS = {
  USERNAME: "username",
  PASSWORD: "password",
  REMEMBER_ME: "rememberMe"
} as const;

// ==================== 表单标签 ====================
export const LABELS = {
  USERNAME: "用户名",
  PASSWORD: "密码",
  REMEMBER_ME: "记住我",
  LOGIN_BUTTON: "登录",
  FORGOT_PASSWORD: "忘记密码？",
  SIGN_UP: "立即注册"
} as const;

// ==================== 验证规则 ====================
export const VALIDATION = {
  USERNAME_MIN_LENGTH: 2,
  USERNAME_MAX_LENGTH: 20,
  PASSWORD_MIN_LENGTH: 6,
  PASSWORD_MAX_LENGTH: 20
} as const;

// ==================== 配色方案 ====================
export const COLORS = {
  PRIMARY: "#1890ff",
  SUCCESS: "#52c41a",
  ERROR: "#ff4d4f",
  WARNING: "#faad14"
} as const;
```

---

## 步骤三：业务逻辑与 API（handle.ts）

将 API 调用、本地存储操作等业务逻辑抽离到 `handle.ts`：

```tsx
import type { LoginFormData } from "./schema";

/**
 * 登录 API 响应类型
 */
export interface LoginApiResponse {
  success: boolean; // 登录是否成功
  token: string;   // 登录令牌
}

/**
 * 登录 API
 * @param formData - 登录表单数据
 * @returns 登录响应数据
 */
export const loginApi = async (formData: LoginFormData): Promise<LoginApiResponse> => {
  // 实际项目中调用真正的 API
  return new Promise((resolve) => {
    setTimeout(() => {
      if (formData.username && formData.password) {
        resolve({
          success: true,
          token: `mock_token_${Date.now()}`
        });
      } else {
        resolve({
          success: false,
          token: ""
        });
      }
    }, 1500);
  });
};

/**
 * 保存登录状态
 * 根据记住我选项保存用户名到本地存储
 * @param formData - 登录表单数据
 */
export const saveLoginState = (formData: LoginFormData): void => {
  if (formData.rememberMe) {
    localStorage.setItem("rememberedUsername", formData.username);
  } else {
    localStorage.removeItem("rememberedUsername");
  }
};

/**
 * 获取已记住的用户名
 * @returns 已保存的用户名，未保存返回空字符串
 */
export const getRememberedUsername = (): string => {
  return localStorage.getItem("rememberedUsername") || "";
};

/**
 * 保存登录令牌
 * @param token - 登录令牌
 */
export const saveToken = (token: string): void => {
  localStorage.setItem("authToken", token);
};
```

---

## 步骤四：状态管理（useStore.ts）

使用 MobX 管理表单相关的业务状态（登录 loading 等）：

```tsx
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
```

---

## 步骤五：表单组件实现（index.tsx）

使用 **react-hook-form** + **zodResolver** 渲染表单：

```tsx
import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input, Button, Checkbox, Toast } from "antd-mobile";
import { useObserver } from "mobx-react";
import { useEffectOnce } from "react-use";
import useStore from "./useStore";
import { PAGE_TITLE, LABELS } from "./constant";
import { getRememberedUsername, saveLoginState, saveToken, loginApi } from "./handle";
import { loginSchema, type LoginFormData } from "./schema";
import styles from "./index.module.scss";

/**
 * 登录页面组件
 * 功能：用户登录、表单验证、记住用户名
 */
const Login: React.FC = () => {
  const store = useStore();

  // 使用 react-hook-form 管理表单状态和验证
  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    control
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
      rememberMe: false
    }
  });

  // 初始化时恢复记住的用户名
  useEffectOnce(() => {
    const rememberedUsername = getRememberedUsername();
    if (rememberedUsername) {
      reset({
        username: rememberedUsername,
        rememberMe: true
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
          icon: "success",
          content: "登录成功！"
        });

        // 跳转到首页
        window.location.href = "/home";
      } else {
        Toast.show({
          icon: "fail",
          content: "登录失败，请检查用户名和密码"
        });
      }
    } catch (error) {
      console.error("登录错误:", error);
      Toast.show({
        icon: "fail",
        content: "登录失败，请稍后重试"
      });
    }
  });

  return useObserver(() => {
    return (
      <div className={styles.container}>
        <div className={styles.loginBox}>
          {/* 页面头部 */}
          <div className={styles.header}>
            <div className={styles.logo}>🔐</div>
            <h1 className={styles.title}>{PAGE_TITLE}</h1>
          </div>

          {/* 登录表单 */}
          <form className={styles.form} onSubmit={handleLogin}>
            {/* 用户名输入框 */}
            <div className={styles.formItem}>
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
                      <div className={styles.errorText}>{errors.username.message}</div>
                    )}
                  </>
                )}
              />
            </div>

            {/* 密码输入框 */}
            <div className={styles.formItem}>
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
                      <div className={styles.errorText}>{errors.password.message}</div>
                    )}
                  </>
                )}
              />
            </div>

            {/* 记住我 */}
            <div className={styles.formItem}>
              <div className={styles.rememberMe}>
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
                <a className={styles.forgotPassword} href="#">
                  {LABELS.FORGOT_PASSWORD}
                </a>
              </div>
            </div>

            {/* 登录按钮 */}
            <div className={styles.formItem}>
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
            <div className={styles.signUp}>
              <span className={styles.signUpText}>还没有账号？</span>
              <a className={styles.signUpLink} href="#">
                {LABELS.SIGN_UP}
              </a>
            </div>
          </form>
        </div>
      </div>
    );
  });
};

export default Login;
```

---

## 核心要点总结

1. **表单验证**：使用 `zod` 定义验证 Schema，通过 `z.infer` 推断表单数据类型
2. **表单管理**：使用 `react-hook-form` 的 `useForm` 管理表单状态
3. **验证集成**：使用 `zodResolver` 将 Zod Schema 集成到 react-hook-form
4. **受控组件**：使用 `Controller` 包装 Ant Design Mobile 的表单组件
5. **表单重置**：使用 `reset` 方法恢复表单到初始状态或指定值
6. **提交处理**：使用 `handleSubmit` 包装提交函数，确保验证通过后才执行
7. **加载状态**：结合 `isSubmitting` 和 Store 的 `isLoading` 控制 loading 状态
8. **错误展示**：通过 `formState.errors` 获取验证错误信息
9. **类型安全**：全程使用 TypeScript 类型，确保表单数据类型正确
