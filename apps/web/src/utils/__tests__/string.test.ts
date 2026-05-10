/**
 * 字符串工具函数单元测试
 */
import { trim, uppercase, lowercase } from '../string';

describe('string utils', () => {
  describe('trim', () => {
    it('should remove whitespace from both ends of string', () => {
      expect(trim('  hello world  ')).toBe('hello world');
    });

    it('should return empty string when input is empty', () => {
      expect(trim('')).toBe('');
    });

    it('should return same string when no whitespace', () => {
      expect(trim('hello')).toBe('hello');
    });

    it('should remove all whitespace characters', () => {
      expect(trim('\n\t hello \t\n')).toBe('hello');
    });
  });

  describe('uppercase', () => {
    it('should convert string to uppercase', () => {
      expect(uppercase('hello world')).toBe('HELLO WORLD');
    });

    it('should return empty string when input is empty', () => {
      expect(uppercase('')).toBe('');
    });

    it('should handle already uppercase string', () => {
      expect(uppercase('HELLO')).toBe('HELLO');
    });

    it('should handle mixed case string', () => {
      expect(uppercase('HeLLo WoRLd')).toBe('HELLO WORLD');
    });
  });

  describe('lowercase', () => {
    it('should convert string to lowercase', () => {
      expect(lowercase('HELLO WORLD')).toBe('hello world');
    });

    it('should return empty string when input is empty', () => {
      expect(lowercase('')).toBe('');
    });

    it('should handle already lowercase string', () => {
      expect(lowercase('hello')).toBe('hello');
    });

    it('should handle mixed case string', () => {
      expect(lowercase('HeLLo WoRLd')).toBe('hello world');
    });
  });
});
