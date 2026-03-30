
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useObserver } from 'mobx-react';
import { Tabs } from 'antd-mobile';
import type { TabProps } from 'antd-mobile';
import styles from './index.module.scss';
import { useTransactionRecordStore } from './useStore';

// antd-mobile 中 Tab 组件仅作为标记，不需要导入直接使用
const Tab: React.FC<TabProps> = () => null;

export type TabType = 'pending' | 'inTransit' | 'history';

export interface TransactionItem {
  id: string;
  name: string;
  time: string;
  amount: string;
  status: string;
}

const TransactionRecordPage: React.FC = () => {
  const navigate = useNavigate();
  const store = useTransactionRecordStore();

  const handleTabChange = (key: string) => {
    store.setActiveTab(key as TabType);
  };

  return useObserver(() => (
    <div className={styles.transactionRecordContainer}>
      {/* 顶部导航栏 */}
      <div className={styles.navBar}>
        <div className={styles.backIcon} onClick={() => navigate(-1)}>
          &#xe889;
        </div>
        <div className={styles.title}>交易记录</div>
      </div>

      {/* Tab 切换栏 - 使用 antd-mobile Tabs */}
      <div className={styles.tabsWrapper}>
        <Tabs
          activeKey={store.activeTab}
          onChange={handleTabChange}
          activeLineMode="fixed"
        >
          <Tab title="待处理" key="pending" />
          <Tab title="在途交易" key="inTransit" />
          <Tab title="历史交易" key="history" />
        </Tabs>
      </div>

      {/* 交易列表 */}
      <div className={styles.listContainer}>
        {store.filteredTransactions.map((item) => (
          <div key={item.id} className={styles.transactionItem}>
            <div className={styles.itemHeader}>
              <div className={styles.tradeName}>{item.name}</div>
              <div className={styles.tradeTime}>{item.time}</div>
            </div>
            <div className={styles.itemBody}>
              <div className={styles.tradeStatus}>{item.status}</div>
              <div className={styles.tradeAmount}>{item.amount}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  ));
};

TransactionRecordPage.displayName = 'TransactionRecordPage';

export default TransactionRecordPage;
