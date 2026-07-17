---
name: checklist
description: 代码交付前的通用自检项
---

## ✅ 代码完成后通用检查清单

### 代码风格
- [ ] 缩进使用 2 个空格？
- [ ] 字符串使用单引号？
- [ ] 语句末尾有分号？
- [ ] 对象/数组末尾有 trailing comma？
- [ ] 文件末尾保留了空行？
- [ ] 导入顺序按分组排序正确？

### 命名规范
- [ ] 文件、组件、变量命名符合 `200-naming.md`？
- [ ] Boolean 变量使用 `is/has/can/should` 前缀？

### 类型安全
- [ ] 是否避免了不必要的 `any`？
- [ ] 函数参数、返回值是否都有显式类型？
- [ ] TypeScript 严格模式是否开启？
- [ ] `catch` 块中的 `error` 是否做了类型收窄？

### 安全规范
- [ ] Token 是否不存储在 localStorage？
- [ ] 日志中是否不记录完整 Token？
- [ ] 错误响应中是否不暴露敏感信息？
- [ ] 所有外部输入是否都做了验证？

### 技术栈合规
- [ ] React 使用函数组件 + Hooks？
- [ ] NestJS 遵循模块化架构？
- [ ] 样式使用 CSS Modules？

### 检查执行
- [ ] 执行了 `npm run lint --fix`？
- [ ] 执行了 `npm run format`？
- [ ] 执行了 `npx tsc --noEmit` 没有类型错误？
- [ ] 移除了所有调试用的 `console.log`？