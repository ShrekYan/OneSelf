# 代码审查指南

当需要审查代码质量时，按照本指南进行全面检查。

## 审查范围

- `src/` - 前端 H5 项目代码（React 19 + TypeScript + MobX + Vite）
- **排除**: `backend/` - 不检查后端 NestJS 代码

---

## 技术栈检查基准

项目当前使用版本：
- React 19.2.3
- TypeScript 5.5.3
- MobX 6.13.5 + MobX React 9.1.1
- React Router DOM 6.27.0
- Ant Design Mobile 5.42.3
- Vite 7.3.1

---

## 代码审查清单

### 1. 类型安全检查

遵循 `.claude/rules/typescript.md`：

- [ ] **所有变量、函数参数、返回值都有明确类型吗？**
  - 是否存在隐式 `any` 类型？
  - 是否滥用 `any` 绕过类型检查？
  - 复杂对象是否显式声明了类型？

- [ ] **组件 Props 是否定义了接口？**
  - 所有组件 props 是否都有 `interface` 定义？
  - 是否缺少必填字段的类型定义？

- [ ] **API 请求/响应是否有完整类型？**
  - 所有接口是否都定义了请求参数类型？
  - 所有接口是否都定义了响应数据类型？
  - 是否直接使用 `any` 作为 API 响应类型？

- [ ] **可空值处理正确吗？**
  - 是否使用 `Type | null` 明确表示可空？
  - 可选参数是否正确使用 `?` 标记？

- [ ] **泛型是否添加了正确约束？**
  - 泛型是否使用 `T extends object` 等正确约束？

**不合格示例：**
```typescript
// ❌ 错误
function process(user) { ... }
const data: any = response.data;
const items = [];
```

**合格示例：**
```typescript
// ✅ 正确
function process(user: User): void { ... }
const data = response.data as User;
const items: User[] = [];
```

### 2. React 最佳实践

- [ ] **hooks 使用正确吗？**
  - `useState` 是否指定了泛型类型？`useState<User | null>(null)`
  - `useRef` 是否指定了正确的 DOM 类型？
  - 依赖项数组是否完整？
  - 是否遵守了 hooks 规则（只在顶层调用）？
  - 是否正确使用了 React 19 新特性（useActionState, useOptimistic 等）？

- [ ] **性能优化**
  - 大型列表是否使用了虚拟滚动？
  - 是否合理使用了 `useMemo` / `useCallback`？
  - 是否避免了不必要的重渲染？
  - 图片是否设置了懒加载？
  - 是否利用了 React Compiler 自动优化？

- [ ] **组件结构是否合理？**
  - 是否抽取了可复用的组件？
  - 单个组件是否过大（超过 500 行）？
  - 是否遵循了单一职责原则？

### 3. MobX 状态管理规范

- [ ] Store 类的所有字段是否都声明了类型？
- [ ] 是否正确使用了 `makeAutoObservable(this)`？
- [ ] 方法参数和返回值是否有类型？
- [ ] 是否遵守了 MobX 最佳实践（action / computed 正确使用）？
- [ ] 是否避免了在 actions 之外修改状态？

**不合格示例：**
```typescript
// ❌ 错误
class AppStore {
  loading = false;  // ✅ 类型推断可以，但最好显式声明
  user = null;      // ❌ 缺少类型：user: User | null = null
}
```

**合格示例：**
```typescript
// ✅ 正确
class AppStore {
  loading: boolean = false;
  user: User | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  setUser(user: User | null): void {
    this.user = user;
  }
}
```

### 4. API 层规范

遵循 `.claude/rules/api-design.md` 和 `src/api/CLAUDE.md`：

- [ ] **模块组织正确吗？**
  - 是否按业务模块放在对应目录 `src/api/[module]/index.ts`？
  - 是否在 `src/api/index.ts` 中正确导出？

- [ ] **类型完整吗？**
  - 参数是否定义了 `XXXParams` 接口？
  - 响应是否定义了 `XXXResponse` 接口？
  - 返回值是否指定了 `Promise<XXXResponse>`？

- [ ] **特殊配置是否正确使用？**
  - 不常变化的 GET 请求是否启用了 `cache: true`？
  - 不需要错误提示的接口是否使用了 `skipErrorToast: true`？
  - 不需要认证的接口（登录等）是否使用了 `skipAuth: true`？
  - 需要重试的不稳定接口是否配置了 `retry`？

- [ ] **导入是否使用路径别名？**
  - 是否使用 `import { api } from '@/api/index.tsx'` 而不是相对路径？

### 5. 路由规范

- [ ] 是否使用 React Router DOM 声明式导航？
- [ ] 路由参数是否正确类型化？
- [ ] 需要认证的路由是否有保护？

### 6. 表单处理

- [ ] 是否优先使用 React Hook Form？
- [ ] 表单验证规则是否完整？
- [ ] 错误信息是否正确显示？

### 7. 样式规范

项目使用 SCSS + CSS Modules + postcss-px-to-viewport：

