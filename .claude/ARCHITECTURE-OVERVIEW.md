# 项目整体架构概览 Architecture Overview

> **文档说明**: 本文档是项目架构的"地图"，从 3 万英尺视角描述整个系统的组成、关系和数据流。
>
> **定位**: 新成员入职必读、架构评审依据、跨团队沟通的共同语言
>
> **最后更新**: 2026-05-07

---

## 🗺️ 系统架构总览

### 技术栈矩阵

| 层级 | 技术选型 | 版本 | 说明 |
|------|---------|------|------|
| **前端 Web** | React 19 + Vite 5 + TypeScript 5.5 + MobX 6 + Ant Design Mobile | ✅ | H5 移动端单页应用 |
| **认证服务** | NestJS 11 + Redis 7 | ✅ | Auth Service，用户认证、Token 管理 |
| **主业务服务** | NestJS 11 + Prisma 6.4 + MySQL 8 | ✅ | Backend Service，文章、评论、用户 |
| **日志服务** | NestJS 11 + ClickHouse / Elasticsearch | ✅ | Log Service，操作日志、审计、行为分析 |
| **API 网关** | 待选型（Nginx / Kong / Traefik） | ⏳ | 统一入口、限流、鉴权 |
| **消息队列** | 待选型（Redis Pub/Sub / RabbitMQ） | ⏳ | 异步解耦、事件驱动 |
| **缓存层** | Redis 7 | ✅ | Token 黑名单、密码哈希缓存、热点数据 |
| **数据库** | MySQL 8 | ✅ | 主业务数据持久化 |

---

## 🏗️ 部署架构图

```
                      ┌─────────────────┐
                      │   用户浏览器     │
                      │  (Mobile H5)    │
                      └────────┬────────┘
                               │ HTTPS
                               ▼
                      ┌─────────────────┐
                      │   CDN / Nginx    │  静态资源 + 反向代理
                      └────────┬────────┘
                               │
          ┌────────────────────┼────────────────────┐
          │                    │                    │
          ▼                    ▼                    ▼
┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│  auth-service    │  │  backend-service  │  │   log-service    │
│  (NestJS + Redis)│  │ (NestJS + Prisma) │  │  (NestJS + CH)   │
└────────┬─────────┘  └────────┬─────────┘  └────────┬─────────┘
         │                     │                       │
         └─────────────────────┼───────────────────────┘
                               │ HTTP 内网调用
              ┌────────────────┼────────────────┐
              │                │                │
              ▼                ▼                ▼
      ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
      │   Redis 7   │  │   MySQL 8   │  │ ClickHouse  │
      │ (缓存/Token)│  │ (主数据)    │  │ (日志/分析)  │
      └─────────────┘  └─────────────┘  └─────────────┘
```

---

## 📦 服务职责边界（Bounded Context）

### 🔐 Auth Service - 认证领域
**端口**: 3001

| 职责 | 能力 |
|------|------|
| ✅ 用户注册/登录 | 手机号、邮箱、密码登录 |
| ✅ Token 管理 | Access Token / Refresh Token 签发、刷新、吊销 |
| ✅ 密码安全 | Argon2 加密、密码哈希缓存、密码修改重置 |
| ✅ 权限校验 | 角色、权限、接口级鉴权 |
| ✅ HttpOnly Cookie | 浏览器端安全认证 |

**与其他服务关系**:
- Backend Service: 提供 Token 验证接口（introspect）
- Log Service: 接收认证日志、登录行为审计

---

### 📚 Backend Service - 主业务领域
**端口**: 3000

| 职责 | 能力 |
|------|------|
| ✅ 文章管理 | CRUD、发布、草稿、分类标签 |
| ✅ 评论系统 | 评论发表、回复、点赞、删除 |
| ✅ 用户资料 | 头像、昵称、个人信息修改 |
| ✅ 内容审核 | 敏感词过滤（预留） |
| ✅ 统计分析 | 阅读量、点赞数、评论数统计 |

**与其他服务关系**:
- Auth Service: 调用 introspect 验证 Token 有效性
- Log Service: 发送业务操作日志

---

### 📝 Log Service - 日志审计领域
**端口**: 3002

| 职责 | 能力 |
|------|------|
| ✅ 操作日志 | 所有用户行为的可追溯记录 |
| ✅ 安全审计 | 登录失败、异常操作、权限变更审计 |
| ✅ 行为分析 | PV/UV、用户路径、留存分析 |
| ✅ 错误追踪 | 前端错误、后端异常聚合分析 |

**与其他服务关系**:
- Auth Service: 接收认证相关日志
- Backend Service: 接收业务操作日志
- 前端: 接收 JS 错误、性能指标上报

---

## 🔀 数据流向图

### 认证流程
```
用户登录
    ↓
前端 → auth-service/login
    ↓ 验证用户名密码
    ↓ 生成 Access Token (2h) + Refresh Token (7d)
    ↓ 设置 HttpOnly Cookie
前端 ← 返回成功
    ↓
后续请求自动携带 Cookie
    ↓
backend-service → 调用 auth-service/introspect 验证
```

