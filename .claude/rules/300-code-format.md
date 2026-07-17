---
name: code-format
description: 缩进、引号、分号、导入排序等代码格式规范
---

## 📐 缩进与空行

- ✅ 缩进大小：统一使用 2 个空格，不使用 tab
- ✅ 大括号前后需要空格
- ✅ 文件末尾保留一个空行
- ✅ 逻辑块、导入分组、函数/方法之间保留一个空行

## 📋 引号与分号

- ✅ 字符串统一使用单引号
- ✅ 模板字符串使用反引号 `` ` ``
- ✅ 语句末尾必须加分号
- ✅ 对象、数组、函数参数末尾必须加 trailing comma

## 📦 导入排序

导入按以下顺序分组，每组之间空一行，同一组内按字母顺序排序：

1. 官方/核心库（React、NestJS 官方包）
2. 第三方包
3. 内部模块（别名导入 `@/`）
4. 相对路径导入（`./`、`../`）

类型导入使用 `import type`，与普通导入分开或放在同一分组末尾。

## 🔧 Prettier 配置

```json
{
  "singleQuote": true,
  "trailingComma": "all",
  "semi": true,
  "tabWidth": 2,
  "printWidth": 100,
  "endOfLine": "lf"
}
```

## 🔍 ESLint 要点

- ✅ `no-explicit-any`: warning，允许必要时使用 any，但尽量避免
- ✅ `no-floating-promises`: warning，必须处理 Promise
- ✅ `no-unsafe-argument`: warning，安全的类型转换

## ✅ 代码检查流程

```bash
npm run lint --fix
npm run format
npx tsc --noEmit
```