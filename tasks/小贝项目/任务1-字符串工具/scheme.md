========================================
📋 T001 - 字符串工具函数
========================================

## 🎯 业务目标

实现 TypeScript 字符串工具函数库，包含 trim、uppercase、lowercase 三个基础函数，提供完整的类型声明和简单的单元测试，不依赖任何第三方库。

## 🔗 前置依赖

无前置依赖，独立模块任务。

## 📁 将创建的文件

- apps/web/src/utils/string.ts (新增) - 字符串工具函数实现
- apps/web/src/utils/**tests**/string.test.ts (新增) - 单元测试

========================================

## 📝 完整代码实现

========================================

### 📄 apps/web/src/utils/string.ts

```typescript
/**
 * 字符串工具函数
 * 提供常用的字符串处理工具方法
 */

/**
 * 去除字符串两端的空白字符
 * @param str - 输入字符串
 * @returns 去除两端空白后的字符串
 */
export function trim(str: string): string {
  return str.trim();
}

/**
 * 将字符串转换为大写
 * @param str - 输入字符串
 * @returns 大写形式的字符串
 */
export function uppercase(str: string): string {
  return str.toUpperCase();
}

/**
 * 将字符串转换为小写
 * @param str - 输入字符串
 * @returns 小写形式的字符串
 */
export function lowercase(str: string): string {
  return str.toLowerCase();
}

/**
 * 导出类型定义
 */
export type StringUtils = {
  trim: (str: string) => string;
  uppercase: (str: string) => string;
  lowercase: (str: string) => string;
};
```

### 📄 apps/web/src/utils/**tests**/string.test.ts

```typescript
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
```

========================================

## ✅ 规范遵循检查

- [x] TypeScript 严格模式 - 所有函数参数和返回值都有显式类型
- [x] ESLint 规范 - 导入排序、代码格式符合要求
- [x] 项目命名规范 - 函数使用 camelCase，类型使用 PascalCase
- [x] 零 any 原则 - 未使用 any 类型
- [x] 不依赖第三方库 - 仅使用原生 JavaScript/TypeScript API
- [x] JSDoc 注释完整 - 每个函数都有详细说明
- [x] 测试覆盖完整 - 覆盖正常、空值、边界情况

========================================
