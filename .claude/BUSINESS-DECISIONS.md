# 业务决策引导文件（前端 + 后端业务）

> **文档说明**: 本文件是业务决策层的完整引导文件，合并了前端和后端的所有业务决策。
>
> **定位**: 说明前后端在业务链路中"负责什么、不负责什么、如何呈现业务状态、如何与事实源协作"。不重复记录技术架构规则。
>
> **组成**:
> - 第一部分：前端业务决策（FBDR-001 ~ FBDR-015）
> - 第二部分：后端业务决策（BBDR-001 ~ BBDR-031）
>
> **原始文件**: 本文件内容来自 `.claude/FRONTEND-BUSINESS-DECISIONS.md` 和 `.claude/BACKEND-BUSINESS-DECISIONS.md`，原始文件保留，内容同步更新。
>
> **最后更新**: 2026-06-21

---

# 第一部分：前端业务决策 Frontend Business Decision Records

> **文档说明**: 本部分记录 `apps/web` H5 移动端应用的业务层决策。
>
> **定位**: 说明前端在业务链路中"负责什么、不负责什么、如何呈现业务状态、如何与后端事实源协作"。不重复记录 React、MobX、路由、样式等技术架构规则。
>
> **依据来源**:
> - 页面路由: `apps/web/src/routes/modules/`
> - 业务页面: `apps/web/src/pages/`
> - API 契约: `apps/web/src/api/`
> - 后端接口: `services/backend/src/**`、`services/auth-service/src/**`
>
> **最后更新**: 2026-05-28

---

## 1. 前端业务定位

### FBDR-001: 前端是移动端内容消费与互动入口，不是业务事实源

**状态**: ✅ 已采纳

**决策**:
- `apps/web` 定位为 H5 移动端博客内容消费应用。
- 前端负责首页、发现、搜索、文章列表、文章详情、个人中心、登录注册等用户旅程。
- 前端状态只作为展示缓存、交互缓存和请求结果缓存。
- 文章是否发布、用户是否有权限、点赞是否成功、用户是否真实登录，最终以后端接口结果为准。

**依据**:
- 路由包含 `/home`、`/explore`、`/profile`、`/search`、`/article/:id`、`/articles/:categoryId?`、`/login`、`/register`。
- 后端已经提供文章列表、特色文章、文章详情、点赞、用户信息、分类、热门关键词等接口。

**为什么**:
- H5 页面可刷新、可回退、可缓存，本地状态天然不可靠。
- 用户可通过调试工具修改前端状态，所以前端不能成为权限或业务状态裁决方。
- 后端是多端共享的统一事实源。

**边界约束**:
- ❌ 前端不得仅凭 MobX/local state 判定文章、点赞、登录态的最终结果。
- ❌ 前端不得把本地 mock 数据作为生产业务事实。
- ✅ 关键页面进入或关键操作完成后，应以后端返回数据校准展示状态。

---

## 2. 页面业务分层

### FBDR-002: 首页承担"推荐内容 + 最新内容"入口

**状态**: ✅ 已采纳

**决策**:
- `/home` 是内容消费主入口。
- 首页业务信息分为两类：
  - 特色文章：后端 `article/featured` 返回置顶且已发布文章，最多 5 条。
  - 普通文章流：后端 `article/list` 返回已发布文章分页列表。
- 首页展示允许缓存和保留滚动位置，但刷新业务事实必须以后端返回为准。

**依据**:
- `services/backend/src/article/article.service.ts` 中 `getFeaturedArticles()` 查询 `is_top=true` 且 `is_published=true`，限制 5 条。
- `queryArticleList()` 默认只查 `is_published=true`。
- `apps/web/src/routes/modules/discover.routes.tsx` 将 `/home` 设置为底部 Tab 缓存页面。

**为什么**:
- 首页是高频访问页面，需要兼顾首屏速度和内容新鲜度。
- 置顶内容代表运营或平台推荐，不应由前端自行筛选。
- 已发布过滤必须由后端完成，避免未发布内容泄露。

**边界约束**:
- ❌ 前端不得自行把非置顶文章包装成特色文章用于真实业务展示。
- ❌ 前端不得展示 `is_published=false` 的文章。
- ✅ 首页 mock 数据只能用于开发兜底或 UI 调试，接入接口后不得作为主路径。

---

### FBDR-003: 发现页承担分类导航，不承担分类规则裁决

**状态**: ✅ 已采纳

**决策**:
- `/explore` 负责展示分类卡片、分类入口和用户探索路径。
- 分类名称、图片、描述、排序、文章数量以后端 `category/list` 返回为准。
- 前端可以缓存分类列表 5 分钟，用于提升切换体验。

**依据**:
- `categoryApi.getList()` 缓存 5 分钟。
- 后端 `CategoryService.getList()` 只返回 `is_active=true` 分类，并按 `sort_order desc` 排序。

**为什么**:
- 分类是运营配置型数据，前端硬编码会导致和后台不一致。
- 分类下文章数 `articleCount` 是后端聚合结果，前端不应本地计算。
- 5 分钟缓存适合低频变化的分类数据。

**边界约束**:
- ❌ 前端不得显示后端未返回或已停用分类。
- ❌ 前端不得自行调整生产分类排序。
- ✅ 分类点击只负责跳转或携带 `categoryId` 查询文章列表。

---

### FBDR-004: 搜索页承担搜索意图采集和结果展示

**状态**: ✅ 已采纳

**决策**:
- `/search` 负责用户关键词输入、热门关键词展示、搜索提交和搜索结果展示。
- 热门关键词以后端 `category/hot-keywords` 返回为准。
- 搜索结果通过文章列表接口的 `keyword` 参数获取，匹配规则由后端定义。
- 前端可以使用 debounce 降低请求频率，但不得改变搜索语义。

**依据**:
- `categoryApi.getHotKeywords()` 调用 `/api/v1/category/hot-keywords`，缓存 5 分钟。
- 后端文章搜索当前匹配 title 或 summary 包含关键词。
- 前端存在 `useDebouncedSearch`、`useHandleSearchSubmit` 等搜索业务 Hook。

**为什么**:
- 热门关键词是运营/行为数据，不应写死在前端。
- 搜索匹配规则可能从简单 LIKE 演进到全文索引，前端应保持透明。
- debounce 是交互优化，不是业务规则。

**边界约束**:
- ❌ 前端不得本地过滤文章列表替代后端搜索。
- ❌ 前端不得缓存用户敏感搜索内容到长期存储。
- ✅ 搜索失败应展示可重试状态，不伪造空结果为真实无数据。

---

### FBDR-005: 文章列表页只展示公开可见文章

**状态**: ✅ 已采纳

