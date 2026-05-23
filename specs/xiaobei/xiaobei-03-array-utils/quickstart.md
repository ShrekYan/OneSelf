# Quickstart: 小贝数组工具函数

## 目标

根据规格与计划，在前端工具目录中提供 3 个数组工具函数：`unique`、`sort`、`filter`。

## 推荐实施顺序

1. 在 `apps/web/src/utils/array.ts` 中新增数组工具入口。
2. 实现 `unique(arr)`，返回去重后的新数组，并保持首次出现顺序。
3. 实现 `sort(arr)`，返回排序后的新数组：数字升序、字符串默认字典顺序。
4. 实现 `filter(arr, fn)`，返回满足条件的新数组。
5. 为 3 个入口补齐显式参数类型与返回类型，避免使用 `any`。
6. 通过契约核对确认以下场景均有明确预期，不新增单元测试：
   - 空数组
   - 单元素数组
   - 重复基础值数组
   - 数字数组排序
   - 字符串数组排序
   - 过滤条件全部为 false
7. 在 `apps/web` 内运行类型与 lint 验证命令。

## 验证命令

```bash
cd apps/web && npm run lint
cd apps/web && npx tsc --noEmit
```

## 完成标准

- `unique`、`sort`、`filter` 均存在且可导入。
- 所有入口均有明确参数与返回类型。
- `unique` 返回去重后的新数组，不修改输入数组。
- `sort` 返回排序后的新数组，不修改输入数组。
- `filter` 返回满足条件的新数组，不修改输入数组。
- lint 与 TypeScript 类型检查通过。
- 本阶段不新增或运行单元测试。
