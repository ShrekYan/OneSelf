# 代码格式通用规范（前后端通用）

> 本文档定义前后端通用的代码格式规范，前端和后端的特有格式规范在各自目录下单独定义。

---

## 1. 缩进与空行

### 缩进规则

| 项目 | 规范 |
|------|------|
| ✅ 缩进大小 | 统一使用 2 个空格，**不使用 tab** |
| ✅ 大括号空格 | 大括号前后需要空格 |
| ✅ 文件末尾 | 文件末尾保留一个空行 |

### 空行规则

- ✅ 逻辑块之间保留一个空行提高可读性
- ✅ 导入分组之间保留一个空行
- ✅ 函数/方法之间保留一个空行
- ✅ 类的属性和方法之间保留一个空行

---

## 2. 引号与分号

### 引号

- ✅ **字符串统一使用单引号**
- ✅ 模板字符串使用反引号 `` ` ``

### 分号

- ✅ **语句末尾必须加分号**

### 尾随逗号

- ✅ 对象、数组末尾必须加 trailing comma
- ✅ 函数参数末尾推荐加 trailing comma

```typescript
// ✅ 正确
const config = {
  apiUrl: 'https://example.com',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
};

const list = [
  'item1',
  'item2',
  'item3',
];
```

---

## 3. 导入排序基本原则

导入按以下顺序分组，每组之间空一行。同一组内按字母顺序排序。

| 分组顺序 | 内容 | 示例 |
|---------|------|------|
| 1 | 官方/核心库 | React、NestJS 官方包 |
| 2 | 第三方包 | 其他 npm 包 |
| 3 | 内部模块 | 别名导入（`@/`、`src/`） |
| 4 | 相对路径导入 | `./`、`../` 当前模块内导入 |

### 类型导入

类型导入使用 `import type`，与普通导入分开或放在同一分组末尾。

> **注意**：前端和后端的具体分组细节在各自特有规范中定义。

---

## 4. Prettier 配置

项目统一使用以下 Prettier 配置：

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

## 5. ESLint 要点

### 核心规则

| 规则 | 配置 | 说明 |
|------|------|------|
| `no-explicit-any` | warning | 允许必要时使用 any，但尽量避免 |
| `no-floating-promises` | warning | 必须处理 Promise |
| `no-unsafe-argument` | warning | 安全的类型转换 |

### 开发原则

虽然规则允许 any，但仍然推荐：
- ✅ 尽量避免使用 `any`
- ✅ 优先使用 `unknown` 配合类型守卫
- ✅ 只有在和第三方库类型系统冲突时才使用 any 绕过

---

## 6. 代码检查流程

开发完成后必须执行：

```bash
# 1. 检查并修复 ESLint 错误
npm run lint --fix

# 2. Prettier 格式化所有代码
npm run format

# 3. TypeScript 类型检查
npx tsc --noEmit
```

---

## 7. 基本检查清单

- [ ] 缩进使用 2 个空格？
- [ ] 字符串使用单引号？
- [ ] 语句末尾有分号？
- [ ] 对象/数组末尾有 trailing comma？
- [ ] 文件末尾保留了空行？
- [ ] 导入顺序按分组排序正确？
- [ ] 执行了 `npm run lint --fix`？
- [ ] 执行了 `npm run format`？
- [ ] 执行了 `npx tsc --noEmit` 没有类型错误？
- [ ] 移除了所有调试用的 `console.log`？

---

## 延伸阅读

- **前端格式规范**：见 `.claude/skills/h5-frontend-developer/rules/frontend-typescript.md`
- **后端格式规范**：见 `.claude/skills/nestjs-backend-developer/10-code-format.md`
- **TypeScript 规范**：见 `.claude/rules/typescript-common.md`
- **安全规范**：见 `.claude/rules/security-common.md`
