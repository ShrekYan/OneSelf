/**
 * 消息中心页面
 * @description 展示用户的所有通知消息，支持分类筛选、已读/删除操作
 */

import React from 'react';
import { useObserver } from 'mobx-react';
import { Tabs, PullToRefresh, InfiniteScroll, Popup } from 'antd-mobile';

import styles from './index.module.scss';
import { NOTIFICATION_TABS } from './constant';
import useNotificationsStore from './useStore';
import NotificationListItem from './components/NotificationListItem';
import {
  useHandleNotificationClick,
  useHandleLongPress,
  useHandleDelete,
  useHandleMarkAsRead,
  useHandleMarkAllAsRead,
  useHandleGoBack,
  useHandleRefresh,
  useHandleLoadMore,
} from './handle';

/**
 * 消息中心页面
 */
const NotificationsPage: React.FC = () => {
  // 在组件顶层调用 Hook 获取 store
  const store = useNotificationsStore();

  // 获取事件处理函数
  const handleNotificationClick = useHandleNotificationClick(store);
  const handleLongPress = useHandleLongPress(store);
  const handleDelete = useHandleDelete(store);
  const handleMarkAsRead = useHandleMarkAsRead(store);
  const handleMarkAllAsRead = useHandleMarkAllAsRead(store);
  const handleGoBack = useHandleGoBack();
  const handleRefresh = useHandleRefresh(store);
  const handleLoadMore = useHandleLoadMore(store);

  // 获取筛选后的列表
  const filteredList = store.getFilteredList();

  // 获取当前长按选中的消息
  const activeItem = store.longPressActiveId
    ? store.allNotifications.find(n => n.id === store.longPressActiveId)
    : null;

  return useObserver(() => (
    <div className={styles.notificationsContainer}>
      {/* 顶部导航栏 */}
      <header className={styles.notificationsHeader}>
        <button
          className={styles.notificationsBackBtn}
          onClick={handleGoBack}
          type="button"
          aria-label="返回"
        >
          <svg viewBox="0 0 24 24" width={24} height={24} fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className={styles.notificationsTitle}>消息中心</h1>
        {store.unreadCount > 0 && (
          <button
            className={styles.notificationsMarkAllBtn}
            onClick={handleMarkAllAsRead}
            type="button"
          >
            全部已读
          </button>
        )}
        {store.unreadCount === 0 && (
          <div className={styles.notificationsMarkAllPlaceholder} />
        )}
      </header>

      {/* 标签分类栏 */}
      <div className={styles.notificationsTabsWrapper}>
        <Tabs
          activeKey={store.activeTab}
          onChange={key => store.setActiveTab(key as 'all' | 'unread' | 'read')}
        >
          {NOTIFICATION_TABS.map(tab => (
            <Tabs.Tab title={tab.title} key={tab.key} />
          ))}
        </Tabs>
      </div>

      {/* 消息列表 */}
      <div className={styles.notificationsContent}>
        <PullToRefresh
          onRefresh={handleRefresh}
        >
          {filteredList.length === 0 && !store.loading ? (
            <div className={styles.notificationsEmptyState}>
              <svg viewBox="0 0 24 24" width={64} height={64} fill="none" stroke="#ccc" strokeWidth={1.5}>
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              <p className={styles.notificationsEmptyText}>暂无消息</p>
            </div>
          ) : (
            <div className={styles.notificationsList}>
              {filteredList.map(item => (
                <NotificationListItem
                  key={item.id}
                  item={item}
                  onClick={handleNotificationClick}
                  onLongPress={handleLongPress}
                />
              ))}
              <InfiniteScroll
                loadMore={handleLoadMore}
                hasMore={store.hasMore}
                threshold={100}
              >
                {store.loadingMore && (
                  <div className={styles.notificationsLoadingMore}>
                    <span>加载中...</span>
                  </div>
                )}
                {!store.hasMore && filteredList.length > 0 && (
                  <div className={styles.notificationsNoMore}>—— 没有更多消息了 ——</div>
                )}
              </InfiniteScroll>
            </div>
          )}
        </PullToRefresh>
      </div>

      {/* 长按操作菜单 */}
      <Popup
        visible={!!activeItem}
        onMaskClick={() => store.setLongPressActiveId(null)}
        position="bottom"
        bodyClassName={styles.notificationsPopupBody}
      >
        {activeItem && (
          <div className={styles.notificationsActionMenu}>
            {!activeItem.isRead && (
              <button
                className={styles.notificationsActionItem}
                onClick={() => handleMarkAsRead(activeItem.id)}
                type="button"
              >
                <svg viewBox="0 0 24 24" width={20} height={20} fill="none" stroke="currentColor" strokeWidth={2}>
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>标记已读</span>
              </button>
            )}
            <button
              className={styles.notificationsActionItemDelete}
              onClick={() => handleDelete(activeItem.id)}
              type="button"
            >
              <svg viewBox="0 0 24 24" width={20} height={20} fill="none" stroke="currentColor" strokeWidth={2}>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
              <span>删除</span>
            </button>
          </div>
        )}
      </Popup>
    </div>
  ));
};

NotificationsPage.displayName = 'Notifications';

export default NotificationsPage;
