/**
 * 消息中心事件处理函数
 * @description 抽离业务逻辑，保持组件简洁
 */

import { useNavigate } from 'react-router-dom';
import { Dialog } from 'antd-mobile';

import type { NotificationsStoreType } from './useStore';
import type { NotificationItem } from './constant';

/**
 * 处理消息点击
 * - 自动标记已读
 * - 跳转到对应页面（文章详情 / 用户主页）
 */
export const useHandleNotificationClick = (store: NotificationsStoreType) => {
  const navigate = useNavigate();

  const handleNotificationClick = (item: NotificationItem) => {
    // 标记已读
    if (!item.isRead) {
      store.markAsRead(item.id);
    }

    // 根据类型和关联内容跳转
    if (item.targetArticle?.id) {
      // 跳转到文章详情
      navigate(`/article/${item.targetArticle.id}`);
    } else if (item.fromUser?.id) {
      // TODO: 跳转到用户主页，用户主页未实现，暂时不跳转
      console.log('Navigate to user profile:', item.fromUser.id);
    }
  };

  return handleNotificationClick;
};

/**
 * 处理长按消息 - 弹出确认对话框选择操作
 */
export const useHandleLongPress = (store: NotificationsStoreType) => {
  const handleLongPress = (item: NotificationItem) => {
    store.setLongPressActiveId(item.id);
  };

  return handleLongPress;
};

/**
 * 处理删除消息确认
 */
export const useHandleDelete = (store: NotificationsStoreType) => {
  const handleDelete = async (id: string) => {
    const confirmed = await Dialog.confirm({
      title: 'Delete Notification',
      content:
        'Are you sure you want to delete this notification? This cannot be undone.',
    });

    if (confirmed) {
      store.deleteNotification(id);
    }

    store.setLongPressActiveId(null);
  };

  return handleDelete;
};

/**
 * 处理标记已读
 */
export const useHandleMarkAsRead = (store: NotificationsStoreType) => {
  const handleMarkAsRead = (id: string) => {
    store.markAsRead(id);
    store.setLongPressActiveId(null);
  };

  return handleMarkAsRead;
};

/**
 * 处理全部已读
 */
export const useHandleMarkAllAsRead = (store: NotificationsStoreType) => {
  const handleMarkAllAsRead = async () => {
    if (store.unreadCount === 0) return;

    const confirmed = await Dialog.confirm({
      title: 'Read All',
      content: 'Are you sure you want to mark all notifications as read?',
    });

    if (confirmed) {
      store.markAllAsRead();
    }
  };

  return handleMarkAllAsRead;
};

/**
 * 返回上一页
 */
export const useHandleGoBack = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return handleGoBack;
};

/**
 * 模拟下拉刷新
 */
export const useHandleRefresh = (store: NotificationsStoreType) => {
  const handleRefresh = async () => {
    store.setLoading(true);
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 500));
    store.refresh();
    store.setLoading(false);
  };

  return handleRefresh;
};

/**
 * 模拟加载更多
 */
export const useHandleLoadMore = (store: NotificationsStoreType) => {
  const handleLoadMore = async () => {
    if (!store.hasMore || store.loadingMore) return;

    store.setLoadingMore(true);
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 500));
    store.setPage(store.currentPage + 1);
    store.setLoadingMore(false);
  };

  return handleLoadMore;
};
