
import { useLocalObservable } from 'mobx-react';
import type { TabType, TransactionItem } from './index';

export function useTransactionRecordStore() {
  const store = useLocalObservable(() => ({
    // 当前激活的 Tab
    activeTab: 'inTransit' as TabType,

    // 模拟交易列表数据（实际应该从 API 获取）
    transactionList: [
      {
        id: '1',
        name: '购买-长盈计划第1期',
        time: '2023–09-13  14:00',
        amount: '1000.00元',
        status: '预约买入中',
      },
    ] as TransactionItem[],

    // 设置激活 Tab
    setActiveTab: (tab: TabType) => {
      store.activeTab = tab;
    },

    // 根据当前 Tab 过滤交易列表
    get filteredTransactions(): TransactionItem[] {
      // 实际项目中根据 Tab 过滤不同状态的数据
      return store.transactionList;
    },
  }));

  return store;
}
