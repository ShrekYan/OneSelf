# TypeScript 通用规范（前后端通用）

> 本文档定义前后端通用的 TypeScript 编码规范，前端和后端的特有规范在各自目录下单独定义。

---

## 1. 严格模式要求

- ✅ **必须开启 `strict: true`**，严禁关闭核心检查
- ✅ **禁止禁用 `strictNullChecks`**
- ❌ 禁止使用 `@ts-ignore`，除非特殊必要并有注释说明

### any 使用规则

| 项目 | 规范 |
|------|------|
| ✅ 零 any 原则 | 尽量避免 `any`，优先使用 `unknown` 或具体类型 |
| ✅ 类型守卫 | 使用 `unknown` 时必须配合类型守卫进行收窄 |
| ⚠️ 例外情况 | 只有在和第三方库类型系统冲突（如 Prisma）时才使用 any |

---

## 2. 类型基本原则

### 类型优先

先定义类型，再编写逻辑。任何数据结构在使用前都应该有明确的类型定义。

### 显式声明

以下内容必须显式声明类型：

- ✅ 函数/方法参数
- ✅ 函数/方法返回值（特别是 `async/Promise`）
- ✅ 类属性

---

## 3. 可选值与空值处理

### 可选与空值区分

| 写法 | 含义 | 适用场景 |
|------|------|---------|
| `field?: Type` | 属性可以不存在，或为 `undefined` | 可选参数、可选配置 |
| `field: Type | null` | 属性必须存在，但值可以为 `null` | 数据库字段、明确的空状态 |

### 禁止用法

❌ 禁止用 `undefined` 代替 `null`，二者语义不同：
- `undefined` = 未设置、不存在
- `null` = 空值、有意设置为空

### 安全访问

使用可选链 `?.` 访问嵌套属性，使用空值合并 `??` 提供默认值。

```typescript
const displayName = user?.name ?? '匿名用户';
```

---

## 4. 异步处理规范

### Promise 类型

所有异步函数必须显式标注 `Promise<T>` 返回类型。

```typescript
// ✅ 正确
async fetchUser(id: string): Promise<User> {
  const res = await api.get<User>(`/user/${id}`);
  return res.data;
}

// ❌ 错误 - 返回类型未声明
async fetchUser(id: string) {
  // ...
}
```

### 错误处理

在 `catch` 块中，`error` 默认为 `unknown` 类型，必须进行类型收窄。

```typescript
// ✅ 正确 - 类型收窄
try {
  await this.operation();
} catch (error) {
  if (error instanceof Error) {
    logger.error(error.message);
  }
}

// ❌ 错误 - 直接访问 error.message
try {
  await this.operation();
} catch (error) {
  logger.error(error.message); // 编译错误
}
```

---

## 5. 导入导出规范

### 类型导出

所有仅导出类型的地方必须使用 `export type`。

```typescript
// ✅ 正确
export type { Feature, Link };
export interface HeaderProps { }

// ❌ 不推荐
export type Feature = ...; // 应该写为 export type Feature = ...
```

### 导入排序基本原则

导入按以下分组排序，每组之间空一行。同一组内按字母顺序排序。

| 分组顺序 | 内容 |
|---------|------|
| 1 | 官方/核心库（如 React、NestJS） |
| 2 | 第三方包 |
| 3 | 内部模块（别名导入） |
| 4 | 相对路径导入 |

> **注意**：前端和后端的具体分组规则在各自特有规范中定义。

---

## 6. 基础检查清单

- [ ] 是否开启了 `strict: true` 严格模式？
- [ ] 是否避免了不必要的 `any`？
- [ ] 函数参数、返回值是否都有显式类型？
- [ ] `catch` 块中的 `error` 是否做了类型收窄？
- [ ] 空值处理是否正确区分了 `?:` 和 `| null`？
- [ ] 导入是否按分组正确排序？
- [ ] 类型导出是否使用了 `export type`？

---

## 延伸阅读

- **前端特有 TypeScript 规范**：见 `.claude/skills/h5-frontend-developer/rules/frontend-typescript.md`
- **后端特有 TypeScript 规范**：见 `.claude/skills/nestjs-backend-developer/rules/nestjs-typescript.md`
- **代码格式规范**：见 `.claude/rules/code-format-common.md`
- **安全规范**：见 `.claude/rules/security-common.md`
