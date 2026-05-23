# Quickstart: 数字工具

**所属 Feature**: 小贝工具库

**Stage ID**: 02-number-utils

## Scope

本 quickstart 用于数字工具阶段的验收。

## Expected Number Utilities

数字工具集合应包含：

- `add(a, b)`：两个数字相加。
- `multiply(a, b)`：两个数字相乘。
- `formatNumber(num)`：格式化数字显示。

## Usage Examples

```typescript
import { add, formatNumber, multiply } from '@/utils/number';

add(1, 2); // 3
multiply(2, 3); // 6
formatNumber(1000); // '1,000'
```

## Validation Checklist

- 数字工具集合只包含指定的 3 个能力。
- 每个数字工具函数都有明确输入类型和返回类型。
- `add()` 能处理正数、零、负数、小数。
- `multiply()` 能处理正数、零、负数、小数。
- `formatNumber()` 能处理普通整数、小数、较大数字，并返回统一展示字符串。
- 数字工具不包含单元测试交付要求。

## Suggested Local Checks

在前端项目目录执行：

```bash
npm run lint
npx tsc --noEmit
```
