import { trim, uppercase, lowercase } from '../string';

describe('字符串工具函数', () => {
  describe('trim', () => {
    it('应该去除字符串首尾空格', () => {
      expect(trim('  hello world  ')).toBe('hello world');
    });

    it('应该处理空字符串', () => {
      expect(trim('')).toBe('');
    });

    it('应该处理只有空格的字符串', () => {
      expect(trim('   ')).toBe('');
    });
  });

  describe('uppercase', () => {
    it('应该将字符串转为大写', () => {
      expect(uppercase('hello world')).toBe('HELLO WORLD');
    });

    it('应该处理空字符串', () => {
      expect(uppercase('')).toBe('');
    });
  });

  describe('lowercase', () => {
    it('应该将字符串转为小写', () => {
      expect(lowercase('HELLO WORLD')).toBe('hello world');
    });

    it('应该处理空字符串', () => {
      expect(lowercase('')).toBe('');
    });
  });
});
