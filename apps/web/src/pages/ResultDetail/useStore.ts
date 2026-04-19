import { useLocalObservable } from 'mobx-react';

export function useResultDetailStore() {
  const store = useLocalObservable(() => ({
    // 当前页面无特殊状态，留空
  }));

  return store;
}
