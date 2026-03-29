/**
 * Pixso MCP 错误分类与处理
 */

/**
 * 错误类型枚举
 */
export type PixsoErrorType =
  | 'none'              // 无错误
  | 'unauthorized'      // 未授权 / Token 无效
  | 'nodeNotFound'      // 节点不存在 / 文件不存在
  | 'networkError'      // 网络错误 / 超时
  | 'tokenExceeded'     // Token 超限 - 结果已保存到本地文件
  | 'rateLimit'         // 频率限制
  | 'serverError'       // 服务端错误
  | 'unknown';          // 未知错误

/**
 * Token 超限错误上下文
 */
export interface TokenExceededContext {
  type: 'tokenExceeded';
  originalMessage: string;
  localFilePath: string;
}

/**
 * 分类后的错误结果
 */
export interface ClassifiedError {
  type: PixsoErrorType;
  message: string;
  context?: TokenExceededContext;
  retryCount: number;
}

/**
 * 判断是否可以重试
 */
export function shouldRetry(error: ClassifiedError): boolean {
  const { type, retryCount } = error;

  switch (type) {
    case 'networkError':
      return retryCount < 3;
    case 'rateLimit':
      return retryCount < 2;
    case 'serverError':
      return retryCount < 1;
    default:
      return false;
  }
}

/**
 * 获取重试延迟（毫秒）- 指数退避
 */
export function getRetryDelay(error: ClassifiedError): number {
  const { type, retryCount } = error;

  // 指数退避: 2^retryCount * baseDelay
  if (type === 'rateLimit') {
    return Math.pow(2, retryCount) * 5000; // 5s, 10s
  }
  return Math.pow(2, retryCount) * 1000; // 1s, 2s, 4s
}

/**
 * 从错误信息中分类错误类型
 */
export function classifyError(errorMessage: string): ClassifiedError {
  const lowerMessage = errorMessage.toLowerCase();

  // 检查 Token 超限 - 结果保存到本地文件
  if (errorMessage.includes('exceeds maximum allowed tokens')) {
    const filePath = extractFilePath(errorMessage);
    if (filePath) {
      return {
        type: 'tokenExceeded',
        message: `结果过大超出 Token 限制，将从本地文件读取: ${filePath}`,
        context: {
          type: 'tokenExceeded',
          originalMessage: errorMessage,
          localFilePath: filePath,
        },
        retryCount: 0,
      };
    }
  }

  // 未授权 / Token 无效
  if (
    lowerMessage.includes('invalid token') ||
    lowerMessage.includes('unauthorized') ||
    lowerMessage.includes('not logged in')
  ) {
    return {
      type: 'unauthorized',
      message: '认证失败，请检查 Pixso Token 配置',
      retryCount: 0,
    };
  }

  // 节点不存在 / 文件不存在
  if (
    lowerMessage.includes('node not found') ||
    lowerMessage.includes('invalid file') ||
    lowerMessage.includes('not found')
  ) {
    return {
      type: 'nodeNotFound',
      message: '节点或文件不存在，请检查 fileKey 和 nodeId',
      retryCount: 0,
    };
  }

  // 网络错误 / 超时
  if (
    lowerMessage.includes('timeout') ||
    lowerMessage.includes('network error') ||
    lowerMessage.includes('connection reset') ||
    lowerMessage.includes('econnrefused')
  ) {
    return {
      type: 'networkError',
      message: '网络错误或请求超时',
      retryCount: 0,
    };
  }

  // 限流
  if (
    lowerMessage.includes('rate limit') ||
    lowerMessage.includes('too many requests') ||
    lowerMessage.includes('429')
  ) {
    return {
      type: 'rateLimit',
      message: '请求频率超限，请稍后再试',
      retryCount: 0,
    };
  }

  // 服务端错误
  if (
    lowerMessage.includes('500') ||
    lowerMessage.includes('server error') ||
    lowerMessage.includes('internal error')
  ) {
    return {
      type: 'serverError',
      message: 'Pixso 服务端错误',
      retryCount: 0,
    };
  }

  // 未知错误
  return {
    type: 'unknown',
    message: errorMessage,
    retryCount: 0,
  };
}

/**
 * 从错误信息中提取本地文件路径
 * 格式: ...Output has been saved to /path/to/file.txt
 */
export function extractFilePath(errorMessage: string): string | null {
  // 匹配 /Users/.../*.txt 路径
  const pathRegex = /(\/Users\/[^\s]+\/mcp-pixso-get_node_dsl-[0-9]+\.txt)/;
  const match = errorMessage.match(pathRegex);
  return match?.[1] ?? null;
}

/**
 * 生成用户友好的错误提示
 */
export function formatUserMessage(error: ClassifiedError): string {
  switch (error.type) {
    case 'none':
      return '';

    case 'unauthorized':
      return `## ❌ Pixso 调用失败: 认证错误

访问 Pixso API 时认证失败，Token 无效或已过期。

**可能原因**:
- Token 配置不正确
- Token 已过期需要刷新
- 账号权限不足

**建议解决方案**:
1. 检查 MCP 配置中的 Pixso Token
2. 从 Pixso 重新获取有效的个人访问令牌
3. 更新配置后重新尝试`;

    case 'nodeNotFound':
      return `## ❌ Pixso 调用失败: 无法访问节点

无法找到指定的 Pixso 节点。

**可能原因**:
- nodeId 不正确（请检查 URL）
- fileKey 不正确
- 文件已被删除

**建议解决方案**:
1. 检查 Pixso URL 是否正确
2. 确认 fileKey 和 nodeId 提取正确
3. 确认文件和节点仍然存在`;

    case 'networkError':
      if (shouldRetry(error)) {
        return `⏳ 网络错误，将在 ${getRetryDelay(error)}ms 后重试...`;
      }
      return `## ❌ Pixso 调用失败: 网络错误

经过 ${error.retryCount + 1} 次重试仍然无法连接 Pixso MCP 服务。

**可能原因**:
- 网络连接不稳定
- Pixso 服务暂时不可用
- 防火墙拦截 MCP 调用

**建议解决方案**:
1. 检查网络连接是否正常
2. 等待几分钟后重新尝试 \`/pixso <fileKey> [nodeId]\`
3. 如果问题持续，请检查 MCP 配置`;

    case 'tokenExceeded':
      return `⚠️ 结果过大超出 Token 限制，正在从本地文件读取: ${error.context?.localFilePath}`;

    case 'rateLimit':
      if (shouldRetry(error)) {
        return `⏳ 请求频率受限，将在 ${getRetryDelay(error)}ms 后重试...`;
      }
      return `## ❌ Pixso 调用失败: 请求频率限制

Pixso API 调用频率已超限，即使重试后仍然无法获取。

**建议解决方案**:
1. 等待 1-2 分钟后重新尝试
2. 如果频繁调用，请适当降低调用频率`;

    case 'serverError':
      if (shouldRetry(error)) {
        return `⏳ 服务端错误，将在 ${getRetryDelay(error)}ms 后重试...`;
      }
      return `## ❌ Pixso 调用失败: 服务端错误

Pixso 服务端处理请求时发生错误，重试后仍然失败。

**建议解决方案**:
1. 等待一段时间后重新尝试
2. 如果问题持续，请检查 Pixso 服务状态`;

    case 'unknown':
      return `## ❌ Pixso 调用失败: 未知错误

\`\`\`
${error.message}
\`\`\`

请检查错误信息并排查问题。`;

    default:
      return `## ❌ Pixso 调用失败: ${error.type}

${error.message}`;
  }
}
