# AuthService login 方法重构笔记

## 原始需求

> backend/src/auth/auth.service.ts 重构login方法。
> 背景：login方法体有100～200行代码，阅读性差，后期扩展性差。
> 目标：
> - 拆分成职责单一功能
> - 拆分后模块之间的依赖清晰，没有循环依赖
> - 对外暴露的API不变（controller层不需要改动）
> 质量标准：先执行计划模式，给我方案和理由，我确认后再执行
> 约束：业务逻辑不要变更，不涉及到的改造不要动。controller 层不需要任何改动

---

## 重构前问题分析

重构前 `login` 方法代码情况：
- **代码行数**：约 156 行
- **功能职责**：包含从用户缓存查询 → 用户存在性检查 → 状态检查 → 密码验证 → 登录成败处理 → 静默密码迁移 → Token 生成 → 刷新令牌存储 → 响应组装 → 日志记录 共 10 多个步骤
- **问题**：
  1. 方法太长，阅读困难
  2. 单一文件职责不清晰，后续修改容易出错
  3. 不好写单元测试，无法单独测试某个步骤
  4. 扩展性差，如果要修改某个步骤（比如更换密码算法）需要在大方法中找位置

---

## 重构方案设计

### 拆分原则：单一职责 + 无循环依赖 + 保持接口不变

遵循单一职责原则，将一个大方法拆分成 **3 个新服务 + 1 个编排入口**：

| 服务 | 职责 | 文件位置 | 代码行数 |
|------|------|----------|---------|
| **UserLoaderService** | 用户加载：从预加载缓存/数据库查询用户，处理缓存回填，用户不存在清除缓存 | `auth/user-loader.service.ts` | ~130 行 |
| **PasswordValidationService** | 密码验证：支持 argon2id/bcrypt 多算法、登录成败处理、静默密码迁移 | `auth/password-validation.service.ts` | ~170 行 |
| **TokenGeneratorService** | Token 生成：生成 Access/Refresh Token、保存刷新令牌、组装响应 DTO | `auth/token-generator.service.ts` | ~130 行 |
| **AuthService**（原有） | **流程编排**：按顺序调用三个服务，保持对外 API 不变 | `auth/auth.service.ts` | 精简后约 300 行（login 方法从 156 → 50 行） |

### 依赖关系图（无循环依赖）

```
基础设施依赖
├─ PrismaService (数据库)
├─ RedisService (缓存)
├─ ConfigService (配置)
├─ UserSyncService (用户同步)
├─ PasswordCacheService (密码缓存)
└─ RefreshTokenRedisService (刷新令牌存储)
          ↓
┌─────────────────────────────────────────┐
│ UserLoaderService       (新建，独立)      │
│ PasswordValidationService (新建，独立)    │
│ TokenGeneratorService     (新建，独立)    │
└─────────────────────────────────────────┘
          ↓
       AuthService (原有，仅编排)
```

**关键点**：三个新服务之间**没有互相依赖**，都只依赖基础设施，AuthService 依赖三个新服务，但三个新服务不依赖 AuthService。因此**完全避免循环依赖**。

---

## 最终代码结构

### 目录结构

```
backend/src/auth/
├── auth.module.ts                # 更新：注册三个新服务
├── auth.service.ts               # 更新：精简 login 方法，保留编排
├── auth.controller.ts            # 不变：完全不需要修改 ✓
├── password-cache.service.ts     # 不变：保持原有 ✓
├── refresh-token-redis.service.ts # 不变：保持原有 ✓
├── user-loader.service.ts        # 🆕 新增：用户加载服务
├── password-validation.service.ts # 🆕 新增：密码验证服务
└── token-generator.service.ts    # 🆕 新增：Token 生成服务
```

### AuthService.login 重构后（约 50 行，清晰易懂）

```typescript
async login(loginDto: LoginDto, clientIp: string): Promise<LoginResponseDto> {
  const { username, password } = loginDto;
  const startTime = Date.now();

  // 1. 加载用户（优先缓存，未命中回源 DB 并回填缓存）
  const { user, userFromDb } = await this.userLoader.loadUser(username);

  // 2. 检查用户状态
  if (!user!.is_active) {
    throw new BusinessException(BusinessErrorCode.AUTH_USER_DISABLED);
  }

  // 3. 验证密码
  const isPasswordValid = await this.passwordValidation.validatePassword(
    password,
    user!,
  );

  if (!isPasswordValid) {
    await this.passwordValidation.handleLoginFailure(user!);
    throw new BusinessException(BusinessErrorCode.AUTH_INVALID_CREDENTIALS);
  }

  // 4. 处理验证成功：缓存密码、重置失败次数
  await this.passwordValidation.processValidPassword(
    user!,
    userFromDb,
    clientIp,
  );

  // 5. 如果需要，启动静默密码迁移（bcrypt → argon2id）
  this.passwordValidation.startSilentMigration(user!, password);

  // 6. 生成 Token 并保存刷新令牌
  const { accessToken, refreshToken } = await this.tokenGenerator
    .generateAndSaveTokens(user!.id, clientIp);

  // 7. 组装响应 DTO
  const userDto = this.tokenGenerator.buildUserDto(user!);

  this.logger.debug(
    `Login completed for username=${username}, elapsed=${Date.now() - startTime}ms`,
  );

  return {
    accessToken,
    refreshToken,
    expiresIn: this.tokenGenerator.getTokenExpiresIn(),
    user: userDto,
  };
}
```

