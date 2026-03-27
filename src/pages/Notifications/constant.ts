/**
 * 消息中心常量和类型定义
 */

/** 消息类型枚举 */
export type NotificationType = 'like' | 'comment' | 'follow' | 'system';

/** 消息发送用户信息 */
export interface NotificationFromUser {
  id: string;
  name: string;
  avatar: string;
}

/** 消息关联的文章 */
export interface NotificationTargetArticle {
  id: string;
  title: string;
}

/** 单条消息结构 */
export interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  content?: string;
  fromUser?: NotificationFromUser;
  targetArticle?: NotificationTargetArticle;
  isRead: boolean;
  createdAt: string;
}

/** 标签分类 */
export interface NotificationTab {
  key: 'all' | 'unread' | 'read';
  title: string;
}

/** 默认标签配置 */
export const NOTIFICATION_TABS: NotificationTab[] = [
  { key: 'all', title: 'All' },
  { key: 'unread', title: 'Unread' },
  { key: 'read', title: 'Read' },
];

/**
 * Mock 消息数据
 */
export const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: '1',
    type: 'like',
    title: 'liked your article',
    content: 'React 19 New Features Explained',
    fromUser: {
      id: 'u1',
      name: 'Sarah Chen',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    },
    targetArticle: {
      id: 'a1',
      title: 'React 19 New Features Explained',
    },
    isRead: false,
    createdAt: '2024-03-26T10:30:00Z',
  },
  {
    id: '2',
    type: 'comment',
    title: 'commented on your article',
    content: 'Great article, learned a lot! Many new insights.',
    fromUser: {
      id: 'u2',
      name: 'Ming Li',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ming',
    },
    targetArticle: {
      id: 'a1',
      title: 'React 19 New Features Explained',
    },
    isRead: false,
    createdAt: '2024-03-26T09:15:00Z',
  },
  {
    id: '3',
    type: 'follow',
    title: 'followed you',
    fromUser: {
      id: 'u3',
      name: 'Alex Wang',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    },
    isRead: true,
    createdAt: '2024-03-25T18:45:00Z',
  },
  {
    id: '4',
    type: 'system',
    title: 'System Notification',
    content:
      'Your article "TypeScript Advanced Guide" has been featured on the homepage',
    isRead: false,
    createdAt: '2024-03-25T15:20:00Z',
  },
  {
    id: '5',
    type: 'like',
    title: 'liked your article',
    content: 'MobX State Management Best Practices',
    fromUser: {
      id: 'u4',
      name: 'Lina Zhang',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lina',
    },
    targetArticle: {
      id: 'a2',
      title: 'MobX State Management Best Practices',
    },
    isRead: true,
    createdAt: '2024-03-25T12:10:00Z',
  },
  {
    id: '6',
    type: 'comment',
    title: 'commented on your article',
    content:
      'How would you use this pattern in a real project? Can you give more examples?',
    fromUser: {
      id: 'u5',
      name: 'David Liu',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
    },
    targetArticle: {
      id: 'a2',
      title: 'MobX State Management Best Practices',
    },
    isRead: true,
    createdAt: '2024-03-24T20:30:00Z',
  },
  {
    id: '7',
    type: 'system',
    title: 'Version Update Notification',
    content:
      'V2.0.0 has been released with many new features, come and experience it!',
    isRead: true,
    createdAt: '2024-03-24T10:00:00Z',
  },
  {
    id: '8',
    type: 'follow',
    title: 'followed you',
    fromUser: {
      id: 'u6',
      name: 'Emma Johnson',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
    },
    isRead: false,
    createdAt: '2024-03-23T16:20:00Z',
  },
  {
    id: '9',
    type: 'like',
    title: 'liked your article',
    content: 'The Complete Guide to CSS Grid Layout',
    fromUser: {
      id: 'u7',
      name: 'Ryan Brown',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ryan',
    },
    targetArticle: {
      id: 'a3',
      title: 'The Complete Guide to CSS Grid Layout',
    },
    isRead: true,
    createdAt: '2024-03-23T09:15:00Z',
  },
  {
    id: '10',
    type: 'comment',
    title: 'commented on your article',
    content: 'This article is very clear, I finally understand Grid layout!',
    fromUser: {
      id: 'u8',
      name: 'Sophia Liu',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophia',
    },
    targetArticle: {
      id: 'a3',
      title: 'The Complete Guide to CSS Grid Layout',
    },
    isRead: true,
    createdAt: '2024-03-22T14:30:00Z',
  },
  {
    id: '11',
    type: 'system',
    title: 'Congratulations on your new achievement',
    content:
      'You have published 10 consecutive articles, unlocked "Content Creator" achievement',
    isRead: true,
    createdAt: '2024-03-21T08:00:00Z',
  },
  {
    id: '12',
    type: 'follow',
    title: 'followed you',
    fromUser: {
      id: 'u9',
      name: 'Chris Evans',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Chris',
    },
    isRead: true,
    createdAt: '2024-03-20T19:10:00Z',
  },
];

/** 每页加载条数 */
export const PAGE_SIZE = 10;