- [ ] 组件样式是否使用 `*.module.scss`？
- [ ] 是否遵循了设计稿 750px 宽度，使用 px 编写（自动转 vw）？
- [ ] 是否使用了 `@/styles/variables.scss` 中定义的全局变量？
- [ ] 是否适配了移动端不同屏幕尺寸？
- [ ] 响应式布局是否正确？

### 8. Ant Design Mobile 使用

- [ ] 是否优先使用 Ant Design Mobile 组件，避免重复造轮子？
- [ ] 是否正确导入组件（按需导入）？
- [ ] 是否正确适配了移动端手势交互？

### 9. 安全检查

- [ ] 是否存在 XSS 风险？
  - 用户输入是否正确转义？
  - 是否避免了危险的 `dangerouslySetInnerHTML`？

- [ ] 是否存在敏感信息硬编码？
  - API Key、密钥等是否写在代码里？
  - 敏感配置是否通过环境变量传递？

- [ ] 本地存储是否安全？
  - token 等敏感信息是否存在 localStorage？
  - 是否存储了不必要的敏感信息？

- [ ] 路由权限检查是否正确？
  - 需要登录的页面是否有认证检查？

### 10. 性能检查

- [ ] 是否存在不必要的大图未压缩？
- [ ] 是否使用了动态导入分割代码？
- [ ] 大型组件是否按需懒加载？
- [ ] 是否存在内存泄漏（事件监听未清理）？
- [ ] useEffect 是否正确返回清理函数？
- [ ] 是否合理利用了请求缓存（GET 缓存）？
- [ ] 是否避免了重复请求（自动取消重复请求）？

### 11. 移动端适配

- [ ] 点击元素最小尺寸是否满足 44px？
- [ ] 是否适配了安全区域（刘海屏、底部小黑条）？
- [ ] 是否禁止了双击缩放？
- [ ] 横向滚动是否处理得当？
- [ ] 不同设备屏幕密度是否适配？

### 12. 可访问性检查

- [ ] 图片是否有 `alt` 属性？
- [ ] 表单控件是否有正确的 label？
- [ ] 交互元素是否支持键盘操作？
- [ ] 颜色对比度是否满足 WCAG 标准？
- [ ] 是否支持屏幕阅读器？

---

## 代码规范检查

### 1. 导入规范

- [ ] 是否使用路径别名 `@/` 而不是过长的相对路径？
- [ ] 是否存在未使用的导入？
- [ ] 导入顺序是否合理（第三方库在前，内部模块在后）？

**✅ 正确：**
```typescript
import React, { useState, useEffect } from 'react';
import { Button, Toast } from 'antd-mobile';
import { observer } from 'mobx-react-lite';
import { api } from '@/api/index.tsx';
import type { ProductItem } from '@/types/product';
```

**❌ 错误：**
```typescript
// 过长相对路径
import { api } from '../../../../api/index.tsx';
// 未使用的导入
import { useState } from 'react';
```

### 2. 命名规范

- [ ] 变量/函数是否使用 camelCase？
- [ ] 类/接口/类型是否使用 PascalCase？
- [ ] 常量是否使用 UPPER_SNAKE_CASE？
- [ ] 文件名是否使用小写字母 + 连字符（kebab-case）？

### 3. 注释规范

- [ ] 复杂的类型和函数是否添加了 JSDoc 注释？
- [ ] 业务逻辑中的复杂算法是否添加了注释说明？
- [ ] 是否存在注释和代码不一致的情况？
- [ ] 是否删除了注释掉的死代码？

### 4. ESLint/Prettier

- [ ] 代码是否通过 ESLint 检查？
- [ ] 代码是否经过 Prettier 格式化？

---

## 审查步骤

1. **收集需要审查的文件** - 列出改动涉及的所有文件
2. **逐项检查** - 按照上述清单逐项检查
3. **标记问题** - 记录发现的问题，说明位置（文件:行号）
4. **分类问题** - 分为 BUG、类型安全、性能问题、安全问题、规范问题
5. **给出修复建议** - 针对每个问题提供具体的修复方案
6. **总结** - 给出总体评价和优先级建议

---

## 问题严重程度分级

- **严重**: 导致功能不可用、内存泄漏、安全漏洞、数据丢失
- **中等**: 功能异常、类型不安全、性能问题、不符合规范
- **轻微**: 代码风格问题、缺少注释、命名不规范

---

## 输出模板

```
## 代码审查结果

### 审查范围
- 文件列表: ...

### 发现问题

#### 🔴 严重问题
1. `src/path/file.ts:line` - 问题描述
   - 影响: ...
   - 修复建议: ...

#### 🟠 中等问题
1. `src/path/file.ts:line` - 问题描述
   - 影响: ...
   - 修复建议: ...

#### 🟡 轻微问题
1. `src/path/file.ts:line` - 问题描述
   - 修复建议: ...

### 总体评价
...

### 优先修复顺序
1. ...
2. ...
```