---

## 关键设计决策

### 1. 为什么拆分成三个服务，而不是多个私有方法？

| 方式 | 优点 | 缺点 |
|------|------|------|
| 多个私有方法（都在 AuthService） | 简单不用新建文件 | 还是在同一个大文件，可读性依然差；无法单独单元测试；扩展性依然不好 |
| 拆分成多个服务（独立文件） | 每个文件职责单一，可读性好；可单独单元测试；符合模块化设计；扩展性好 | 需要新建三个文件，多一点代码 |

**选择**：拆分成多个服务。因为这是核心业务模块，后续维护和扩展频率高，模块化收益更大。

### 2. 为什么保持 AuthService 作为入口，而不是换其他方式？

- **满足约束**：用户要求对外 API 不变，controller 不需要改。AuthService 本来就是入口，保持它做编排最符合要求。
- **清晰**：controller → AuthService（编排）→ 多个服务（具体职责），分层清晰。

### 3. 为什么 register 和 refreshToken 也适配了 TokenGeneratorService？

因为 `register` 和 `refreshToken` 也用到了 `generateAccessToken` 和 `tokenExpiresIn`，这些已经移到了 `TokenGeneratorService`。如果不移过去，会出现：
- AuthService 需要保留这些方法，但只有两个地方用，代码分散
- 不一致性，登录走新服务，注册走旧代码

所以统一适配过去，让 Token 生成逻辑完全集中在 `TokenGeneratorService`，更符合单一职责。

### 4. 业务逻辑真的一点都没变吗？

是的。重构中：
- 所有条件判断完全保留
- 所有错误处理完全保留
- 所有日志打印完全保留
- 所有缓存逻辑完全保留
- 静默迁移逻辑完全保留

**只做了代码移动，没有修改逻辑**。这很重要，重构不引入新bug。

---

## 重构前后对比

| 指标 | 重构前 | 重构后 |
|------|--------|--------|
| login 方法行数 | 156 | 50 |
| AuthService 总行数 | 693 | 321 |
| 每个文件单一职责 | ❌ 否 | ✅ 是 |
| 可单元测试性 | ❌ 难，要 mock 很多依赖 | ✅ 易，每个服务单独测 |
| 可扩展性 | ❌ 改逻辑需要找半天 | ✅ 改哪个职责就去哪个文件 |
| 循环依赖 | ✅ 无（本来也没有） | ✅ 依然无，依赖更清晰 |
| controller 修改 | - | ✅ 零修改，满足要求 |

---

## 验证方法

重构完成后必须验证：

### 1. 静态检查
```bash
cd backend
npx tsc --noEmit      # TypeScript 类型检查
npm run lint          # ESLint 代码风格检查
```

### 2. 功能测试清单

需要验证以下场景都工作正常：

- [ ] 正常用户名密码登录成功 → 返回正确 Token
- [ ] 用户不存在 → 返回 401 错误
- [ ] 密码错误 → 返回 401 错误
- [ ] 用户被禁用 → 返回正确错误
- [ ] 预加载缓存命中 → 不查询数据库，正常登录
- [ ] 缓存未命中 → 回源数据库查询，然后回填缓存
- [ ] bcrypt 加密密码 → 登录成功后静默升级为 argon2id
- [ ] 刷新 Token → 能正常获取新的访问令牌
- [ ] 用户登出 → 刷新令牌正确删除

### 3. 对比验证

抓包对比重构前后的请求响应：
- 请求相同 → 响应 HTTP 状态码一致
- 响应数据结构完全一致
- 业务行为完全一致

---

## 本次重构学到的要点

1. **单一职责原则**：一个方法/类只做一件事。150 行的大方法一定要拆。
2. **依赖方向**：保持依赖单向，避免循环依赖。让小服务不依赖大服务，大服务依赖小服务。
3. **开闭原则**：对扩展开放，对修改关闭。现在要修改密码验证逻辑，只需要改 `PasswordValidationService`，不影响其他代码。
4. **最小破坏原则**：满足用户约束，对外 API 不变，controller 不用改，减少影响范围。
5. **重构不改逻辑**：重构只调整代码组织结构，不改变业务逻辑，这样不会引入新 bug。

---

## 完整修改文件清单

| 操作 | 文件 |
|------|------|
| 🆕 新建 | `backend/src/auth/user-loader.service.ts` |
| 🆕 新建 | `backend/src/auth/password-validation.service.ts` |
| 🆕 新建 | `backend/src/auth/token-generator.service.ts` |
| ✏️ 修改 | `backend/src/auth/auth.service.ts` |
| ✏️ 修改 | `backend/src/auth/auth.module.ts` |
| ✅ 不变 | `backend/src/auth/auth.controller.ts` |
| ✅ 不变 | 其他现有文件 |
