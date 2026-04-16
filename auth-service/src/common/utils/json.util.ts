/**
 * 安全的 JSON.stringify，处理 BigInt 序列化问题
 * 因为 Prisma 返回的 BIGINT 类型在 JavaScript 是 BigInt，原生 JSON.stringify 不支持序列化
 * BigInt 转换为 Number（时间戳场景足够安全，毫秒时间戳在 JS Number 精度范围内）
 */
export function safeJsonStringify(obj: unknown): string {
  return JSON.stringify(obj, (_: string, value: unknown): unknown =>
    typeof value === 'bigint' ? Number(value) : value,
  );
}