**决策**:
- `/articles/:categoryId?` 负责按分类、关键词、排序展示文章分页列表。
- 列表项只展示文章摘要级信息，不承载完整正文。
- 是否可见、是否已发布、分页总数、是否还有更多，以后端响应为准。

**依据**:
- 后端 `queryArticleList()` 默认 `is_published=true`。
- 响应包含 `list`、`total`、`page`、`pageSize`、`hasMore`。

**为什么**:
- 列表页用于快速浏览，正文加载应延迟到详情页，降低首屏压力。
- `hasMore` 和 `total` 由后端计算，避免前端分页错乱。
- 发布状态是服务端业务规则，前端不能自行判断。

**边界约束**:
- ❌ 前端不得从详情缓存拼装列表作为正式列表数据。
- ❌ 前端不得自行生成分页总数或 `hasMore`。
- ✅ 列表页应能处理空列表、加载中、加载失败、无更多数据状态。

---

### FBDR-006: 文章详情页是阅读行为和互动行为的主场景

**状态**: ✅ 已采纳

**决策**:
- `/article/:id` 展示文章完整内容、作者、分类、标签、阅读量、点赞数、评论数、当前用户点赞状态。
- 阅读量由后端在详情接口中异步递增，前端只展示返回值。
- 文章内容块由后端转换后返回，前端负责按内容块类型渲染。
- `isLiked` 以后端基于当前用户身份返回或单独查询结果为准。

**依据**:
- `ArticleService.getArticleDetail()` 会查询文章、分类、内容块，并异步 `views increment 1`。
- 详情 DTO 返回 `content`、`isLiked`、`isCollected=false`、`seoKeywords`、`seoDescription`。

**为什么**:
- 阅读量存在并发，必须由后端原子更新。
- 内容块顺序和类型由后端维护，前端不应猜测正文结构。
- 用户互动状态和用户身份相关，不能由公开列表推断。

**边界约束**:
- ❌ 前端不得本地递增阅读量后当作最终值提交或缓存。
- ❌ 前端不得仅凭本地 liked 状态决定用户真实是否已点赞。
- ✅ 点赞后必须以后端 `toggle-like` 返回的 `likes` 和 `isLiked` 校准 UI。

---

## 3. 用户与认证业务

### FBDR-007: 前端登录态只做体验优化，不能作为安全边界

**状态**: ✅ 已采纳

**决策**:
- 前端通过 HttpOnly Cookie 自动携带认证凭证。
- 前端可缓存用户基础信息到 `sessionStorage`，用于减少重复请求和提升首屏体验。
- 受保护页面进入时，必须通过 `getCurrentUser()` 或后端接口确认登录态。
- 登录失败、Token 过期、用户禁用等结果以后端错误码为准。

**依据**:
- `RouteInterceptor` 对 `/profile`、`/settings`、`/article/edit`、`/publish` 做认证检查。
- `getCurrentUser()` 调用 `/api/v1/user/info`，并设置 `skipAuth`、`skipErrorToast` 由路由统一处理。
- 认证 Cookie 由后端设置，前端 API 不读取 Token。

**为什么**:
- HttpOnly Cookie 无法被 JS 读取，符合安全目标。
- sessionStorage 中的用户信息只是展示缓存，不具备认证含义。
- 用户可能在其他设备登出、Token 过期或账号被禁用，前端缓存必须可被后端否定。

**边界约束**:
- ❌ 前端不得从 localStorage/sessionStorage 读取 accessToken/refreshToken 做认证。
- ❌ 前端不得把有 `userInfo` 缓存等同于已登录。
- ✅ 认证失败必须清理本地用户展示缓存并跳转登录页。

---

### FBDR-008: 登录/注册成功后的用户旅程由 redirect 驱动

**状态**: ✅ 已采纳

**决策**:
- 访问受保护页面未登录时，前端跳转 `/login?redirect=原路径`。
- 登录或注册成功后，应优先回到 redirect 指向的原业务页面。
- 没有 redirect 时，默认进入首页或个人中心等明确入口。

**依据**:
- `RouteInterceptor` 未认证时构造 `redirect = pathname + search` 并跳转登录页。
- auth API 返回用户信息和 Token，但 Token 存入 Cookie，由浏览器自动处理。

**为什么**:
- 保持用户任务连续性，例如"想进个人中心 → 登录 → 回个人中心"。
- 避免登录成功后固定跳首页造成操作中断。
- redirect 只作为导航意图，不承载授权结果。

**边界约束**:
- ❌ redirect 不得允许跳转到外部不可信站点。
- ❌ 登录页不得记录或展示敏感认证错误细节。
- ✅ 登录成功后应刷新/写入用户展示信息缓存。

---

### FBDR-009: 个人中心展示当前用户视角，不展示权限外用户数据

**状态**: ✅ 已采纳

**决策**:
- `/profile` 代表当前登录用户的个人中心。
- 用户资料从 `/user/info` 获取，展示用户名、昵称、头像、邮箱等允许展示字段。
- "我的文章""已保存阅读""阅读统计""偏好设置"等菜单是当前用户视角入口。

**依据**:
- `Profile` 在受保护路由前缀 `/profile` 下。
- 后端 `UsersController` 整体使用 `RemoteJwtAuthGuard`。
- `UserDto` 只返回 `id`、`username`、`email`、`nickname`、`avatar`。

**为什么**:
- 个人中心属于强登录场景，必须绑定当前认证用户。
- 前端菜单项可以先作为产品入口，但真实数量与权限以后端为准。
- 用户资料字段需要限制，避免泄露认证敏感信息。

**边界约束**:
- ❌ 前端不得通过传入任意 userId 获取"当前用户信息"。
- ❌ 前端不得展示密码、Token、password_algorithm 等认证字段。
- ✅ 用户资料更新后必须清理或刷新本地缓存。

---

## 4. 互动业务

### FBDR-010: 点赞是登录用户行为，前端可乐观但必须回滚

**状态**: ✅ 已采纳

**决策**:
- 点赞/取消点赞调用后端 `article/toggle-like`。
- 前端可以为了体验做按钮态或数量的临时乐观更新。
- 接口成功后必须以后端返回 `likes`、`isLiked` 覆盖本地状态。
- 接口失败时必须回滚 UI，并提示用户重试或登录。

**依据**:
- 后端 `toggleLike()` 需要 `RemoteJwtAuthGuard`，按当前用户和文章 ID 切换点赞记录。
- 后端事务同时更新点赞记录和文章 likes 计数。

**为什么**:
- 点赞涉及用户身份、唯一约束和计数一致性，不能由前端独立完成。
- 并发点赞场景下本地累加容易不准确。
- 乐观 UI 可以提升体验，但不能改变最终事实。

