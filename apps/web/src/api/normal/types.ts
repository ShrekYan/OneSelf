/**
 * 普通发车模块枚举定义
 */

/**
 * 发车详情类型编码
 * 0003: 普通发车
 */
export enum FofDetailTypeCode {
  NORMAL_DEPART = '0003',
}

/**
 * 订阅类型编码
 * 80: 普通发车场景
 */
export enum SubscriptionTypeCode {
  NORMAL_DEPART_SCENE = '80',
}

/**
 * 普通发车模块常量
 */
export const NORMAL_DEPART_CONSTANTS = {
  FOF_DETAIL_TYPE_CODE: FofDetailTypeCode.NORMAL_DEPART,
  SUBSCRIPTION_TYPE_CODE: SubscriptionTypeCode.NORMAL_DEPART_SCENE,
} as const;
