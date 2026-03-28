/**
 * 持久化存储用户信息的自定义 Hook
 * 简化版本：仅提供核心的保存/获取/清除功能
 */

import { useLocalObservable } from 'mobx-react';
import { useMemo } from 'react';

export interface PersistentUserOptions<T> {
  /** 存储在 localStorage 中的 key，默认为 'current_user' */
  storageKey?: string;
  /** 默认值，当存储为空或解析失败时返回 */
  defaultValue?: T | null;
}

/**
 * 持久化存储用户信息 Hook
 * @param options - 配置选项
 * @returns 用户信息和操作方法
 *
 * @example
 * ```ts
 * interface UserInfo {
 *   id: string;
 *   nickname: string;
 *   avatar: string;
 *   token: string;
 * }
 *
 * const { user, setUser, clearUser } = usePersistentUser<UserInfo>({
 *   defaultValue: null,
 * });
 *
 * // 保存用户信息
 * setUser(userData);
 *
 * // 清除用户信息
 * clearUser();
 * ```
 */
export function usePersistentUser<T = unknown>(
  options: PersistentUserOptions<T> = {},
) {
  const { storageKey = 'current_user', defaultValue = null } = options;

  const store = useLocalObservable(() => {
    // 初始化：从 localStorage 读取数据
    const initialValue = ((): T | null => {
      try {
        const stored = localStorage.getItem(storageKey);
        if (!stored) {
          return defaultValue;
        }
        return JSON.parse(stored) as T;
      } catch {
        // 解析失败，返回默认值
        return defaultValue;
      }
    })();

    let user: T | null = initialValue;

    return {
      get user() {
        return user;
      },

      /**
       * 保存用户信息到 localStorage
       */
      setUser: (newUser: T): void => {
        user = newUser;
        try {
          localStorage.setItem(storageKey, JSON.stringify(newUser));
        } catch {
          // 存储失败（如隐私模式禁用 localStorage），静默处理
          // 内存中仍保留数据，不影响当前页面使用
        }
      },

      /**
       * 清除用户信息
       */
      clearUser: (): void => {
        user = null;
        try {
          localStorage.removeItem(storageKey);
        } catch {
          // 清除失败静默处理
        }
      },
    };
  });

  // 使用 useMemo 保证返回对象引用稳定
  return useMemo(
    () => ({
      get user() {
        return store.user;
      },
      setUser: store.setUser,
      clearUser: store.clearUser,
    }),
    [store],
  );
}

export default usePersistentUser;
