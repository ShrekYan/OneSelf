/**
 * About 页面类型定义
 */

/**
 * 功能项配置
 */
export interface Feature {
  id: string;
  title: string;
  description: string;
  iconKey: IconKey;
}

/**
 * 链接项配置
 */
export interface Link {
  id: string;
  title: string;
  iconKey: IconKey;
}

/**
 * 应用基本信息
 */
export interface AppInfo {
  name: string;
  version: string;
  description: string;
  copyright: string;
}

/**
 * 图标 Key 类型
 */
export type IconKey =
  | 'discover'
  | 'recommend'
  | 'bookmark'
  | 'theme'
  | 'website'
  | 'github'
  | 'email'
  | 'feedback';
