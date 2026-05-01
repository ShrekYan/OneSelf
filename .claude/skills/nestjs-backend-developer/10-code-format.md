# 10 - 代码格式与工具链规范（NestJS 后端特有）

> **通用代码格式规范**：已抽离至 `.claude/rules/code-format-common.md`，本文件仅定义后端特有规范。

---

## 1. 工具链版本

- **ESLint**: 9.18（使用 flat config 格式，配置文件 `eslint.config.mjs`）
- **Prettier**: 3.4.2（代码格式化）
- **TypeScript**: 5.7.3（严格模式开启）

---

## 2. ESLint 配置要点

当前配置：
- 继承 `eslint:recommended` + `typescript-eslint/recommended`
- `no-explicit-any` 设为 **warning**（允许必要时使用 any）
- `no-floating-promises` 设为 warning
- `no-unsafe-argument` 设为 warning
- 集成 `eslint-config-prettier` 禁用与 Prettier 冲突的规则

### 开发原则

虽然规则允许 any，但仍然推荐：
- 尽量避免使用 `any`
- 优先使用 `unknown` 配合类型守卫
- 只有在和第三方库类型系统冲突（如 Prisma 全小写模型名问题）时才使用 any 绕过

---

## 3. Prettier 配置

**通用配置**：见 `.claude/rules/code-format-common.md`

项目配置：
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

---

## 4. 导入排序（后端特有）

**通用原则**：见 `.claude/rules/code-format-common.md`

导入按以下顺序分组，每组之间空一行。同一组内按字母顺序排列。

| 顺序 | 分组 | 示例 |
|------|------|------|
| 1 | NestJS 官方包 | `@nestjs/*` |
| 2 | 第三方包 | 其他 node_modules 包 |
| 3 | Prisma 类型 | `@prisma/client` |
| 4 | 内部模块 | `src/...` 或 `@common/...` |
| 5 | 当前模块相对导入 | `./`, `../` |

示例：
```typescript
import { Injectable, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import type { articles } from '@prisma/client';

import { PrismaService } from 'src/prisma/prisma.service';
import { ApiResult } from 'src/common/result/api-result';
import { BusinessException } from 'src/common/exceptions/business.exception';

import { QueryArticleListDto } from './dto';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';
```

---

## 5. 代码格式检查

开发完成后必须执行：

```bash
# 检查并修复 ESLint 错误
npm run lint --fix

# Prettier 格式化所有代码
npm run format

# TypeScript 类型检查
npx tsc --noEmit
```

---

## 6. 检查清单

- [ ] 执行过 `npm run lint --fix` 修复了所有错误？
- [ ] 执行过 `npm run format` 格式化了所有代码？
- [ ] 执行过 `npx tsc --noEmit` 没有类型错误？
- [ ] 导入顺序是否按分组排序正确？
- [ ] 移除了所有调试用的 `console.log`？