**边界约束**:
- ❌ 未登录用户不得在前端伪造点赞成功。
- ❌ 前端不得自行写入 likes 计数作为长期缓存。
- ✅ 点赞按钮需要防重复点击或处理并发请求返回顺序。

---

### FBDR-011: 收藏/已保存阅读当前是前端入口，不是已完成业务事实

**状态**: ✅ 已采纳

**决策**:
- `Saved Reading`、`isCollected` 当前只能视为产品预留能力或静态入口。
- 后端当前文章详情固定返回 `isCollected=false`，尚未提供收藏表和收藏接口。
- 前端不得将收藏能力包装为已上线完整业务。

**依据**:
- `ArticleService.getArticleDetail()` 返回 `isCollected: false`。
- 当前 Prisma 模型包含 `ArticleLikes`，未看到收藏模型。
- 前端 Profile 菜单存在 `saved` 项。

**为什么**:
- 明确区分"设计入口/占位能力"和"真实业务能力"。
- 避免用户产生收藏成功但后端无法保存的错觉。
- 后续实现收藏时需要补齐后端事实源、接口、权限和缓存策略。

**边界约束**:
- ❌ 前端不得仅用 localStorage 实现生产收藏业务。
- ❌ 不得展示收藏成功永久生效的提示，除非后端已落库。
- ✅ 若保留入口，应标识为未开放、开发中或隐藏。

---

### FBDR-012: 评论当前仅展示统计，不作为已完成交互闭环

**状态**: ✅ 已采纳

**决策**:
- 前端可以展示文章的 `commentsCount`。
- 当前后端模型和接口未形成完整评论 CRUD，前端不得实现正式评论发布链路。
- 评论区如需展示，应明确依赖后端后续评论接口。

**依据**:
- `Articles` 模型存在 `comments_count` 字段。
- 当前读取到的后端 Controller 未包含评论发布、回复、删除接口。

**为什么**:
- 统计字段存在不代表评论业务闭环已经存在。
- 评论涉及内容审核、权限、删除、回复、通知等完整规则。
- 前端提前实现本地评论会造成数据丢失和业务不一致。

**边界约束**:
- ❌ 前端不得把本地评论列表当成真实评论。
- ❌ 不得提供真实评论提交入口，除非后端接口和审核规则完成。
- ✅ 仅展示评论数时，应以后端返回 `commentsCount` 为准。

---

## 5. 数据缓存与刷新业务

### FBDR-013: 可缓存的是低风险展示数据，不可缓存的是权限与写入结果

**状态**: ✅ 已采纳

**决策**:
- 分类列表、热门关键词可缓存 5 分钟。
- 首页 Tab、发现 Tab、个人中心 Tab 可通过 KeepAlive 保留页面状态。
- 用户权限、登录有效性、点赞写入结果、用户资料更新结果不得仅依赖缓存。

**依据**:
- `categoryApi` 对分类和热门关键词启用 5 分钟 RequestCache。
- `/home`、`/explore`、`/profile` 使用 KeepAlive。
- 认证检查和用户信息查询通过接口确认。

**为什么**:
- 低频变化数据缓存收益高，风险低。
- 权限和写操作结果具有强一致性要求。
- KeepAlive 保留的是页面体验状态，不是业务事实。

**边界约束**:
- ❌ 不得缓存 Token 到 JS 可读存储。
- ❌ 不得用缓存绕过受保护路由认证检查。
- ✅ 关键写操作成功后，应刷新相关列表或局部更新并以后端响应为准。

---

## 6. 异常与空状态业务

### FBDR-014: 前端错误展示要面向用户任务，不暴露内部实现

**状态**: ✅ 已采纳

**决策**:
- 列表类页面必须区分：加载中、空数据、加载失败、无更多。
- 认证失败统一跳登录，不在业务页暴露技术错误。
- 文章不存在、已下线、无权限访问，需要展示用户可理解的状态。
- 后端错误码用于前端分流处理，但错误文案应面向用户场景。

**依据**:
- 后端统一 BusinessException 和错误码机制。
- 前端 API 支持 `skipErrorToast` 等配置，允许页面自定义错误处理。

**为什么**:
- 用户关心"下一步能做什么"，不是 Prisma、JWT、Redis 等内部失败原因。
- 统一错误体验降低页面重复逻辑。
- 安全上也不能把内部异常细节展示到客户端。

**边界约束**:
- ❌ 前端不得展示数据库字段、堆栈、Token 等敏感信息。
- ❌ 不得把接口失败误展示为空数据，除非业务明确允许。
- ✅ 错误场景应提供返回、重试、重新登录等可执行动作。

---

## 7. 当前业务差异与待确认项

### FBDR-015: 前端存在历史/占位业务，需要区分真实业务与遗留页面

**状态**: ⚠️ 待治理

**发现**:
- 路由中存在 `/transactionRecord`、`/result-detail` 等交易相关页面，但项目当前定位是博客内容平台。
- `apps/web/src/api/product/index.ts` 存在商品列表 API，但当前后端主业务服务读取到的是文章、分类、用户、点赞。
- `usePersistentUser` 示例中出现 token 字段和 localStorage 用户持久化能力，和 HttpOnly Cookie 决策存在潜在冲突。

**决策**:
- 交易、商品相关页面/API 暂定为历史遗留或示例代码，不纳入当前博客核心业务决策。
- 若未来确认要做电商/交易业务，必须单独补充业务域、后端模型、权限、订单状态机和支付安全决策。
- `usePersistentUser` 不得用于存储 Token；如保留，只能存非敏感展示资料，并优先改为 session 级缓存。

**为什么**:
- 混入非博客业务会干扰架构边界和 Agent 判断。
- 交易业务涉及资金安全，不能按普通内容展示逻辑处理。
- Token 存储策略已经明确为 HttpOnly Cookie。

**边界约束**:
- ❌ 不得在新增博客功能时复用 product/transaction 作为业务模板。
- ❌ 不得把 token 放入 `usePersistentUser` 或 localStorage。
- ✅ 遗留页面如继续保留，应在路由或文档中标注状态。

---

## 8. 前端业务检查清单

- [ ] 页面展示的数据是否来自对应后端接口，而不是长期 mock？
- [ ] 登录态是否经过后端确认，而不是只看本地缓存？
- [ ] 点赞、资料更新等写操作是否以后端返回值校准 UI？
- [ ] 分类、热门关键词是否以后端激活数据为准？
- [ ] 文章列表和详情是否只展示公开可见内容？
- [ ] 收藏、评论、交易、商品等未闭环能力是否避免伪装成已上线业务？
- [ ] 错误状态是否给用户明确下一步动作？
- [ ] 是否没有在 localStorage/sessionStorage 中保存 Token？

