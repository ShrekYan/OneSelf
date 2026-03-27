/**
 * 消息中心状态管理
 * @description 使用 MobX 管理消息列表、筛选、分页等状态
 */

import { useLocalObservable } from 'mobx-react';

import type { NotificationItem } from './constant';
import { MOCK_NOTIFICATIONS, PAGE_SIZE } from './constant';

export interface NotificationsStoreType {
  /** 当前激活的标签 */
  activeTab: 'all' | 'unread' | 'read';
  /** 所有消息列表（原始数据） */
  allNotifications: NotificationItem[];
  /** 加载状态 */
  loading: boolean;
  /** 是否正在加载更多 */
  loadingMore: boolean;
  /** 当前页码 */
  currentPage: number;
  /** 是否还有更多 */
  hasMore: boolean;
  /** 未读总数 */
  unreadCount: number;
  /** 长按选中的消息 ID，用于显示操作菜单 */
  longPressActiveId: string | null;

  /** 设置当前标签 */
  setActiveTab: (tab: 'all' | 'unread' | 'read') => void;
  /** 设置加载状态 */
  setLoading: (loading: boolean) => void;
  /** 设置加载更多状态 */
  setLoadingMore: (loading: boolean) => void;
  /** 设置分页信息 */
  setPage: (page: number) => void;
  /** 设置是否还有更多 */
  setHasMore: (hasMore: boolean) => void;
  /** 设置长按选中 */
  setLongPressActiveId: (id: string | null) => void;
  /** 标记消息已读 */
  markAsRead: (id: string) => void;
  /** 全部已读 */
  markAllAsRead: () => void;
  /** 删除消息 */
  deleteNotification: (id: string) => void;
  /** 重新加载（下拉刷新） */
  refresh: () => void;
  /** 加载更多 */
  loadMore: () => void;
  /** 获取当前筛选后的列表（根据当前标签分页） */
  getFilteredList: () => NotificationItem[];
  /** 计算未读总数 */
  calculateUnreadCount: () => number;
}

const useNotificationsStore = () => {
  const store = useLocalObservable<NotificationsStoreType>(() => ({
    // 初始状态
    activeTab: 'all',
    allNotifications: [...MOCK_NOTIFICATIONS],
    loading: false,
    loadingMore: false,
    currentPage: 1,
    hasMore: true,
    longPressActiveId: null,

    get unreadCount() {
      return this.calculateUnreadCount();
    },

    // Actions
    setActiveTab(tab) {
      this.activeTab = tab;
      this.refresh();
    },

    setLoading(loading: boolean) {
      this.loading = loading;
    },

    setLoadingMore(loading: boolean) {
      this.loadingMore = loading;
    },

    setPage(page: number) {
      this.currentPage = page;
    },

    setHasMore(hasMore: boolean) {
      this.hasMore = hasMore;
    },

    setLongPressActiveId(id: string | null) {
      this.longPressActiveId = id;
    },

    markAsRead(id: string) {
      const item = this.allNotifications.find(n => n.id === id);
      if (item && !item.isRead) {
        item.isRead = true;
      }
    },

    markAllAsRead() {
      this.allNotifications.forEach(n => {
        n.isRead = true;
      });
    },

    deleteNotification(id: string) {
      this.allNotifications = this.allNotifications.filter(n => n.id !== id);
    },

    refresh() {
      this.setPage(1);
      this.setHasMore(true);
      this.setLoading(false);
    },

    loadMore() {
      // Mock 分页：由于我们用的是静态 Mock 数据，这里只是模拟加载延迟
      // 实际项目中会调用 API 请求下一页
    },

    calculateUnreadCount() {
      return this.allNotifications.filter(n => !n.isRead).length;
    },

    getFilteredList() {
      let filtered = this.allNotifications;

      // 根据当前标签筛选
      if (this.activeTab === 'unread') {
        filtered = filtered.filter(n => !n.isRead);
      } else if (this.activeTab === 'read') {
        filtered = filtered.filter(n => n.isRead);
      }

      // 分页：返回前 N 条（模拟分页加载）
      const endIndex = this.currentPage * PAGE_SIZE;
      filtered = filtered.slice(0, endIndex);

      // 判断是否还有更多
      const totalFiltered = this.activeTab === 'all'
        ? this.allNotifications.length
        : this.allNotifications.filter(n =>
            this.activeTab === 'unread' ? !n.isRead : n.isRead,
          ).length;

      this.setHasMore(filtered.length < totalFiltered);

      return filtered;
    },
  }));

  return store;
};

export default useNotificationsStore;
