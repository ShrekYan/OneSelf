import type { AxiosRequestConfig, CancelTokenSource } from 'axios';

/**
 * 请求取消管理器
 * 用于防止重复请求和批量取消请求
 */
export class CancelManager {
  private pendingRequests = new Map<string, CancelTokenSource>();

  /**
   * 生成请求的唯一键
   * @param config - 请求配置
   * @returns 请求键
   */
  private generateKey(config: AxiosRequestConfig): string {
    return `${config.method}-${config.url}-${JSON.stringify(config.params || {})}-${JSON.stringify(config.data || {})}`;
  }

  /**
   * 添加请求到管理器
   * @param config - 请求配置
   * @param source - 取消令牌源
   */
  addRequest(config: AxiosRequestConfig, source: CancelTokenSource) {
    const key = this.generateKey(config);
    this.removeRequest(key);
    this.pendingRequests.set(key, source);
  }

  /**
   * 移除指定请求
   * @param key - 请求键
   */
  private removeRequest(key: string) {
    const source = this.pendingRequests.get(key);
    if (source) {
      source.cancel('重复请求已取消');
      this.pendingRequests.delete(key);
    }
  }

  /**
   * 取消所有待处理请求
   */
  cancelAll() {
    this.pendingRequests.forEach(source => {
      source.cancel('请求已取消');
    });
    this.pendingRequests.clear();
  }
}
