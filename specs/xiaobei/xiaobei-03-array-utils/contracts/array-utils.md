# Contract: 小贝数组工具函数

## 目标

在 `apps/web/src/utils/array.ts` 中提供 3 个数组工具函数：`unique`、`sort`、`filter`。

## Public Functions

### unique

**Signature**:

```typescript
function unique<T>(arr: readonly T[]): T[];
```

**Behavior**:

- 接收数组输入。
- 返回去重后的新数组。
- 重复值只保留首次出现的元素。
- 空数组返回空数组。
- 不修改输入数组。

**Examples**:

```typescript
unique([1, 1, 2]); // [1, 2]
unique(['a', 'b', 'a']); // ['a', 'b']
unique([]); // []
```

### sort

**Signature**:

```typescript
function sort<T extends number | string>(arr: readonly T[]): T[];
```

**Behavior**:

- 接收数字数组或字符串数组。
- 返回排序后的新数组。
- 数字数组按数字升序排列。
- 字符串数组按默认字典顺序排列。
- 空数组返回空数组。
- 不修改输入数组。

**Examples**:

```typescript
sort([3, 1, 2]); // [1, 2, 3]
sort(['b', 'a', 'c']); // ['a', 'b', 'c']
sort([]); // []
```

### filter

**Signature**:

```typescript
function filter<T>(arr: readonly T[], fn: (item: T) => boolean): T[];
```

**Behavior**:

- 接收数组和同步过滤条件函数。
- 返回满足条件的新数组。
- 若没有元素满足条件，返回空数组。
- 保持满足条件元素在输入数组中的相对顺序。
- 不修改输入数组。

**Examples**:

```typescript
filter([1, 2, 3], item => item > 1); // [2, 3]
filter(['a', 'bb'], item => item.length > 1); // ['bb']
filter([], () => true); // []
```

## Non-Goals

- 不新增单元测试。
- 不支持异步过滤条件。
- 不支持对象深度去重。
- 不支持自定义排序比较器。
- 不处理非数组输入的运行时转换。
