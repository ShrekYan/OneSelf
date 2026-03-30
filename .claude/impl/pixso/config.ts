/**
 * Pixso MCP 模块配置中心
 * 统一管理可配置参数，避免硬编码魔法数字
 */

/**
 * Pixso 配置接口
 */
export interface PixsoConfig {
  /** 最大文件大小限制（字节），默认 1GB */
  maxFileSizeBytes: number;
  /** 默认目标设计稿宽度，默认 750px */
  defaultTargetWidth: number;
  /** 最大重试次数，默认 3 */
  maxRetries: number;
  /** 基础重试延迟（毫秒），默认 1000ms */
  baseRetryDelayMs: number;
}

/**
 * 默认配置
 */
const defaultConfig: PixsoConfig = {
  maxFileSizeBytes: 1024 * 1024 * 1024, // 1GB
  defaultTargetWidth: 750,
  maxRetries: 3,
  baseRetryDelayMs: 1000,
};

/**
 * 当前配置
 */
let currentConfig: PixsoConfig = { ...defaultConfig };

/**
 * 获取当前配置
 */
export function getConfig(): Readonly<PixsoConfig> {
  return { ...currentConfig };
}

/**
 * 更新配置（部分更新）
 */
export function setConfig(partial: Partial<PixsoConfig>): void {
  currentConfig = { ...currentConfig, ...partial };
}

/**
 * 重置为默认配置
 */
export function resetConfig(): void {
  currentConfig = { ...defaultConfig };
}
