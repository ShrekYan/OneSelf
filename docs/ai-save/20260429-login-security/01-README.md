# 登录页面安全改造 - 模块功能文档

> 📅 文档生成日期：2026-04-29
> 📁 模块路径：`apps/web/src/pages/Login/`

---

## 📋 模块概述

本次改造针对登录页面的安全漏洞进行修复，主要解决两个核心安全问题：

1. **敏感信息日志泄露**：生产环境 `console.log` 输出用户信息和 API 响应
2. **sessionStorage 明文存储**：用户信息以 JSON 明文存储在浏览器存储中

---

## 🎯 改造范围

### 修改文件清单

| 文件路径                                              | 修改类型 | 改造内容                            |
| ----------------------------------------------------- | -------- | ----------------------------------- |
| `apps/web/src/utils/secure-storage.ts`                | ✨ 新增  | 安全存储工具类，Base64 编码/解码    |
| `apps/web/src/pages/Login/useStore.ts`                | 🔧 修改  | 使用加密存储 + 开发环境日志控制     |
| `apps/web/src/pages/Login/index.tsx`                  | 🔧 修改  | 删除调试日志 + 错误日志环境控制     |
| `apps/web/src/pages/Login/handle.ts`                  | 🔧 修改  | 删除 4 处调试用 console.log         |
| `apps/web/src/routes/components/RouteInterceptor.tsx` | 🔧 修改  | 路由拦截器使用加密存储读取 userInfo |
| `apps/web/src/store/AppStore.ts`                      | 🔧 修改  | 全局 Store 初始化使用加密存储读取   |

---

## 🔒 安全改造内容

### 1. 安全存储工具 `secure-storage.ts`

**核心功能**：

- `encode()`：JSON 序列化 → URI 编码 → Base64 编码
- `decode()`：Base64 解码 → URI 解码 → JSON 反序列化
- `get/set/remove/clear`：封装 sessionStorage 操作，自动处理编解码

**设计理念**：

- 不是真正的加密，目标是"防肉眼读取"
- 零依赖，使用浏览器原生 API
- 兼容 TypeScript 泛型，类型安全

### 2. 日志安全控制

**改造策略**：

- 生产环境：完全禁用所有 `console.log` / `console.error` / `console.warn`
- 开发环境：保留日志输出，便于调试

**实现方式**：

```typescript
if (import.meta.env.DEV) {
  console.error('Login failed:', error);
}
```

---

## ✅ 改造验证清单

| 验证项                                  | 预期结果               | 验证状态  |
| --------------------------------------- | ---------------------- | --------- |
| 登录成功后控制台无用户信息输出          | ✅ 生产环境无任何日志  | ✅ 已实现 |
| sessionStorage 中 userInfo 不可直接阅读 | ✅ Base64 编码后不可读 | ✅ 已实现 |
| 刷新页面后用户信息正常读取              | ✅ 自动解码恢复对象    | ✅ 已实现 |
| 路由拦截器认证正常工作                  | ✅ 登录态验证不受影响  | ✅ 已实现 |
| 全局 Store 初始化正常                   | ✅ 用户信息正常注入    | ✅ 已实现 |

---

## 📌 注意事项

### 向后兼容性

- 旧版明文存储的数据无法被新版解码，会触发重新登录
- 这是预期行为，sessionStorage 是会话级存储，浏览器关闭即清除

### 安全边界

- Base64 是编码而非加密，仅防止肉眼直接读取
- 专业攻击者仍可通过开发者工具解码查看
- 真正的敏感数据（如 Token）必须通过 HttpOnly Cookie 存储（本项目已实现）

### 后续优化方向

1. Vite 构建配置：通过 esbuild 自动删除生产环境 console（一劳永逸）
2. 密码强度校验：增加正则复杂度校验
3. CSRF 防护：配置 Axios xsrf token
4. 登录失败限流：防止暴力破解

---

## 📚 相关文档

- 前端安全检查清单：见 `/frontend-security` 技能文档
- 前端代码审查规范：见 `/frontend-code-review` 技能文档
- 公共组件开发规范：见 `CLAUDE.md`
