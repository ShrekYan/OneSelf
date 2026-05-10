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
