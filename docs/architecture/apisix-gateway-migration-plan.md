# APISIX API Gateway 接入改造计划

## Context

当前项目为 Monorepo 全栈博客系统，前端 H5（`apps/web/`）通过单一 `baseURL` 与后端通信；后端由三个 NestJS 微服务组成：

- `auth-service`（:8889）：登录、注册、Token 签发/刷新/校验
- `backend`（:8888）：业务 BFF，文章/评论/用户等，并通过 `AuthClientService` 将 `/api/v1/auth/*` 转发给 auth-service
- `log-service`（:8890）：仅内部使用，前端不直接调用

当前前端 → backend → auth-service 的转发链路增加了不必要的跳数和故障点。随着服务拆分清晰，需要在 BFF 上一层引入 APISIX API Gateway 作为统一入口，使前端直接通过网关访问 auth-service 和 backend，降低 backend 与 auth-service 的耦合，并为后续限流、日志、灰度等能力打基础。

本次改造不改动认证协议（仍使用 HttpOnly Cookie + `withCredentials: true`），不在网关层做 JWT 校验，保持现有 `RemoteJwtAuthGuard` 调用 `/api/v1/introspect` 的流程。

---

## 目标架构

```
                         移动端用户 / H5
                                |
                                | HTTPS / HTTP
                                v
                  +-----------------------------+
                  |     APISIX API Gateway      |
                  |         :9080 / :9443       |
                  |  统一入口 · 路由 · CORS · TLS |
                  +-----------------------------+
                      |                   |
       /api/v1/auth/* |                   | /api/v1/* (业务)
       /api/v1/introspect|                | /api/health/*
                      v                   v
            +----------------+   +----------------+
            |  auth-service  |   |    backend     |
            |     :8889      |   |     :8888      |
            +----------------+   +----------------+
```

---

## 推荐方案

### 1. APISIX 部署方式

**推荐：docker-compose + APISIX standalone 模式**

- 仓库当前无 Docker / 编排配置，standalone 模式无需 etcd，配置通过 `apisix.yaml` 文件管理，与 Git 版本控制一致。
- 本地开发可一键启动；初次上线改动最小，便于验证与回滚。
- 未来需要动态路由 / Dashboard 时，再演进到 etcd 模式。

### 2. 路由分发设计

| 前端请求路径          | 目标服务          | 说明                                     |
| --------------------- | ----------------- | ---------------------------------------- |
| `/api/v1/auth/*`      | auth-service:8889 | 登录/注册/刷新/登出，直接设置 Cookie     |
| `/api/v1/introspect`  | auth-service:8889 | backend 的 `RemoteJwtAuthGuard` 继续调用 |
| `/api/v1/health/auth` | auth-service:8889 | 重写为 `/api/v1/health`                  |
| `/api/v1/*`           | backend:8888      | 业务接口，带主动健康检查                 |
| `/api/health/*`       | backend:8888      | backend 健康检查                         |
| `/docs/*`             | backend:8888      | backend Swagger                          |
| `/auth/docs/*`        | auth-service:8889 | auth-service Swagger（重写为 `/docs`）   |
| `/gateway/health`     | APISIX 自身       | 静态响应 `{ status: "ok" }`              |

### 3. backend 改造策略

**推荐：网关直连 auth-service，backend 逐步清理转发代码**

- **Phase 1**：
  - APISIX 直接将 `/api/v1/auth/*` 路由到 auth-service。
  - backend 保留 `AuthClientService.introspect()` 和 `RemoteJwtAuthGuard` 供业务接口 JWT 校验。
  - backend 的 `AuthController` 保留但不再被调用，作为应急回滚手段，并标记 `@Deprecated`。
- **Phase 2**（稳定 1-2 周后）：
  - 删除 backend `AuthController` 及 `AuthModule` 中相关引用。
  - 清理 `AuthClientService.forwardRequest()` / `forwardRequestWithHeaders()` / `healthCheck()`。

---

## 关键文件改动清单

### 新增文件

| 文件                               | 说明                                          |
| ---------------------------------- | --------------------------------------------- |
| `docker-compose.yml`               | APISIX + 3 服务 + MySQL + Redis 本地/单机编排 |
| `infra/apisix/conf/config.yaml`    | APISIX 主配置（standalone 模式开关、日志等）  |
| `infra/apisix/conf/apisix.yaml`    | APISIX 路由、上游、CORS、健康检查配置         |
| `infra/apisix/ssl/.gitkeep`        | 生产证书目录占位                              |
| `services/backend/Dockerfile`      | backend 镜像                                  |
| `services/auth-service/Dockerfile` | auth-service 镜像                             |
| `services/log-service/Dockerfile`  | log-service 镜像                              |
| `.env`（根目录）                   | docker-compose 引用的环境变量模板             |