---

# 第二部分：后端业务决策 Backend Business Decision Records

> **文档说明**: 本部分记录 `services/auth-service`、`services/backend`、`services/log-service` 的后端业务层决策。
>
> **定位**: 说明后端各服务在业务域中的数据归属、业务规则、接口语义、权限边界和一致性要求。不重复记录 NestJS、Prisma、Redis、异常过滤器等技术架构决策。
>
> **依据来源**:
> - 认证服务: `services/auth-service/src/`
> - 主业务服务: `services/backend/src/`
> - 数据模型: `services/*/prisma/schema.prisma`
> - 前端业务决策: `.claude/FRONTEND-BUSINESS-DECISIONS.md`
>
> **最后更新**: 2026-05-28

---

## 1. 后端业务域划分

### BBDR-001: 后端按认证域、内容域、日志域分治

**状态**: ✅ 已采纳

**决策**:
- `auth-service` 负责认证生命周期：注册、登录、刷新、登出、Token 校验、账号可用性。
- `backend` 负责内容平台主业务：文章、分类、热门关键词、点赞、用户展示资料。
- `log-service` 负责审计、操作日志、行为分析，不裁决核心业务状态。
- 服务之间通过 HTTP API 和最小必要上下文协作，不共享业务实现。

**依据**:
- `auth-service` 提供 `/auth/login`、`/auth/register`、`/auth/refresh`、`/auth/logout`、`/introspect`。
- `backend` 提供 `/article/*`、`/category/*`、`/user/info`。
- 架构文档定义 auth/backend/log 三服务边界。

**为什么**:
- 认证、安全、内容、审计的变化频率和安全等级不同。
- 业务边界清晰后，可以降低跨服务耦合。
- 未来新增服务可复用统一认证，不重复实现登录态逻辑。

**边界约束**:
- ❌ `backend` 不重新实现登录、注册、Token 签发业务。
- ❌ `auth-service` 不处理文章、分类、点赞等内容业务。
- ❌ `log-service` 不反向修改文章、用户、点赞等核心业务数据。
- ✅ 跨服务调用只传 userId、资源 ID、trace 信息等必要上下文。

---

## 2. 认证业务决策

### BBDR-002: 手机号是当前注册登录主账号标识

**状态**: ✅ 已采纳

**决策**:
- 注册接口使用 `mobile + password` 创建用户。
- 数据库当前将手机号写入 `Users.username` 字段。
- 登录接口使用 `username + password`，当前 username 语义上对应手机号。
- 手机号唯一性由 `Users.username` 唯一约束保障。

**依据**:
- `AuthService.register()` 从 `RegisterDto` 读取 `mobile`，查询 `where: { username: mobile }`。
- 创建用户时 `username: mobile`。
- `Users.username` 有唯一索引 `uk_username`。

**为什么**:
- 手机号适合移动端 H5 登录注册流程。
- 用唯一账号标识可以简化登录认证和用户缓存。
- 保留字段名 `username` 为未来用户名/手机号兼容留下空间。

**边界约束**:
- ❌ 注册时不得允许重复 mobile/username。
- ❌ 前端验证码字段不能被视为后端已验证，除非后端短信验证码能力真实接入。
- ✅ 如果未来支持邮箱/用户名登录，必须明确账号标识归一化规则。

---

### BBDR-003: 注册成功即登录

**状态**: ✅ 已采纳

**决策**:
- 用户注册成功后，后端立即生成 Access Token 和 Refresh Token。
- 注册响应返回用户基础信息和登录有效期。
- Controller 同步设置 HttpOnly Cookie。

**依据**:
- `AuthService.register()` 创建用户后调用 `generateAndSaveTokens()`。
- `AuthController.register()` 调用 `setAuthCookies()`。
- `RegisterResponseDto` 包含 `accessToken`、`refreshToken`、`expiresIn`、`user`。

**为什么**:
- 移动端注册后通常希望直接进入业务，不再二次登录。
- 减少用户路径摩擦。
- Cookie 模式下前端无需处理 Token 存储。

**边界约束**:
- ❌ 注册成功后不得只返回用户资料而不建立会话，除非产品明确改为注册后审核。
- ❌ 前端不得保存响应中的 Token 到 JS 可读存储。
- ✅ 注册失败必须返回明确业务错误码，如手机号已注册。

---

### BBDR-004: 登录失败原因对用户统一，对系统内部可审计

**状态**: ✅ 已采纳

**决策**:
- 用户名不存在、密码错误等认证失败，对外统一为"用户名或密码错误"类结果。
- 用户禁用可作为独立业务状态返回。
- 内部日志可记录必要排查信息，但不得记录明文密码或完整 Token。

**依据**:
- `AuthService.login()` 密码错误抛 `AUTH_INVALID_CREDENTIALS`。
- 用户 `is_active=false` 抛 `AUTH_USER_DISABLED`。
- 安全规范要求防止账户枚举。

**为什么**:
- 防止攻击者通过错误提示枚举账号。
- 用户禁用是明确业务状态，可以提示用户联系管理员或按产品流程处理。
- 内部审计需要保留失败行为用于安全分析。

**边界约束**:
- ❌ 不得返回"手机号不存在""密码错误"这种可枚举差异。
- ❌ 不得在日志记录明文密码、完整 accessToken、完整 refreshToken。
- ✅ 认证失败应记录频次、IP、用户标识等脱敏上下文。

---

### BBDR-005: Refresh Token 是会话生命周期的后端事实源

**状态**: ✅ 已采纳

**决策**:
- Access Token 只用于短期身份表达。
- Refresh Token 是否有效，以后端 Redis 中是否存在对应记录为准。
- 刷新接口校验 JWT 签名后，还必须校验 Refresh Token 服务端存储状态。
- 登出时删除 Refresh Token；不传 refreshToken 时删除该用户全部 Refresh Token。

**依据**:
- `AuthService.refreshToken()` 先 `jwt.verify()`，再 `validateRefreshToken()` 查询 Redis。
- `AuthService.logout()` 有单设备删除和全设备删除两种语义。
- `RefreshTokenRedisService` 管理 refresh token。

**为什么**:
- 单靠 JWT 自包含无法主动吊销会话。
- Redis TTL 适合会话生命周期管理。
- 支持当前设备登出和全设备登出两种业务诉求。

**边界约束**:
- ❌ 刷新接口不得只验证 JWT 签名而忽略 Redis 状态。
- ❌ accessToken 过期不能自动视为用户登出。
- ✅ Refresh Token 无效或过期应返回明确的重新登录语义。

