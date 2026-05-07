# 13 - 定时任务开发规范

## 概述

本文档定义 NestJS 后端项目的定时任务开发规范，包括任务调度、异常处理、监控告警等。定时任务使用 `@nestjs/schedule` 包实现。

> **架构决策依据**：ADR-014 - 每日凌晨 2 点执行过期数据清理

---

## 1. 定时任务基础配置

### 1.1 模块注册

```typescript
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ScheduleModule.forRoot(), // 全局注册调度器
  ],
  // ...
})
export class AppModule {}
```

---

## 2. 标准定时任务实现

### 2.1 数据清理任务（ADR-014 架构决策）

**任务说明**：每日凌晨 2 点清理已过期且已撤销的 Refresh Token。

```typescript
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis';

@Injectable()
export class CleanupTaskService {
  private readonly logger = new Logger(CleanupTaskService.name);

  constructor(
    private readonly redis: Redis,
    private readonly configService: ConfigService,
  ) {}

  /**
   * 每日凌晨 2 点执行过期数据清理
   * Cron 表达式: 0 0 2 * * *
   *
   * 可通过环境变量 CLEANUP_ENABLED=false 禁用
   */
  @Cron(CronExpression.EVERY_DAY_AT_2AM, {
    name: 'expired-data-cleanup',
    timeZone: 'Asia/Shanghai',
  })
  async handleExpiredDataCleanup() {
    // 检查开关
    const enabled = this.configService.get('CLEANUP_ENABLED', 'true') === 'true';
    if (!enabled) {
      this.logger.log('数据清理任务已禁用，跳过执行');
      return;
    }

    const startTime = Date.now();
    this.logger.log('开始执行过期数据清理任务...');

    try {
      // 步骤 1: 清理已撤销的 Refresh Token
      // 注：正常过期的 Token 由 Redis TTL 自动清理
      // 此处主要清理提前撤销但未过期的 Token
      // 以及用户维度的索引集合中的无效 Token
      await this.cleanupRevokedRefreshTokens();

      const duration = Date.now() - startTime;
      this.logger.log(`过期数据清理任务完成，耗时: ${duration}ms`);
    } catch (error) {
      this.logger.error(`数据清理任务失败: ${error.message}`, error.stack);
      // 建议: 此处可接入告警系统（邮件、钉钉、企业微信等）
    }
  }

  /**
   * 清理已撤销的 Refresh Token
   */
  private async cleanupRevokedRefreshTokens(): Promise<void> {
    // 扫描所有用户的 Token 集合，检查 Token 是否已不存在
    // 实现逻辑根据业务需要调整
  }

  /**
   * 手动触发清理任务（管理端调用）
   */
  async triggerCleanupManually(): Promise<void> {
    this.logger.warn('手动触发数据清理任务');
    await this.handleExpiredDataCleanup();
  }
}
```

---

## 3. 定时任务开发规范

### 3.1 开发原则

| 原则 | 说明 |
|------|------|
| ✅ **幂等性** | 多次执行同一任务，结果一致 |
| ✅ **异常捕获** | 任务内部必须 try-catch，异常不能抛到外层 |
| ✅ **执行时长监控** | 记录任务开始/结束时间，超时告警 |
| ✅ **开关控制** | 所有任务都要有环境变量开关 |
| ✅ **手动触发** | 支持管理端手动触发执行 |
| ❌ **长任务阻塞** | 避免单次任务执行时间超过 30 分钟 |

### 3.2 Cron 表达式约定

```typescript
// 推荐使用常量或 CronExpression 枚举，不要写魔数
import { CronExpression } from '@nestjs/schedule';

// ✅ 推荐：使用语义化枚举
@Cron(CronExpression.EVERY_DAY_AT_2AM)

// ✅ 推荐：使用常量定义
const CRON_EVERY_HOUR = '0 0 * * * *';
@Cron(CRON_EVERY_HOUR)

// ❌ 不推荐：魔数
@Cron('0 0 2 * * *')
```

### 3.3 时区设置

**必须**设置时区为 `Asia/Shanghai`，避免因服务器时区不同导致执行时间偏差：

```typescript
@Cron(CronExpression.EVERY_DAY_AT_2AM, {
  timeZone: 'Asia/Shanghai', // ✅ 必须指定
})
```

---

## 4. 定时任务检查清单

- [ ] 是否使用了 `@nestjs/schedule` 包？
- [ ] 是否设置了正确的时区 `Asia/Shanghai`？
- [ ] 是否有环境变量开关控制启用/禁用？
- [ ] 异常是否被完整捕获并记录日志？
- [ ] 是否记录了任务执行耗时？
- [ ] 失败时是否有告警机制？
- [ ] 任务是否保证幂等执行？
- [ ] Cron 表达式是否遵循 ADR-014 约定（每日凌晨 2 点）？
- [ ] 是否支持手动触发执行？