### 修改文件

| 文件                                                 | 改动                                                                                                   |
| ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `apps/web/.env.*`                                    | `VITE_API_BASE_URL` 指向 APISIX 地址（开发 `http://127.0.0.1:9080/`，生产 `https://api.example.com/`） |
| `apps/web/vite.config.ts`                            | 确认 `/api` 代理目标为 `env.VITE_API_BASE_URL`                                                         |
| `services/backend/.env.*`                            | `AUTH_SERVICE_URL` 在容器网络中使用 `http://auth-service:8889`；`ALLOWED_ORIGINS` 改为前端域名         |
| `services/auth-service/.env.production`              | `ALLOWED_ORIGINS` 改为前端域名                                                                         |
| `services/backend/src/auth/auth.controller.ts`       | Phase 1 标记弃用；Phase 2 删除                                                                         |
| `services/backend/src/shared/auth-client.service.ts` | Phase 2 删除无用转发方法，保留 `introspect()`                                                          |
| `services/backend/src/auth/auth.module.ts`           | Phase 2 移除 `AuthController` 引用                                                                     |

---

## 核心配置示例

### APISIX 路由配置（`infra/apisix/conf/apisix.yaml`）

```yaml
routes:
  - uri: /api/v1/auth/*
    upstream:
      nodes:
        'auth-service:8889': 1
      type: roundrobin
    plugins:
      proxy-rewrite:
        regex_uri: ['^/api/v1/auth/(.*)', '/api/v1/auth/$1']
      cors:
        allow_origins: '*'
        allow_methods: 'GET,POST,PUT,DELETE,PATCH,OPTIONS'
        allow_headers: 'Content-Type,Authorization,X-Requested-With'
        allow_credential: true
        max_age: 86400

  - uri: /api/v1/introspect
    methods: [POST]
    upstream:
      nodes:
        'auth-service:8889': 1
      type: roundrobin

  - uri: /api/v1/*
    priority: 1
    upstream:
      nodes:
        'backend:8888': 1
      type: roundrobin
      checks:
        active:
          healthy: { interval: 5, successes: 2 }
          unhealthy: { interval: 5, http_failures: 3 }
          type: http
          http_path: /api/health/database
    plugins:
      cors:
        allow_origins: '*'
        allow_methods: 'GET,POST,PUT,DELETE,PATCH,OPTIONS'
        allow_headers: 'Content-Type,Authorization,X-Requested-With'
        allow_credential: true
        max_age: 86400

  - uri: /gateway/health
    plugins:
      static:
        content: '{"status":"ok","service":"apisix"}'
        content_type: 'application/json'
        status: 200
```

### docker-compose 核心服务（`docker-compose.yml`）

```yaml
services:
  apisix:
    image: apache/apisix:3.12.0-debian
    ports: ['9080:9080', '9443:9443']
    volumes:
      - ./infra/apisix/conf/config.yaml:/usr/local/apisix/conf/config.yaml:ro
      - ./infra/apisix/conf/apisix.yaml:/usr/local/apisix/conf/apisix.yaml:ro
      - ./infra/apisix/ssl:/usr/local/apisix/conf/ssl:ro
    networks: [claude-net]
    depends_on: [auth-service, backend]

  auth-service:
    build: ./services/auth-service
    environment:
      - NODE_ENV=production
      - PORT=8889
      - DATABASE_URL=${DATABASE_URL}
      - REDIS_HOST=redis
      - ALLOWED_ORIGINS=${ALLOWED_ORIGINS}
    networks: [claude-net]
    depends_on: [mysql, redis]

  backend:
    build: ./services/backend
    environment:
      - NODE_ENV=production
      - PORT=8888
      - DATABASE_URL=${DATABASE_URL}
      - REDIS_HOST=redis
      - ALLOWED_ORIGINS=${ALLOWED_ORIGINS}
      - AUTH_SERVICE_URL=http://auth-service:8889
      - LOG_SERVICE_URL=http://log-service:8890
    networks: [claude-net]
    depends_on: [mysql, redis, auth-service]

  log-service:
    build: ./services/log-service
    environment:
      - NODE_ENV=production
      - PORT=8890
    networks: [claude-net]

  mysql:
    image: mysql:8.0
    environment:
      - MYSQL_ROOT_PASSWORD=${MYSQL_ROOT_PASSWORD}
    volumes: [mysql-data:/var/lib/mysql]
    networks: [claude-net]

  redis:
    image: redis:7-alpine
    networks: [claude-net]

networks:
  claude-net: { driver: bridge }
volumes:
  mysql-data:
```

