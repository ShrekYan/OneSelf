# 核心架构决策（自动加载）

## 决策文件清单

| 决策类型 | 文件路径 | 说明 |
|---------|---------|------|
| 技术决策 | @.claude/TECH-DECISIONS.md | 后端架构决策（ADR-001 ~ ADR-020）+ 前端架构决策（FADR-001 ~ FADR-018） |
| 业务决策 | @.claude/BUSINESS-DECISIONS.md | 前端业务决策（FBDR-001 ~ FBDR-015）+ 后端业务决策（BBDR-001 ~ BBDR-031） |
| 后端业务决策 | @.claude/BACKEND-BUSINESS-DECISIONS.md | backend / auth-service / log-service 业务规则 |
| 前端业务决策 | @.claude/FRONTEND-BUSINESS-DECISIONS.md | apps/web H5 业务规则 |
| 后端技术决策 | @.claude/BACKEND-DECISIONS.md | 后端架构决策原始文件 |
| 前端技术决策 | @.claude/FRONTEND-DECISIONS.md | 前端架构决策原始文件 |

**以上决策文件通过 `@path` 引用方式在 Claude Code 启动时自动加载，请严格遵守所有已确认的架构决策与业务决策。**

## 按需读取规则

在进行任何涉及架构或业务判断的任务时，必须根据当前讨论主题**按需读取**对应的决策文件，禁止仅凭记忆推断：

### 技术决策场景

当任务涉及以下主题时，必须读取技术决策文件（优先读取合并版 TECH-DECISIONS.md，必要时读取 BACKEND-DECISIONS.md / FRONTEND-DECISIONS.md 原始文件）：

- 系统架构、服务边界、模块分层
- 安全与认证方案（HttpOnly Cookie、Argon2id、Token 管理）
- 数据库与 ORM 设计（Prisma 命名、BigInt 时间戳、Redis 策略）
- 性能与缓存方案（GZIP、预加载、压缩）
- 异常处理、日志、响应格式
- NestJS / React / Vite / MobX 技术栈选型
- 路由、API 封装、构建优化

### 业务决策场景

当任务涉及以下主题时，必须读取业务决策文件（优先读取合并版 BUSINESS-DECISIONS.md，必要时读取 BACKEND-BUSINESS-DECISIONS.md / FRONTEND-BUSINESS-DECISIONS.md 原始文件）：

- 前端页面职责与数据展示规则（首页、发现、搜索、文章、个人中心）
- 用户认证旅程（注册、登录、登出、redirect）
- 文章/内容业务（发布状态、内容块、阅读量、特色文章）
- 分类/搜索业务（分类展示、热门关键词、搜索匹配）
- 点赞/收藏/评论互动业务
- 用户资料与权限边界
- DTO 契约、时间格式、标签格式
- 一致性层级与异常语义

### 读取优先级

1. **优先读取合并版**：技术决策读 TECH-DECISIONS.md，业务决策读 BUSINESS-DECISIONS.md。
2. **按需补充原始文件**：当合并版内容不足以判断时，读取对应的 BACKEND-DECISIONS.md / FRONTEND-DECISIONS.md 或 BACKEND-BUSINESS-DECISIONS.md / FRONTEND-BUSINESS-DECISIONS.md。
3. **禁止反向推断**：不得因为代码当前实现与决策文件冲突，就默认代码为正确来源；必须以决策文件为准进行改造。