---

### BBDR-006: Token introspect 是业务服务认证入口

**状态**: ✅ 已采纳

**决策**:
- `auth-service` 通过 `/introspect` 对外提供 Token 校验能力。
- `backend` 的受保护接口通过远程认证守卫获取当前用户 ID。
- 业务接口不得信任前端传入的 userId 作为当前操作者身份。

**依据**:
- `IntrospectController` 提供 `POST /introspect`。
- `ArticleController.toggleLike()`、`my-likes`、`check-like`、`user-likes` 使用 `RemoteJwtAuthGuard` 和 `@CurrentUserId()`。
- `UsersController` 整体使用 `RemoteJwtAuthGuard`。

**为什么**:
- 认证逻辑集中，业务服务只消费认证结论。
- 防止前端伪造 userId 越权操作。
- 多业务服务共享同一认证入口。

**边界约束**:
- ❌ 受保护业务接口不得从 Body/Query 取 userId 作为操作者。
- ❌ `backend` 不直接解析和信任 JWT 业务含义。
- ✅ 当前用户 ID 必须来自认证上下文。

---

## 3. 用户资料业务决策

### BBDR-007: 用户认证资料与展示资料分离但当前共用 Users 表

**状态**: ✅ 已采纳

**决策**:
- `Users` 表当前同时承载认证字段和展示字段。
- 认证字段包括 `username`、`password_hash`、`password_algorithm`、`is_active`。
- 展示字段包括 `email`、`nickname`、`avatar`。
- 对外用户 DTO 只返回允许展示字段，不返回密码哈希、算法、Token 信息。

**依据**:
- `UsersService.mapToDto()` 只返回 `id`、`username`、`email`、`nickname`、`avatar`。
- `Users` Prisma 模型包含认证和展示字段。

**为什么**:
- 当前项目规模下共表可以简化实现。
- DTO 隔离可以避免敏感字段泄露。
- 后续如用户体系复杂，可拆分 profile 表或独立用户资料服务。

**边界约束**:
- ❌ 用户接口不得返回 `password_hash`、`password_algorithm`、refresh token。
- ❌ 资料更新不得允许用户修改自己的认证身份字段，除非走专门认证流程。
- ✅ 对外 DTO 必须显式映射，不能直接返回 Prisma User 实体。

---

### BBDR-008: 当前用户资料接口只服务"当前登录用户"

**状态**: ✅ 已采纳

**决策**:
- `POST /user/info` 获取当前认证用户资料。
- `PUT /user/info` 更新当前认证用户资料。
- 请求体或查询参数中的 userId 不参与当前用户身份判断。

**依据**:
- `UsersController.getUserInfo(@CurrentUserId() userId)`。
- `UsersController.updateProfile(@CurrentUserId() userId, @Body() updateDto)`。

**为什么**:
- 个人中心是当前用户视角，避免越权读取或修改其他用户资料。
- 当前用户身份由认证上下文提供，可信度高于客户端参数。
- API 语义清晰，前端无需传 userId。

**边界约束**:
- ❌ 不得新增 `PUT /user/info?userId=xxx` 这类可越权接口。
- ❌ 管理后台修改用户资料必须走单独 admin 权限体系。
- ✅ 用户不存在时返回统一业务错误 `USER_NOT_FOUND`。

---

### BBDR-009: 用户资料更新后必须同步清理/回填缓存

**状态**: ✅ 已采纳

**决策**:
- 用户资料更新后，必须删除旧用户缓存并同步最新用户信息到 Redis 预加载缓存。
- 数据库仍是用户资料最终事实源。
- 缓存同步失败时需可观测，避免登录或资料展示出现长时间旧数据。

**依据**:
- `UsersService.updateProfile()` 更新 DB 后调用 `deleteUserFromRedis()` 和 `syncSingleUserToRedis()`。

**为什么**:
- 登录链路依赖预加载用户缓存。
- 资料更新后如缓存不刷新，会导致用户看到旧昵称/头像。
- 缓存写穿透有助于读性能和一致性平衡。

**边界约束**:
- ❌ 更新用户资料后不得只改 DB 不处理缓存。
- ❌ Redis 缓存不得被视为唯一真实来源。
- ✅ 用户资料 DTO 应以更新后的数据库记录映射返回。

---

## 4. 内容与文章业务决策

### BBDR-010: 文章是内容域核心聚合根

**状态**: ✅ 已采纳

**决策**:
- `Articles` 是博客内容域核心聚合根。
- 文章关联分类、作者、内容块、点赞记录。
- 文章列表、详情、特色文章、用户文章列表均由 `ArticleService` 统一裁决。

**依据**:
- Prisma `Articles` 关联 `Categories`、`Users`、`ArticleContentBlocks`、`ArticleLikes`。
- `ArticleController` 汇聚文章相关接口。

**为什么**:
- 文章状态影响分类展示、详情访问、点赞、统计、用户主页。
- 聚合在同一服务中维护可以保证查询语义一致。
- 后续扩展草稿、审核、评论时有明确挂载点。

**边界约束**:
- ❌ 分类服务、日志服务不得直接修改文章主体状态。
- ❌ 前端不得通过多个接口拼装并裁决文章发布状态。
- ✅ 文章相关 DTO 必须由服务层显式转换后返回。

---

### BBDR-011: 公开列表只返回已发布文章

**状态**: ✅ 已采纳

**决策**:
- 公开文章列表默认只查询 `is_published=true`。
- 用户发布文章列表也只返回该用户已发布文章。
- 特色文章必须同时满足 `is_top=true` 和 `is_published=true`。

**依据**:
- `queryArticleList()` where 默认 `is_published: true`。
- `queryArticleListByUserId()` where 包含 `author_id` 和 `is_published: true`。
- `getFeaturedArticles()` where 包含 `is_top: true` 和 `is_published: true`。

**为什么**:
- 防止草稿、下线、审核中内容进入公开消费链路。
- 统一公开可见规则，避免不同页面展示不一致。
- 置顶只是推荐属性，不应覆盖发布状态。

**边界约束**:
- ❌ `is_top=true` 不代表可公开展示，必须同时已发布。
- ❌ 用户文章列表不得泄露未发布草稿。
- ✅ 如果未来支持作者查看草稿，必须新增受保护接口并校验作者身份。

---

### BBDR-012: 文章详情当前允许匿名访问，但用户态字段按登录状态增强

**状态**: ✅ 已采纳

**决策**:
- 文章详情接口当前不强制登录。
- 未登录用户可查看公开文章基础内容。
- 如果能获取当前 userId，则返回当前用户是否已点赞。
- 收藏状态当前固定为 `false`，不代表收藏业务已完成。

