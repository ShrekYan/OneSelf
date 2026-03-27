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
  { key: 'all', title: '全部' },
  { key: 'unread', title: '未读' },
  { key: 'read', title: '已读' },
];

/**
 * Mock 消息数据
 */
export const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: '1',
    type: 'like',
    title: '赞了你的文章',
    content: 'React 19 新特性详解',
    fromUser: {
      id: 'u1',
      name: 'Sarah Chen',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    },
    targetArticle: {
      id: 'a1',
      title: 'React 19 新特性详解',
    },
    isRead: false,
    createdAt: '2024-03-26T10:30:00Z',
  },
  {
    id: '2',
    type: 'comment',
    title: '评论了你的文章',
    content: '非常好的文章，受益匪浅！学习了很多新知识点。',
    fromUser: {
      id: 'u2',
      name: 'Ming Li',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ming',
    },
    targetArticle: {
      id: 'a1',
      title: 'React 19 新特性详解',
    },
    isRead: false,
    createdAt: '2024-03-26T09:15:00Z',
  },
  {
    id: '3',
    type: 'follow',
    title: '关注了你',
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
    title: '系统通知',
    content: '你的文章「TypeScript 进阶指南」已经被精选到首页推荐',
    isRead: false,
    createdAt: '2024-03-25T15:20:00Z',
  },
  {
    id: '5',
    type: 'like',
    title: '赞了你的文章',
    content: 'MobX 状态管理最佳实践',
    fromUser: {
      id: 'u4',
      name: 'Lina Zhang',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lina',
    },
    targetArticle: {
      id: 'a2',
      title: 'MobX 状态管理最佳实践',
    },
    isRead: true,
    createdAt: '2024-03-25T12:10:00Z',
  },
  {
    id: '6',
    type: 'comment',
    title: '评论了你的文章',
    content: '请问这个案例在实际项目中如何使用？能否给出更多示例？',
    fromUser: {
      id: 'u5',
      name: 'David Liu',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
    },
    targetArticle: {
      id: 'a2',
      title: 'MobX 状态管理最佳实践',
    },
    isRead: true,
    createdAt: '2024-03-24T20:30:00Z',
  },
  {
    id: '7',
    type: 'system',
    title: '新版本更新通知',
    content: 'V2.0.0 版本已经发布，新增了很多功能，快来体验吧！',
    isRead: true,
    createdAt: '2024-03-24T10:00:00Z',
  },
  {
    id: '8',
    type: 'follow',
    title: '关注了你',
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
    title: '赞了你的文章',
    content: 'CSS Grid 布局完全指南',
    fromUser: {
      id: 'u7',
      name: 'Ryan Brown',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ryan',
    },
    targetArticle: {
      id: 'a3',
      title: 'CSS Grid 布局完全指南',
    },
    isRead: true,
    createdAt: '2024-03-23T09:15:00Z',
  },
  {
    id: '10',
    type: 'comment',
    title: '评论了你的文章',
    content: '这篇文章写得非常清楚，我终于学会了 Grid 布局！',
    fromUser: {
      id: 'u8',
      name: 'Sophia Liu',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophia',
    },
    targetArticle: {
      id: 'a3',
      title: 'CSS Grid 布局完全指南',
    },
    isRead: true,
    createdAt: '2024-03-22T14:30:00Z',
  },
  {
    id: '11',
    type: 'system',
    title: '恭喜获得新成就',
    content: '你已经连续发布 10 篇文章，解锁「创作达人」成就',
    isRead: true,
    createdAt: '2024-03-21T08:00:00Z',
  },
  {
    id: '12',
    type: 'follow',
    title: '关注了你',
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
