# 05 - 状态管理规范

项目使用 **MobX** 进行状态管理，遵循以下规范：

## 分层状态

- **全局状态**：放在 `src/store/` 目录，全局共享
- **页面级状态**：放在页面目录的 `useStore.ts`，使用 `useLocalObservable` 创建局部状态
- **组件内状态**：优先使用 React useState，只有需要响应式优化时才使用 MobX

## 使用规范

- 使用 `useLocalObservable` from `mobx-react` 创建页面级 store
- 使用 `useObserver` 进行响应式渲染
- 使用 `runInAction` 更新状态（在异步操作中）
- 必须显式定义 store 接口类型

## Store 基本结构

```tsx
import { runInAction } from "mobx";
import { useLocalObservable } from "mobx-react";

export interface MyPageStoreType {
  loading: boolean;
  setLoading: (state: boolean) => void;
  fetchData: () => Promise<void>;
}

const useMyPageStore = () => {
  const store = useLocalObservable<MyPageStoreType>(() => ({
    loading: false,

    setLoading(state: boolean) {
      this.loading = state;
    },

    async fetchData() {
      runInAction(() => {
        this.loading = true;
      });

      try {
        // 获取数据...
      } finally {
        runInAction(() => {
          this.loading = false;
        });
      }
    }
  }));

  return store;
};

export default useMyPageStore;
```

## 在组件中使用

```tsx
import React from "react";
import { useObserver } from "mobx-react";
import useStore from "./useStore";

const MyPage: React.FC = () => {
  const store = useStore();

  return useObserver(() => (
    <div>
      {store.loading ? <Loading /> : <Content />}
    </div>
  ));
};
```
