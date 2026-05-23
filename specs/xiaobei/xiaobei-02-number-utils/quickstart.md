# Quickstart: 小贝数字工具函数

## 目标

根据规格与计划，在前端工具目录中提供 3 个数字工具函数：`add`、`multiply`、`formatNumber`。

## 推荐实施顺序

1. 在 `apps/web/src/utils/number.ts` 中新增数字工具入口。
2. 实现 `add(a, b)`，返回两数之和。
3. 实现 `multiply(a, b)`，返回两数之积。
4. 实现 `formatNumber(num)`，返回带千位分隔符的字符串展示，并保留有效小数信息。
5. 为 3 个入口补齐显式参数类型与返回类型。
6. 通过契约核对确认以下场景均有明确预期，不新增单元测试：
   - 正数
   - 负数
   - 0
   - 小数
   - 千位以上数字
7. 在 `apps/web` 内运行类型与 lint 验证命令。

## 验证命令

```bash
cd apps/web && npm run lint
cd apps/web && npx tsc --noEmit
```

## 完成标准

- `add`、`multiply`、`formatNumber` 均存在且可导入。
- 所有入口均有明确参数与返回类型。
- `add` 与 `multiply` 返回正确数字计算结果。
- `formatNumber` 对千位以上数字添加千位分隔符，并保留有效小数信息。
- lint 与 TypeScript 类型检查通过。
- 本阶段不新增或运行单元测试。
