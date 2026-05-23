# Quickstart: 数组工具

**所属 Feature**: 小贝工具库

**Stage ID**: 03-array-utils

## Scope

本 quickstart 用于数组工具阶段的验收。

## Expected Array Utilities

数组工具集合应包含：

- `unique(arr)`：数组去重。
- `sort(arr)`：数组排序。
- `filter(arr, fn)`：数组过滤。

## Usage Examples

```typescript
import { filter, sort, unique } from '@/utils/array';

unique([1, 1, 2]); // [1, 2]
sort([3, 1, 2]); // [1, 2, 3]
filter([1, 2, 3], item => item > 1); // [2, 3]
```

## Validation Checklist

- 数组工具集合只包含指定的 3 个能力。
- 每个数组工具函数都有明确输入类型和返回类型。
- `unique()` 能处理重复元素、无重复元素、空数组。
- `sort()` 能处理乱序数组、已排序数组、空数组。
- `filter()` 能处理有匹配结果、无匹配结果、空数组。
- 数组工具不包含单元测试交付要求。
- 数组工具不修改输入数组。

## Suggested Local Checks

在前端项目目录执行：

```bash
npm run lint
npx tsc --noEmit
```