**依据**:
- `ArticleController.getArticleDetail()` 未使用 `RemoteJwtAuthGuard`，但参数中有可选 `@CurrentUserId() userId?: string`。
- `ArticleService.getArticleDetail()` userId 存在时查询 `ArticleLikes`。
- DTO 中 `isCollected: false`。

**为什么**:
- 博客内容消费应支持未登录阅读，利于传播。
- 登录用户需要个性化互动状态，如是否点赞。
- 收藏业务未建模，不能伪造真实状态。

**边界约束**:
- ❌ 详情接口不得返回未发布文章给匿名用户。
- ❌ `isCollected=false` 不得被解释为已实现收藏查询。
- ✅ 若未来需要匿名和登录两种详情语义，建议显式设计可选认证中间件。

---

### BBDR-013: 阅读量是弱一致统计，不阻塞详情响应

**状态**: ✅ 已采纳

**决策**:
- 获取文章详情时异步递增阅读量。
- 阅读量递增失败不阻塞详情返回。
- 返回给前端的 views 当前按 `article.views + 1` 展示预期新值。

**依据**:
- `getArticleDetail()` 中调用 `this.prisma.articles.update({ data: { views: { increment: 1 } } }).catch(...)`,不 await。

**为什么**:
- 阅读量是统计指标，不应影响阅读主链路。
- 异步递增可以降低详情接口延迟。
- 原子 increment 能避免基本并发丢失。

**边界约束**:
- ❌ 阅读量失败不得导致文章详情失败。
- ❌ 前端不得自行提交阅读量。
- ✅ 高并发或防刷需求出现时，应补充去重、防刷、批量聚合策略。

---

### BBDR-014: 文章内容采用内容块模型

**状态**: ✅ 已采纳

**决策**:
- 文章正文由 `ArticleContentBlocks` 存储。
- 内容块包含 `block_type`、`content`、`sort_order`。
- 详情接口负责将内容块转换为前端可渲染 DTO。

**依据**:
- Prisma 模型 `ArticleContentBlocks` 关联 `Articles`，有 `sort_order` 索引。
- `ArticleService.getArticleDetail()` 调用 `convertArticleContentBlocks()`。

**为什么**:
- 内容块模型比单一富文本字段更利于扩展图片、代码、引用等结构化内容。
- 后端统一转换可以保持前端渲染契约稳定。
- `sort_order` 支持内容块顺序控制。

**边界约束**:
- ❌ 前端不得依赖数据库字段名 `block_type`、`sort_order` 直接渲染。
- ❌ 内容块顺序不得由前端重新裁决。
- ✅ 新增内容块类型必须同步更新后端转换器和前端渲染器。

---

## 5. 分类与搜索业务决策

### BBDR-015: 分类是运营配置型公开数据

**状态**: ✅ 已采纳

**决策**:
- 分类列表只返回 `is_active=true` 的分类。
- 分类排序按 `sort_order desc`。
- 分类返回文章数量 `article_count`，由后端或数据维护任务负责更新。

**依据**:
- `CategoryService.getList()` where `is_active=true`，orderBy `sort_order desc`。
- `Categories` 模型有 `article_count`、`sort_order`、`is_active`。

**为什么**:
- 分类是内容组织方式，运营可启停和排序。
- 停用分类不应出现在前端入口。
- 文章数量是展示指标，不应由前端遍历计算。

**边界约束**:
- ❌ 前端不得展示停用分类。
- ❌ `article_count` 不得由前端自行计算后提交。
- ✅ 后台维护分类时必须考虑文章数一致性。

---

### BBDR-016: 热门关键词是运营/行为数据，不是搜索规则

**状态**: ✅ 已采纳

**决策**:
- 热门关键词接口只返回 `is_active=true` 的关键词。
- 当前排序按 `sort_order desc`。
- `hot_score` 是关键词热度指标，但当前展示排序以 `sort_order` 为准。
- 热门关键词只用于引导搜索，不决定搜索匹配结果。

**依据**:
- `HotSearchKeywords` 模型包含 `keyword`、`hot_score`、`is_active`、`sort_order`。
- `CategoryService.getHotKeywords()` where `is_active=true`，orderBy `sort_order desc`。

**为什么**:
- 运营可控制热门词展示顺序。
- 搜索算法可独立演进，不受热门词展示逻辑影响。
- 关键词停用后不应继续曝光。

**边界约束**:
- ❌ 热门关键词不得被当作白名单限制用户搜索。
- ❌ 前端不得自行添加生产热门词。
- ✅ 如果后续按 `hot_score` 排序，需要明确排序优先级变更。

---

### BBDR-017: 当前搜索匹配范围是标题和摘要

**状态**: ✅ 已采纳

**决策**:
- 当前文章列表搜索只匹配 `title` 和 `summary` 包含关键词。
- 搜索结果仍必须满足 `is_published=true`。
- 排序仍使用列表接口排序参数，默认发布时间倒序。

**依据**:
- `queryArticleList()` 在 `query.keyword` 存在时添加 OR：title contains、summary contains。
- where 同时包含 `is_published=true`。

**为什么**:
- 标题和摘要搜索性能相对可控，适合当前阶段。
- 正文全文搜索可作为后续能力引入专业索引。
- 搜索结果必须遵循公开可见规则。

**边界约束**:
- ❌ 搜索不得返回未发布文章。
- ❌ 前端不得认为当前支持全文搜索。
- ✅ 如果引入全文搜索，应新增索引和排序相关业务决策。

---

## 6. 点赞与互动业务决策

### BBDR-018: 点赞是登录用户对文章的唯一关系

**状态**: ✅ 已采纳

**决策**:
- 点赞记录由 `ArticleLikes` 表维护。
- 同一用户对同一文章最多只能有一条点赞记录。
- 点赞、取消点赞必须登录。
- 点赞状态以 `(article_id, user_id)` 唯一关系为准。

**依据**:
- `ArticleLikes` 有唯一索引 `@@unique([article_id, user_id])`。
- `toggle-like`、`check-like`、`my-likes`、`user-likes` 均使用 `RemoteJwtAuthGuard`。

**为什么**:
- 唯一约束从数据层防止重复点赞。
- 点赞是用户身份行为，匿名点赞难以保证一致性和防刷。
- 关系表支持查询用户点赞列表和文章点赞状态。

**边界约束**:
- ❌ 未登录用户不得创建点赞记录。
- ❌ 不得仅通过文章 likes 数判断某用户是否点赞。
- ✅ 数据层唯一约束和服务层逻辑必须同时存在。

---

### BBDR-019: 点赞切换必须同时维护关系记录和计数

