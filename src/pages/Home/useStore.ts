import { useLocalObservable } from 'mobx-react';

/**
 * 首页局部状态 Store 类型定义
 */
export interface MobxStoreType {
  /** 测试按钮加载状态 */
  testLoading: boolean;
  /** 设置加载状态 */
  setTestLoading: (value: boolean) => void;
  /** 测试按钮点击处理（模拟异步加载） */
  handleTestClick: () => Promise<void>;
}

/**
 * 首页局部 MobX Store - 使用 useLocalObservable 管理页面局部状态
 * @description 这是一个演示示例，展示 MobX 异步加载状态管理用法
 * @returns Store 实例
 */
const useMobxStore = () => {
  const store = useLocalObservable(() => ({
    testLoading: false,

    setTestLoading(value: boolean) {
      this.testLoading = value;
    },

    async handleTestClick() {
      this.setTestLoading(true);

      try {
        // 模拟 2 秒异步加载
        await new Promise(resolve => setTimeout(resolve, 2000));
        this.setTestLoading(false);
      } catch (e: unknown) {
        console.error('handleTestClick error:', e);
        this.setTestLoading(false);
      }
    },
  }));

  return store;
};

export default useMobxStore;