---

## Cookie、CORS、HTTPS 要点

- **Cookie 透传**：APISIX 默认透传 `Cookie` / `Set-Cookie`，auth-service 设置 Cookie 时不指定 `domain`，浏览器自动绑定到网关域名。
- **CORS**：由 APISIX 统一处理，开发期 `allow_origins: "*"`（实际会回显 Origin），生产期改为前端域名白名单。
- **HTTPS**：生产在 APISIX 终止 TLS，服务内部保持 HTTP；`secure: true` / `sameSite: strict` 仅在生产生效。
- **健康检查**：backend upstream 探测 `/api/health/database`；网关自身提供 `/gateway/health`。

---

## 本地开发调试

1. 启动数据库：`docker-compose up -d mysql redis`
2. 本地启动三个 NestJS 服务：`npm run start:dev`
3. 启动 APISIX：
   ```bash
   docker run -d --name apisix-local \
     -p 9080:9080 -p 9443:9443 \
     -v $(pwd)/infra/apisix/conf/config.yaml:/usr/local/apisix/conf/config.yaml:ro \
     -v $(pwd)/infra/apisix/conf/apisix.yaml:/usr/local/apisix/conf/apisix.yaml:ro \
     --network host \
     apache/apisix:3.12.0-debian
   ```
4. 修改 `apps/web/.env.development`：`VITE_API_BASE_URL='http://127.0.0.1:9080/'`
5. 运行 `npm run dev`，通过浏览器 Network 面板确认请求发往 `http://127.0.0.1:9080/api/v1/...`

---

## 验证步骤

- [ ] `/gateway/health` 返回 `{"status":"ok","service":"apisix"}`
- [ ] `/api/v1/auth/login` 返回 200 并设置 `accessToken`、`refreshToken` HttpOnly Cookie
- [ ] `/api/v1/auth/refresh` 更新 Cookie
- [ ] `/api/v1/auth/logout` 清除 Cookie
- [ ] 未登录访问 `/api/v1/user/info` 返回 401
- [ ] 登录后 `/api/v1/user/info`、`/api/v1/article/list`、`/api/v1/category/list` 正常返回
- [ ] 前端 H5 登录、浏览、点赞流程正常
- [ ] backend 节点故障时 APISIX 健康检查标记为不健康

---

## 风险与回滚

| 风险                                     | 缓解措施                                                                  |
| ---------------------------------------- | ------------------------------------------------------------------------- |
| Cookie 域/路径不一致导致 401             | 保持 `path='/'`、`domain` 未指定；生产网关与前端同域或正确配置 `sameSite` |
| CORS 双重设置导致预检失败                | APISIX 统一处理 CORS，服务层白名单化                                      |
| 路径重写错误导致 404                     | 优先匹配 `/api/v1/auth/*`，再匹配 `/api/v1/*`                             |
| 生产 HTTPS 未启用导致 secure Cookie 失败 | 生产必须启用 APISIX HTTPS                                                 |

**回滚策略**：

- 网关配置错误：还原 `infra/apisix/conf/apisix.yaml` 并重启容器。
- 前端问题：回滚 `VITE_API_BASE_URL` 到旧 backend 地址。
- auth-service 新 bug：Phase 1 可临时将 APISIX `/api/v1/auth/*` 指回 backend `AuthController`。
- 全面回滚：DNS 切回旧入口 + 前端 baseURL 回滚。

---

## 实施阶段

1. **Phase 1**：新增 APISIX 配置、Dockerfile、docker-compose；前端 baseURL 切到网关；backend `AuthController` 保留但不再被调用。
2. **Phase 2**（稳定 1-2 周后）：删除 backend `AuthController` 及无用转发方法。
3. **Phase 3**（可选）：启用 APISIX 限流、WAF、日志收集等高级插件。

---

## 待确认问题

1. 生产环境 APISIX 的域名是什么？（用于 `VITE_API_BASE_URL` 和证书配置）
2. 是否希望 APISIX 直接做 JWT 校验？（当前计划维持 backend `RemoteJwtAuthGuard` 调用 `/introspect`）
3. 是否已有 etcd 集群，还是采用 standalone 模式？
4. 是否需要 APISIX 同时代理 `/api/v1/logs/*` 到 log-service？