**状态**: ✅ 已采纳

**决策**:
- 点赞时创建 `ArticleLikes` 记录，并递增 `Articles.likes`。
- 取消点赞时删除 `ArticleLikes` 记录，并递减 `Articles.likes`。
- 两步操作必须在事务中完成。
- 接口返回最新 `likes` 和 `isLiked` 给前端校准。

**依据**:
- `ArticleService.toggleLike()` 使用 `prisma.$transaction()`。
- 成功返回 `{ articleId, likes, isLiked }`。

**为什么**:
- 关系记录用于判断用户状态，计数字段用于列表/详情高效展示。
- 事务保证状态和计数不分裂。
- 前端需要返回值修正乐观 UI。

**边界约束**:
- ❌ 不得只更新计数不写关系表。
- ❌ 不得只写关系表但不维护文章 likes 字段，除非整体改为实时 count。
- ✅ 并发冲突时必须保证计数不小于 0 且关系唯一。

---

### BBDR-020: 用户点赞列表只展示仍公开的文章

**状态**: ✅ 已采纳

**决策**:
- `my-likes` 返回当前用户点赞过的文章列表。
- 如果点赞过的文章已删除或未发布，应从返回列表中过滤。
- `user-likes` 返回当前用户点赞文章 ID 列表，用于前端批量状态标记。

**依据**:
- `getUserLikeList()` 映射时过滤 `!article || !article.is_published`。
- `getUserLikeListByUserId()` 返回 `{ articleIds }`。

**为什么**:
- 用户历史点赞不应让不可公开内容重新曝光。
- ID 列表适合前端在文章流中批量标记点赞状态。
- 公开展示和内部关系记录要分离。

**边界约束**:
- ❌ 点赞历史不得泄露未发布文章详情。
- ❌ 前端不得通过点赞 ID 列表访问无权限文章。
- ✅ 如果文章下线，点赞关系可保留，但公开返回必须过滤。

---

## 7. 评论与收藏当前状态

### BBDR-021: 评论当前只有统计字段，尚未形成完整业务闭环

**状态**: ⚠️ 待实现

**决策**:
- 当前 `Articles.comments_count` 可用于展示评论数量。
- 当前未确认评论表、评论接口、回复、删除、审核等完整链路。
- 评论发布能力上线前，不得提供正式评论写接口给前端。

**依据**:
- `Articles` 模型有 `comments_count`。
- 当前读取到的 Controller 未包含评论 CRUD。

**为什么**:
- 评论是 UGC，需要审核、删除、权限、防刷等规则。
- 只有统计字段不足以支撑真实评论业务。
- 提前开放会造成不可追踪内容和安全风险。

**边界约束**:
- ❌ 不得让前端本地保存评论作为生产数据。
- ❌ 不得伪造评论成功。
- ✅ 实现评论前必须补充评论模型、接口、权限、审核和日志决策。

---

### BBDR-022: 收藏当前是预留字段，不是已落地业务

**状态**: ⚠️ 待实现

**决策**:
- 当前详情 DTO 中 `isCollected=false` 只是占位。
- 后端当前未确认收藏模型和收藏接口。
- 前端"Saved Reading"入口不能被解释为后端收藏业务已完成。

**依据**:
- `getArticleDetail()` 固定返回 `isCollected: false`。
- Prisma 当前未读取到收藏表。

**为什么**:
- 收藏需要用户-文章关系、列表查询、取消收藏、可见性过滤。
- 没有后端事实源时，前端本地收藏无法跨设备和长期可靠。
- 明确状态可避免产品误判。

**边界约束**:
- ❌ 不得用 localStorage 作为生产收藏数据源。
- ❌ 不得在接口未实现时返回虚假的收藏状态。
- ✅ 收藏上线前必须新增模型、唯一约束、接口和权限规则。

---

## 8. DTO 与对外契约业务决策

### BBDR-023: 后端对外使用 camelCase DTO，屏蔽数据库 snake_case

**状态**: ✅ 已采纳

**决策**:
- 数据库字段使用 snake_case。
- 后端对前端响应使用 camelCase DTO。
- 服务层负责显式字段映射，包括时间、标签、分类、作者、统计字段。

**依据**:
- `CategoryService.getList()` 将 `article_count` 映射为 `articleCount`。
- `ArticleService` 将 `cover_url`、`published_at`、`comments_count` 等映射为 `coverUrl`、`publishedAt`、`commentsCount`。

**为什么**:
- 前端 TypeScript 使用 camelCase 更符合 JS 习惯。
- 数据库命名和 API 契约解耦，便于内部演进。
- 显式映射能避免敏感字段泄露。

**边界约束**:
- ❌ Controller/Service 不得直接返回 Prisma 实体给前端。
- ❌ 前端不得依赖 snake_case 字段。
- ✅ 新增接口必须定义 DTO 并完成字段映射。

---

### BBDR-024: 标签当前以逗号分隔字符串存储，对外返回数组

**状态**: ✅ 已采纳

**决策**:
- 数据库存储 `Articles.tags` 为逗号分隔字符串。
- 对外 DTO 返回 `string[]`。
- 服务层负责 split、trim、filter 空值。

**依据**:
- `ArticleService` 多处对 `article.tags` 执行 `split(',').map(trim).filter(Boolean)`。

**为什么**:
- 当前阶段标签关系简单，字符串存储成本低。
- 前端更适合消费数组结构。
- 后续如标签业务复杂，可迁移为标签表和多对多关系。

**边界约束**:
- ❌ 前端不得提交或依赖逗号字符串格式。
- ❌ 标签搜索、标签页等高级能力上线前，应重新评估标签模型。
- ✅ DTO 层必须过滤空标签。

---

### BBDR-025: 时间对外返回 ISO 字符串，内部存储 BigInt 毫秒时间戳

**状态**: ✅ 已采纳

**决策**:
- 内部数据库使用 BigInt 毫秒时间戳。
- 对外 DTO 返回 ISO 字符串，如 `publishedAt`、`updatedAt`。
- 前端负责本地化展示，不参与时间事实计算。

**依据**:
- `ArticleService` 将 `published_at` 转 `new Date(Number(...)).toISOString()`。
- 架构决策已明确时间字段 BigInt。

**为什么**:
- 内部统一毫秒时间戳避免时区问题。
- ISO 字符串是前端和 API 常见交换格式。
- 前端可按用户区域做显示格式化。

**边界约束**:
- ❌ 前端不得回传格式化后的展示时间作为事实时间。
- ❌ 后端不得混用 DateTime 和 BigInt 存储。
- ✅ 新增时间字段必须明确内部和外部格式。

---

## 9. 一致性与异常语义