### 业务操作流程
```
用户操作（发表文章/评论）
    ↓
前端 → backend-service/api
    ↓ 1. 从 Cookie 提取 Token
    ↓ 2. 调用 auth-service/introspect 验证
    ↓ 3. 验证通过，执行业务逻辑
    ↓ 4. 异步发送日志到 log-service
    ↓ 返回结果
前端 ← 响应数据
```

---

## 🎯 关键架构决策索引

### 🔴 安全类决策
| 决策 ID | 决策名称 | 核心内容 |
|---------|---------|---------|
| ADR-001 | HttpOnly Cookie | 禁止 localStorage 存 Token，Cookie 自动携带 |
| ADR-002 | Argon2 密码加密 | 抗 GPU 攻击，内存哈希算法 |
| ADR-003 | Token 黑名单机制 | Redis 存已吊销 Token，自动过期 |
| ADR-018 | 跨服务鉴权 | Service ID + Signature 双重认证 |

### ⚡ 性能类决策
| 决策 ID | 决策名称 | 核心内容 |
|---------|---------|---------|
| ADR-005 | 密码哈希缓存 | 缓存验证结果，降低 CPU 消耗 |
| ADR-007 | Redis 连接池 + 重试 | 防止 Redis 抖动导致服务不可用 |
| ADR-010 | Gzip 响应压缩 | 减少网络传输体积 |
| ADR-011 | 用户信息预加载 | 热点数据主动缓存 |
| FADR-002 | React Compiler | 编译期自动优化渲染 |

### 📐 架构类决策
| 决策 ID | 决策名称 | 核心内容 |
|---------|---------|---------|
| ADR-009 | 三层异常过滤器 | 参数验证 → 业务异常 → 兜底错误页 |
| ADR-014 | 每日凌晨 2 点过期清理 | 定时任务避免数据膨胀 |
| ADR-019 | 最终一致性事务 | 本地消息表 + 幂等 + 重试 |
| FADR-003 | MobX 双轨状态 | 全局 RootStore + 页面 useLocalObservable |
| FADR-004/FADR-005 | 四文件 + Hooks 分层 | 页面职责单一化 |

---

## 📊 架构演进路线图

### Phase 1: 最小可用架构（当前 - 已完成 ✅）
- ✅ 三服务微服务拆分（Auth + Backend + Log）
- ✅ 核心安全决策落地（HttpOnly Cookie、Argon2、Token 黑名单）
- ✅ 前端四文件 + Hooks 分层架构
- ✅ Claude Code Agent 规范驱动开发

### Phase 2: 性能与可观测性（QPS < 1000）
- ⏳ 引入 API 网关（统一入口、限流、熔断）
- ⏳ 前端监控与埋点体系（FADR-017）
- ⏳ 分布式日志追踪（Trace ID 透传）
- ⏳ 服务健康检查与告警

### Phase 3: 高可用扩展（QPS > 1000）
- ⏳ 数据库读写分离（ADR-020）
- ⏳ 消息队列解耦业务
- ⏳ 服务多实例部署 + 负载均衡
- ⏳ 缓存分层（本地缓存 + 分布式缓存）

### Phase 4: 大规模扩展
- ⏳ 分库分表
- ⏳ 微服务进一步拆分（文章服务、用户服务、评论服务）
- ⏳ 容器化 + K8s 编排

---

## 🚨 架构红线（绝对不能碰）

| 编号 | 红线内容 | 违反后果 |
|------|---------|---------|
| 🔴 1 | 禁止 localStorage / sessionStorage 存任何 Token | 安全漏洞，账号被盗 |
| 🔴 2 | 禁止明文存储密码，必须用 Argon2 | 安全事故，法律风险 |
| 🔴 3 | 禁止跨服务直接连数据库，必须通过 API 调用 | 服务耦合，无法独立扩展 |
| 🔴 4 | 禁止 SQL 拼接，必须用 ORM 参数化查询 | SQL 注入风险 |
| 🔴 5 | 禁止在日志中输出密码、Token 等敏感信息 | 数据泄露风险 |
| 🔴 6 | 禁止前端硬编码密钥、API Key | 反编译泄露 |

---

## 📚 架构文档索引

| 文档 | 位置 | 面向人群 |
|------|------|---------|
| 后端架构决策 | `.claude/DECISIONS.md` | 后端开发、架构师 |
| 前端架构决策 | `.claude/FRONTEND-DECISIONS.md` | 前端开发、架构师 |
| 整体架构概览 | `.claude/ARCHITECTURE-OVERVIEW.md` | 所有人 |
| 后端 Agent 规范 | `.claude/agents/backend-architect.md` | Claude Code Agent |
| 前端 Agent 规范 | `.claude/agents/frontend-developer.md` | Claude Code Agent |
| 后端详细编码规范 | `.claude/skills/nestjs-backend-developer/*.md` | 后端开发 |
| 前端详细编码规范 | `.claude/skills/h5-frontend-developer/*.md` | 前端开发 |

---

**本文档是项目架构的"指南针"，帮助所有人在同一个认知水平上协作。如有架构变更需求，先更新本文档再修改代码！**
