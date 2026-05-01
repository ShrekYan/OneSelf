# 安全通用规范（前后端通用）

> 本文档定义前后端通用的安全开发规范，前端和后端的特有安全规范在各自目录下单独定义。

---

## 1. HttpOnly Cookie 策略

### 核心原则

为防范 XSS 攻击窃取 Token，本项目采用 HttpOnly Cookie 为首选认证方案。

| 规则 | 要求 |
|------|------|
| ✅ HttpOnly | 必须启用 `httpOnly: true`，禁止 JavaScript 读取 Cookie |
| ✅ Secure | 生产环境必须启用 `secure: true`，仅通过 HTTPS 传输 |
| ✅ SameSite | 推荐使用 `sameSite: 'strict'`，防止 CSRF 攻击 |
| ✅ Max-Age | 必须设置合理的过期时间 |
| ✅ Path | 建议设置为根路径 `path: '/'` |

### 前端约束

前端 **禁止**：
- ❌ 存储 accessToken/refreshToken 到 localStorage/sessionStorage
- ❌ 手动设置 `Authorization` 请求头（Cookie 自动携带）
- ❌ 通过 API 响应中获取 Token 并存储

前端 **必须**：
- ✅ 开启 `withCredentials: true`（axios 配置）
- ✅ Token 刷新：后端从 Cookie 自动读取，不传参数

### 后端约束

设置 Cookie 时的标准配置：

```typescript
res.cookie('accessToken', token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 2 * 60 * 60 * 1000, // 2 小时
  path: '/',
});
```

Token 提取优先级：
1. ✅ 优先从 HttpOnly Cookie 提取
2. ⚠️ 其次从 Authorization Header 提取（兼容旧用户）

---

## 2. Token 安全要求

### 日志安全

- ✅ **禁止**在日志中记录完整的 Token 值
- ✅ 必要时只记录 Token 前 8 位用于排查
- ✅ 异常日志中必须过滤敏感信息

### 刷新机制

- ✅ 必须实现 Token 自动刷新机制
- ✅ Refresh Token 必须有独立的过期时间
- ✅ 支持用户手动登出，清除所有有效 Token
- ✅ 支持全部设备登出（强制所有 Token 失效）

### 存储方案

| 存储位置 | 适用场景 | 要求 |
|---------|---------|------|
| HttpOnly Cookie | Access Token | ✅ 必须 |
| Redis | Refresh Token | ✅ 必须，支持自动过期 |

---

## 3. 密码加密规范

### 算法选择

| 算法 | 状态 | 说明 |
|------|------|------|
| **Argon2id** | ✅ **必须使用** | 目前最安全的密码哈希算法，抗 GPU/ASIC 攻击 |
| bcrypt | ❌ 不再推荐 | 已过时，抗 GPU 攻击能力弱 |
| PBKDF2 | ❌ 不推荐 | 安全性不如 Argon2 |

### Argon2 推荐配置

```typescript
argon2.hash(password, {
  type: argon2.argon2id,      // 必须使用 argon2id 变体
  memoryCost: 1 << 16,        // 64MB 内存消耗
  timeCost: 3,                   // 迭代次数
  parallelism: 1,                 // 并行度
  hashLength: 32,                // 哈希长度
});
```

### 安全注意事项

- ✅ 密码哈希只能单向，不能解密
- ✅ 数据库中只存储哈希值，**绝不存储明文密码**
- ✅ 必须加盐处理（Argon2 自动加盐）

---

## 4. 错误信息安全

### 防止账户枚举

- ✅ 登录失败时**不要**提示"用户名不存在"或"密码错误"的具体差异
- ✅ 应使用统一错误提示："用户名或密码错误"
- ✅ 注册/找回密码等接口也应遵循同样的错误提示策略

### 敏感信息不暴露

- ❌ 禁止在错误响应中返回 SQL 语句、堆栈信息、内部路径
- ❌ 禁止泄露数据库类型、表名、字段名
- ❌ 禁止泄露服务版本、环境配置
- ✅ 生产环境只返回业务错误码和友好的错误提示

### 错误处理原则

| 环境 | 错误信息详细程度 |
|------|---------------|
| 开发环境 | 可以返回详细错误，便于调试 |
| 测试环境 | 限制错误信息，只返回必要信息 |
| 生产环境 | 只返回业务错误码和友好提示 |

---

## 5. 输入验证基础

### 所有外部输入必须验证

- ✅ 用户输入必须校验
- ✅ API 请求参数必须校验
- ✅ 路径参数、查询参数必须校验
- ✅ Cookie 和 Header 中的数据也需要验证

### 验证原则

- ✅ 白名单验证优于黑名单验证
- ✅ 类型验证 + 范围验证 + 格式验证
- ✅ 验证失败时拒绝请求并返回明确错误

---

## 6. 安全检查清单

- [ ] 是否启用了 HttpOnly Cookie？
- [ ] 生产环境是否启用了 `secure: true`？
- [ ] Token 是否不存储在 localStorage？
- [ ] 日志中是否不记录完整 Token？
- [ ] 密码加密是否使用 Argon2id？
- [ ] 数据库中是否只存储密码哈希？
- [ ] 登录失败提示是否统一，不暴露具体错误原因？
- [ ] 敏感信息是否不会暴露到错误响应？
- [ ] 所有外部输入是否都做了验证？

---

## 延伸阅读

- **前端安全规范**：见 `.claude/skills/h5-frontend-developer/rules/frontend-api-design.md`
- **后端安全规范**：见 `.claude/skills/nestjs-backend-developer/11-security-authentication.md`
- **TypeScript 规范**：见 `.claude/rules/typescript-common.md`
- **代码格式规范**：见 `.claude/rules/code-format-common.md`
