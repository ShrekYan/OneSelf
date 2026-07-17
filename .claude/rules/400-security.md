---
name: security
description: Token、密码、错误信息等安全规范
---

## 🔐 HttpOnly Cookie 策略

- ✅ 必须启用 `httpOnly: true`，禁止 JavaScript 读取 Cookie
- ✅ 生产环境必须启用 `secure: true`，仅通过 HTTPS 传输
- ✅ 推荐使用 `sameSite: 'strict'`，防止 CSRF 攻击
- ✅ 前端开启 `withCredentials: true`（axios 配置）

## 🔑 Token 安全要求

- ✅ 禁止在日志中记录完整的 Token 值，必要时只记录前 8 位
- ✅ 必须实现 Token 自动刷新机制
- ✅ Refresh Token 存储在 Redis，支持自动过期
- ✅ 支持用户手动登出和全部设备登出

## 🔒 密码加密规范

- ✅ 必须使用 **Argon2id** 算法（目前最安全的密码哈希算法）
- ✅ 数据库中只存储哈希值，绝不存储明文密码
- ✅ 必须加盐处理（Argon2 自动加盐）

## ⚠️ 错误信息安全

- ✅ 登录失败时使用统一错误提示："用户名或密码错误"
- ✅ 禁止在错误响应中返回 SQL 语句、堆栈信息、内部路径
- ✅ 禁止泄露数据库类型、表名、字段名、服务版本
- ✅ 生产环境只返回业务错误码和友好提示

## ✅ 输入验证

- ✅ 用户输入、API 请求参数、路径参数、查询参数必须校验
- ✅ 白名单验证优于黑名单验证
- ✅ 验证失败时拒绝请求并返回明确错误