### BBDR-026: 核心写操作强一致，统计和日志可最终一致

**状态**: ✅ 已采纳

**决策**:
- 用户注册、登录、资料更新、点赞切换属于核心写操作，必须返回明确成功或失败。
- 点赞关系和点赞计数必须事务一致。
- 阅读量、日志、行为分析属于可最终一致数据，不阻塞内容消费主链路。

**依据**:
- 点赞使用事务。
- 阅读量异步更新，不阻塞详情返回。
- 日志服务独立于主业务。

**为什么**:
- 用户能感知的状态变更需要明确一致。
- 统计和日志可以容忍短暂延迟，换取性能和可用性。
- 明确一致性层级有利于排查问题。

**边界约束**:
- ❌ 点赞成功但计数失败不能被当作成功。
- ❌ 阅读量失败不得影响文章详情读取。
- ✅ 写接口失败必须返回业务错误码，前端可据此回滚。

---

### BBDR-027: 业务异常用错误码表达，不暴露内部实现

**状态**: ✅ 已采纳

**决策**:
- 文章不存在、用户不存在、认证失败、刷新令牌失效等业务失败使用业务错误码。
- Prisma、Redis、JWT 等内部异常不得直接暴露给前端。
- 业务错误文案面向用户，内部日志保留排障上下文。

**依据**:
- `BusinessException` 和 `BusinessErrorCode` 在 auth/backend 中均存在。
- 架构决策已有三层异常过滤器。

**为什么**:
- 错误码便于前端分流处理。
- 内部异常可能包含表名、字段、路径等敏感信息。
- 用户需要的是可理解的失败原因和下一步动作。

**边界约束**:
- ❌ 不得把 Prisma 错误、SQL、堆栈直接返回客户端。
- ❌ 不得用纯字符串散落定义业务错误。
- ✅ 新增业务错误必须注册到统一错误码文件。

---

## 10. 当前业务风险与待治理项

### BBDR-028: auth-service 与 backend 当前存在 Users/RefreshTokens 模型重复，需要明确数据主权

**状态**: ⚠️ 待治理

**发现**:
- `auth-service/prisma/schema.prisma` 和 `backend/prisma/schema.prisma` 都包含 `Users`、`RefreshTokens`。
- 架构决策要求认证服务与业务服务分离，但当前模型存在重复。

**决策**:
- 认证凭证、Refresh Token、密码哈希的业务主权归 `auth-service`。
- 用户展示资料在当前实现中由 `backend` 提供接口，但涉及认证缓存同步。
- 在正式演进前，不允许两个服务各自独立修改同一用户字段导致数据分裂。

**为什么**:
- 重复模型容易造成数据主权混乱。
- 用户资料和认证缓存存在联动，必须有明确同步规则。
- 微服务拆分不能以共享数据库作为长期协作方式。

**边界约束**:
- ❌ 不得让 `backend` 修改密码哈希、Refresh Token 等认证字段。
- ❌ 不得让 `auth-service` 绕过资料接口修改头像、昵称等展示业务，除非定义同步机制。
- ✅ 后续应评估用户资料拆表、同步事件或统一用户服务。

---

### BBDR-029: backend 中保留 auth 模块痕迹，需要防止职责回流

**状态**: ⚠️ 待治理

**发现**:
- `services/backend/src/auth/` 中仍存在登录、注册、刷新相关 DTO/Controller 文件。
- 架构决策要求认证相关代码从 backend 迁移到 auth-service。

**决策**:
- 新认证功能只允许加入 `auth-service`。
- `backend` 中 auth 相关遗留代码不得作为新增业务模板。
- 迁移完成后应清理或标注遗留状态。

**为什么**:
- 职责回流会破坏认证统一安全策略。
- 新人或 Agent 可能误用 backend auth 文件开发新认证能力。
- 清晰边界能减少安全漏洞。

**边界约束**:
- ❌ 不得在 `services/backend/src/auth/` 新增真实认证生命周期逻辑。
- ❌ 前端不得调用 backend 的认证接口作为主路径。
- ✅ 认证 API 主路径应指向 `auth-service`。

---

### BBDR-030: 详情不存在返回空对象是现有行为，但业务语义需要收敛

**状态**: ⚠️ 待治理

**发现**:
- `getArticleDetail()` 找不到文章时返回 `{}` as `ArticleDetailDto`。

**决策**:
- 当前保持兼容，但业务上更推荐返回 `ARTICLE_NOT_FOUND` 错误码或明确空状态响应。
- 前端应临时兼容空对象，但不应把空对象视为有效文章。

**为什么**:
- 空对象会导致前端类型和业务状态不清晰。
- 错误码更利于展示"文章不存在/已下线"。
- 收敛语义后便于监控和排查。

**边界约束**:
- ❌ 新增详情类接口不得用空对象代表不存在。
- ❌ 前端不得渲染空文章。
- ✅ 后续改造需同步前端错误状态处理。

---

### BBDR-031: logout 当前存在敏感日志风险，应按业务安全要求收敛

**状态**: ⚠️ 待治理

**发现**:
- `AuthController.logout()` 当前存在 `console.log('Refresh token:', refreshToken)`。

**决策**:
- 登出业务可记录用户 ID、设备、IP、时间等审计信息。
- 不得记录完整 refreshToken。
- 如需排查，最多记录脱敏 token 前缀或 token hash。

**为什么**:
- Refresh Token 可用于维持会话，完整记录会造成凭证泄露风险。
- 日志系统通常被更多人或系统访问，敏感信息必须最小化。
- 项目安全规范已禁止完整 Token 入日志。

**边界约束**:
- ❌ 不得在任何环境日志输出完整 Token。
- ❌ 不得使用 console.log 记录认证敏感业务。
- ✅ 登出审计应走统一日志服务或安全日志通道。

---

## 11. 后端业务检查清单

- [ ] 当前接口是否属于正确服务域？认证归 auth-service，内容归 backend，日志归 log-service。
- [ ] 是否从认证上下文获取当前用户，而不是信任前端传入 userId？
- [ ] 公开文章查询是否过滤 `is_published=true`？
- [ ] 点赞是否同时维护唯一关系和计数，并使用事务？
- [ ] 用户 DTO 是否未返回密码、Token、算法等敏感字段？
- [ ] 分类和热门词是否只返回 `is_active=true` 数据？
- [ ] 写操作是否返回明确业务成功/失败语义？
- [ ] 错误是否使用统一业务错误码，而不是暴露内部异常？
- [ ] Token、密码、Cookie 是否不会进入日志？
- [ ] 未完成业务（收藏、评论、交易、商品）是否没有被包装为已上线能力？
