/**
 * Mock 内存状态存储 - 点赞状态等可变数据
 */

// 维护用户点赞状态（Mock 环境下内存存储
// 实际生产环境应该存在数据库
export const USER_LIKE_MAP = new Map<string, Set<string>>();

// 为简单起见，Mock 使用一个默认用户 ID
export const DEFAULT_USER_ID = 'mock-user-1';
