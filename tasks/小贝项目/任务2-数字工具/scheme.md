# T002 - 数字工具函数 执行方案

## 任务信息

- **执行模式**：plan-only
- **功能**：add / multiply / formatNumber
- **质量标准**：简单的单元测试，类型声明完整
- **约束**：不依赖第三方库

---

## 方案详情

### 文件 1：数字工具主文件

**路径**：`apps/web/src/utils/number.ts`

```typescript
/**
 * 数字工具函数
 */

/**
 * 加法运算
 * @param a 第一个数字
 * @param b 第二个数字
 * @returns 两数之和
 */
export function add(a: number, b: number): number {
  return a + b;
}

/**
 * 乘法运算
 * @param a 第一个数字
 * @param b 第二个数字
 * @returns 两数之积
 */
export function multiply(a: number, b: number): number {
  return a * b;
}

/**
 * 格式化数字（千分位分隔）
 * @param num 待格式化的数字
 * @param decimals 小数位数，默认 2 位
 * @returns 格式化后的字符串
 */
export function formatNumber(num: number, decimals: number = 2): string {
  if (!Number.isFinite(num)) {
    return '0';
  }

  const fixed = num.toFixed(decimals);
  const parts = fixed.split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
}
```

---

### 文件 2：单元测试文件

**路径**：`apps/web/src/utils/__tests__/number.test.ts`

```typescript
import { add, multiply, formatNumber } from '../number';

describe('数字工具函数', () => {
  describe('add', () => {
    it('应该正确计算两个正数的和', () => {
      expect(add(1, 2)).toBe(3);
      expect(add(100, 200)).toBe(300);
    });

    it('应该正确计算负数', () => {
      expect(add(-1, -2)).toBe(-3);
      expect(add(-1, 2)).toBe(1);
    });

    it('应该正确处理 0', () => {
      expect(add(0, 0)).toBe(0);
      expect(add(0, 5)).toBe(5);
    });
  });

  describe('multiply', () => {
    it('应该正确计算两个正数的积', () => {
      expect(multiply(2, 3)).toBe(6);
      expect(multiply(10, 10)).toBe(100);
    });

    it('应该正确计算负数', () => {
      expect(multiply(-2, 3)).toBe(-6);
      expect(multiply(-2, -3)).toBe(6);
    });

    it('乘以 0 应该返回 0', () => {
      expect(multiply(5, 0)).toBe(0);
      expect(multiply(0, 0)).toBe(0);
    });
  });

  describe('formatNumber', () => {
    it('应该格式化整数为千分位格式', () => {
      expect(formatNumber(1000)).toBe('1,000.00');
      expect(formatNumber(1234567)).toBe('1,234,567.00');
    });

    it('应该支持自定义小数位数', () => {
      expect(formatNumber(1234.567, 2)).toBe('1,234.57');
      expect(formatNumber(1234.5, 0)).toBe('1,235');
    });

    it('处理非有限数字返回 0', () => {
      expect(formatNumber(NaN)).toBe('0');
      expect(formatNumber(Infinity)).toBe('0');
    });
  });
});
```

---

### 文件 3：统一导出入口

**路径**：`apps/web/src/utils/index.ts`

```typescript
// 数字工具
export * from './number';
```
