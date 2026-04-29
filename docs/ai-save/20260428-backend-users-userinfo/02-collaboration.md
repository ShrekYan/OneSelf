# AI 协同开发成果 - Backend getUserInfo 接口

## 📅 协同基本信息

- 协同日期：2026-04-28
- 开发模块：services/backend/src/users
- 协同时长：约 40 分钟
- 参与方：用户 + Claude Code AI

---

## 🎯 本次协同目标

将后端用户信息接口从 `GET /user/info` 改为 `POST /user/info`，返回 DTO 与 auth-service 的 UserDto 100% 字段对齐，遵循微服务架构原则（auth-service 做认证，backend 取用户信息）。

---

## 📝 完成的工作内容

### 代码变更清单

| 序号 | 文件路径                                         | 变更类型 | 修改内容简述                                        |
| ---- | ------------------------------------------------ | -------- | --------------------------------------------------- |
| 1    | `services/backend/src/users/dto/user.dto.ts`     | ✅ 新建  | 创建与 auth-service 完全一致的 UserDto，5 个字段    |
| 2    | `services/backend/src/users/dto/index.ts`        | ✅ 修改  | 新增 UserDto 导出，保留 UserInfoDto 向后兼容        |
| 3    | `services/backend/src/users/users.controller.ts` | ✅ 修改  | GET → POST，返回类型从 UserInfoDto 改为 UserDto     |
| 4    | `services/backend/src/users/users.service.ts`    | ✅ 修改  | 返回类型 UserDto，mapToDto 移除 bio 字段和 any 断言 |

### 功能实现说明

1. **请求方式变更**：从 REST 规范的 GET 改为 POST（按用户需求）
2. **DTO 对齐**：backend 独立创建 UserDto，与 auth-service 字段 100% 一致
   - 字段：id, username, email, nickname, avatar
3. **认证链路完整**：RemoteJwtAuthGuard → auth-service introspect → 获取 userId
4. **返回格式统一**：由 TransformInterceptor 全局包裹为 { code, message, data }
5. **代码质量提升**：移除了 (user as any).bio 的不安全类型断言

---

## 💡 关键技术决策

### 决策 1：接口放在 backend 还是 auth-service？

- **背景**：用户疑问 getUserInfo 应该放在哪个服务
- **方案**：放在 backend，auth-service 只做认证验证
- **理由**：
  - ✅ 符合微服务单一职责原则
  - ✅ backend 直接查询本地数据库，性能更好
  - ✅ 避免跨服务数据同步问题
  - ✅ 认证通过 RemoteJwtAuthGuard 远程调用实现

### 决策 2：DTO 采用方案 A（独立创建 vs 跨服务导入）

- **背景**：是否需要直接 import auth-service 的 UserDto
- **方案**：backend 独立创建 UserDto，字段完全对齐
- **理由**：
  - ✅ 保持服务解耦，独立部署能力
  - ✅ 避免 auth-service 内部变更影响 backend
  - ✅ 减少跨服务编译依赖

### 决策 3：移除 bio 字段

- **背景**：原 UserInfoDto 有 bio 字段，UserDto 没有
- **方案**：从返回 DTO 中移除 bio
- **理由**：
  - ✅ 与 auth-service UserDto 严格对齐
  - ✅ 数据库中本来就没有 bio 字段，原代码是无效代码
  - ✅ 无意中修复了一个潜在 bug

### 决策 4：updateProfile 也改为返回 UserDto

- **背景**：保持接口一致性
- **方案**：获取和更新接口都返回相同 DTO
- **理由**：
  - ✅ 前端调用更一致
  - ✅ 避免返回类型碎片化

---

## 🔧 核心代码实现

### 1. user.dto.ts - 新建

> 与 auth-service UserDto 100% 字段对齐，保持服务解耦

