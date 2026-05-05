import crypto from 'crypto';

/**
 * ID 生成工具类
 * 统一所有表的主键生成策略，确保全库 ID 格式一致
 */
export class IdGenerator {
  /**
   * 生成标准 UUID v4
   * @returns UUID 字符串，如 "550e8400-e29b-41d4-a716-446655440000"
   */
  static generateUUID(): string {
    return crypto.randomUUID();
  }

  /**
   * 生成分类 ID
   */
  static generateCategoryId(): string {
    return this.generateUUID();
  }

  /**
   * 生成文章 ID
   */
  static generateArticleId(): string {
    return this.generateUUID();
  }

  /**
   * 生成文章内容块 ID
   */
  static generateContentBlockId(): string {
    return this.generateUUID();
  }

  /**
   * 生成热搜关键词 ID
   */
  static generateHotSearchId(): string {
    return this.generateUUID();
  }

  /**
   * 生成点赞 ID
   */
  static generateLikeId(): string {
    return this.generateUUID();
  }

  /**
   * 生成用户 ID
   */
  static generateUserId(): string {
    return this.generateUUID();
  }
}
