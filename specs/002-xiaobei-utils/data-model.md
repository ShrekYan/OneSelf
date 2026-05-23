# Data Model: 小贝工具库

**Feature**: 小贝工具库 (`specs/002-xiaobei-utils`)

## Overview

本文件为全局数据模型索引。小贝工具库不涉及持久化数据模型，仅包含工具函数的输入输出契约和行为规范。详细的阶段模型请参考各阶段文档。

## Stage Data Model References

| Stage ID | Stage Name | Stage Data Model                                                             |
| -------- | ---------- | ---------------------------------------------------------------------------- |
| 01       | 字符串工具 | [stages/01-string-utils/data-model.md](stages/01-string-utils/data-model.md) |
| 02       | 数字工具   | [stages/02-number-utils/data-model.md](stages/02-number-utils/data-model.md) |
| 03       | 数组工具   | [stages/03-array-utils/data-model.md](stages/03-array-utils/data-model.md)   |

## Global Model Summary

### Feature Structure

```
小贝工具库
├── 字符串工具集合
│   ├── trim(str) → string
│   ├── uppercase(str) → string
│   └── lowercase(str) → string
├── 数字工具集合
│   ├── add(a, b) → number
│   ├── multiply(a, b) → number
│   └── formatNumber(num) → string
└── 数组工具集合
    ├── unique(arr) → array
    ├── sort(arr) → array
    └── filter(arr, fn) → array
```

### Key Characteristics

- **无状态**: 所有工具函数均为纯函数，不维护状态，无状态迁移。
- **无副作用**: 工具函数不修改输入参数（数组工具明确保证不修改输入数组）。
- **类型安全**: 所有函数具备完整的 TypeScript 类型声明。
- **可预测性**: 所有函数在边界情况下（空输入、极端值等）返回可预测结果。

### Validation Principles

1. **完整性**: 每个工具集合必须恰好包含指定数量的工具函数。
2. **类型一致性**: 每个函数必须具备明确的输入类型和返回类型。
3. **行为边界**: 每个函数必须明确说明行为边界和预期输出。
4. **无扩展**: 不得添加来源需求未声明的额外工具能力。