```typescript
import { ApiProperty } from '@nestjs/swagger';

/**
 * 用户信息 DTO
 * 与 auth-service 的 UserDto 保持完全一致，确保前后端字段对齐
 */
export class UserDto {
  @ApiProperty({
    description: '用户 ID',
    example: 'author-1',
  })
  id: string;

  @ApiProperty({
    description: '用户名（手机号）',
    example: '13800138000',
  })
  username: string;

  @ApiProperty({
    description: '邮箱',
    example: 'user@example.com',
    required: false,
  })
  email?: string;

  @ApiProperty({
    description: '昵称',
    example: '张三',
    required: false,
  })
  nickname?: string;

  @ApiProperty({
    description: '头像 URL',
    example: 'https://example.com/avatar.jpg',
    required: false,
  })
  avatar?: string;
}
```

---

### 2. users.controller.ts - 修改

> GET → POST，返回类型 UserDto

```typescript
import { Controller, Post, Put, Body, UseGuards } from '@nestjs/common';
import { UserDto, UpdateProfileDto } from './dto';

@ApiTags('用户信息')
@ApiBearerAuth()
@Controller('user')
@UseGuards(RemoteJwtAuthGuard)
export class UsersController {
  @Post('info')
  @ApiOperation({ summary: '获取当前用户信息' })
  @ApiResponse({
    status: 200,
    description: '获取成功',
    type: UserDto,
  })
  getUserInfo(@CurrentUserId() userId: string): Promise<UserDto> {
    return this.usersService.getUserInfo(userId);
  }

  @Put('info')
  updateProfile(
    @CurrentUserId() userId: string,
    @Body() updateDto: UpdateProfileDto,
  ): Promise<UserDto> {
    return this.usersService.updateProfile(userId, updateDto);
  }
}
```

---

### 3. users.service.ts - 修改

> 返回类型 UserDto，移除 bio 字段和 any 断言

```typescript
private mapToDto(user: Users): UserDto {
  return {
    id: user.id,
    username: user.username,
    email: user.email ?? undefined,
    nickname: user.nickname ?? undefined,
    avatar: user.avatar ?? undefined,
  };
}
```

---

## ⚠️ 遇到的问题与解决方案

### 问题 1：遗漏 Post 导入导致编译失败

- **现象**：第一次修改后 `npx tsc --noEmit` 报错，`Cannot find name 'Post'`
- **原因**：只改了装饰器 `@Post('info')`，但忘记从 `@nestjs/common` 导入 Post
- **解决方案**：补充导入 `import { Controller, Post, Put, Body, UseGuards } from '@nestjs/common';`
- **教训**：修改装饰器时，必须同时检查导入语句是否需要变更

### 问题 2：发现原有代码的潜在 bug

- **现象**：深度检查时发现 `UpdateProfileDto.bio` 字段，但数据库 Users 表没有 bio 字段
- **原因**：历史遗留代码，DTA 与数据库不一致
- **影响**：尝试更新不存在的字段可能导致 Prisma 报错或静默忽略
- **解决方案**：本次未修改（不在需求范围内），已记录到 README 的后续优化项

---

## 📌 代码审查要点

### ✅ 已确认通过的审查点

1. **架构正确**：auth-service 做认证，backend 取用户信息，符合微服务原则
2. **类型安全**：
   - TypeScript 编译：0 error
   - ESLint：0 error
   - 移除了 `(user as any).bio` 的不安全类型断言
3. **DTO 对齐**：与 auth-service UserDto 逐字段对比，100% 一致
4. **认证链路完整**：RemoteJwtAuthGuard → @CurrentUserId → 数据流正确
5. **返回格式正确**：TransformInterceptor 全局确保 { code, message, data }
6. **向后兼容**：UserInfoDto 仍保留导出，不影响现有代码
7. **Swagger 完整**：所有 ApiProperty 注解正确，示例值合理

---

## 📚 后续建议与待办

### 立即可做

- [ ] 前端适配：修改调用方式从 GET 改为 POST
- [ ] 前端类型对齐：UserInfo 类型改为与 UserDto 字段一致

### 中期优化

- [ ] 清理 UpdateProfileDto.bio 字段（数据库无此字段）
- [ ] 考虑增加用户信息 Redis 缓存降低 DB 压力
- [ ] 统一所有接口返回 message 大小写（"Success" vs "success"）

### 长期架构

- [ ] 考虑引入用户服务作为独立微服务
- [ ] 考虑用户信息变更的事件通知机制
