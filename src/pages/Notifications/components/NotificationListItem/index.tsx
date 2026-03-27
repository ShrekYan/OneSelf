/**
 * 消息列表项组件
 * @description 展示单条消息，支持不同类型消息渲染，长按弹出操作菜单
 */

import React from 'react';
import classNames from 'classnames';

import styles from './index.module.scss';
import type { NotificationItem } from '@/pages/Notifications/constant';

interface NotificationListItemProps {
  item: NotificationItem;
  onClick: (item: NotificationItem) => void;
  onLongPress: (item: NotificationItem) => void;
}

/**
 * 根据消息类型获取图标路径
 */
const getTypeIcon = (type: NotificationItem['type']) => {
  switch (type) {
    case 'like':
      return (
        <svg viewBox="0 0 24 24" width={20} height={20} fill="currentColor">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      );
    case 'comment':
      return (
        <svg viewBox="0 0 24 24" width={20} height={20} fill="currentColor">
          <path d="M21.99 4c0-1.1-.89-2-1.99-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18zM18 14H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" />
        </svg>
      );
    case 'follow':
      return (
        <svg viewBox="0 0 24 24" width={20} height={20} fill="currentColor">
          <path d="M18 13v6h-6V5h6v8h3l-4 4-4-4h3zm-12-8c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2.9-2zm0 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2z" />
        </svg>
      );
    case 'system':
      return (
        <svg viewBox="0 0 24 24" width={20} height={20} fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
        </svg>
      );
    default:
      return null;
  }
};

/**
 * 格式化相对时间
 */
const formatRelativeTime = (dateStr: string): string => {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMinutes < 1) return '刚刚';
  if (diffMinutes < 60) return `${diffMinutes} 分钟前`;
  if (diffHours < 24) return `${diffHours} 小时前`;
  if (diffDays < 7) return `${diffDays} 天前`;

  return date.toLocaleDateString();
};

const NotificationListItem: React.FC<NotificationListItemProps> = ({
  item,
  onClick,
  onLongPress,
}) => {
  const {
    type,
    title,
    content,
    fromUser,
    isRead,
    createdAt,
  } = item;

  /**
   * 处理上下文菜单
   */
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    onLongPress(item);
  };

  /**
   * 处理触摸长按（移动端）
   */
  let longPressTimer: NodeJS.Timeout | null = null;

  const handleTouchStart = () => {
    longPressTimer = setTimeout(() => {
      onLongPress(item);
    }, 500);
  };

  const handleTouchEnd = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
    }
  };

  const handleTouchMove = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
    }
  };

  return (
    <div
      className={classNames(
        styles.notificationListItemContainer,
        !isRead && styles.notificationListItemUnread,
      )}
      onClick={() => onClick(item)}
      onContextMenu={handleContextMenu}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchMove={handleTouchMove}
      role="button"
      tabIndex={0}
    >
      {/* 未读红点 */}
      {!isRead && <div className={styles.notificationListItemUnreadDot} />}

      {/* 用户头像 / 类型图标 */}
      <div className={styles.notificationListItemAvatarWrapper}>
        {fromUser ? (
          <img src={fromUser.avatar} alt={fromUser.name} className={styles.notificationListItemAvatar} />
        ) : (
          <div className={classNames(
            styles.notificationListItemTypeIcon,
            styles[`notificationListItemTypeIcon${type.charAt(0).toUpperCase()}${type.slice(1)}`],
          )}>
            {getTypeIcon(type)}
          </div>
        )}
      </div>

      {/* 内容区域 */}
      <div className={styles.notificationListItemContent}>
        <div className={styles.notificationListItemHeader}>
          <span className={styles.notificationListItemTitle}>
            {fromUser && <span className={styles.notificationListItemUserName}>{fromUser.name}</span>} {title}
          </span>
          <span className={styles.notificationListItemTime}>{formatRelativeTime(createdAt)}</span>
        </div>
        {content && <p className={styles.notificationListItemContentText}>{content}</p>}
      </div>

      {/* 右箭头 */}
      {(item.targetArticle || item.fromUser) && (
        <svg className={styles.notificationListItemArrow} width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <polyline points="9 18 15 12 9 6" />
        </svg>
      )}
    </div>
  );
};

export default React.memo(NotificationListItem);
