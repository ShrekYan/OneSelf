# Data Model: 前端字符串工具函数

**Feature**: 前端字符串工具函数
**Date**: 2026-05-16

## 说明

本特性为纯函数工具库，不涉及持久化数据或实体关系。本节定义函数接口契约（类型签名）。

## 函数接口

### `trim`

```typescript
/**
 * 去除字符串首尾空白字符
 * @param str - 待处理的字符串，允许传入 null 或 undefined
 * @returns 去除首尾空白后的字符串；传入 null/undefined 时返回空字符串
 */
export function trim(str: string | null | undefined): string;
```

**输入约束**:

- 类型: `string | null | undefined`
- 值: 任意字符串、null 或 undefined

**输出**:

- 类型: `string`（始终返回字符串，永不返回 null/undefined）
- 值: 去除首尾空白字符后的结果；传入 null/undefined 时返回 `''`

---

### `uppercase`

```typescript
/**
 * 将字符串转为全大写
 * @param str - 待处理的字符串，允许传入 null 或 undefined
 * @returns 全大写形式的字符串；传入 null/undefined 时返回空字符串
 */
export function uppercase(str: string | null | undefined): string;
```

**输入约束**:

- 类型: `string | null | undefined`
- 值: 任意字符串、null 或 undefined

**输出**:

- 类型: `string`（始终返回字符串，永不返回 null/undefined）
- 值: 所有小写字母转为大写，非字母字符保持不变；传入 null/undefined 时返回 `''`

---

### `lowercase`

```typescript
/**
 * 将字符串转为全小写
 * @param str - 待处理的字符串，允许传入 null 或 undefined
 * @returns 全小写形式的字符串；传入 null/undefined 时返回空字符串
 */
export function lowercase(str: string | null | undefined): string;
```

**输入约束**:

- 类型: `string | null | undefined`
- 值: 任意字符串、null 或 undefined

**输出**:

- 类型: `string`（始终返回字符串，永不返回 null/undefined）
- 值: 所有大写字母转为小写，非字母字符保持不变；传入 null/undefined 时返回 `''`

## 不变式

- 所有函数均为纯函数：相同输入始终产生相同输出
- 所有函数不产生副作用
- 所有函数返回值类型始终为 `string`，永不返回 `null` 或 `undefined`
- 函数内部对 `null` / `undefined` 做安全处理，调用方无需前置判断
