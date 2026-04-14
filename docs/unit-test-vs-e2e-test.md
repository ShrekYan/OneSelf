# 单元测试 vs E2E 测试 概念总结

## 📐 单元测试 (Unit Test)

### 概念
测试**最小的代码单元**（通常是一个函数、一个方法或一个单独的 Service），把被测试的代码和其他依赖隔离开。

### 特点
- 隔离依赖：通常用 mock 代替真实的数据库/外部服务依赖
- 运行速度快
- 定位问题容易，测试失败就能直接定位到是哪个方法出问题
- 编写简单

### 在本项目中的位置
单元测试文件放在源代码同级目录，命名格式为 `*.spec.ts`：
```
src/
  users/
    users.service.ts
    users.service.spec.ts  ← 单元测试
```

### 示例
```typescript
// src/users/users.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should return user by id', async () => {
    const result = await service.findOne(1);
    expect(result).toEqual({ id: 1, name: '张三' });
  });
});
```

### 用途
- 确保单个方法逻辑正确
- 修改代码后快速验证是否破坏了现有功能
- 通过测试文档化代码行为

---

## 🌐 E2E 测试 (End-to-End 端到端测试)

### 概念
测试**整个应用流程**，从 HTTP 请求入口到数据库交互再到响应出口，模拟真实用户的完整操作流程。

### 特点
- 真实依赖：启动完整应用，连接真实数据库（或测试数据库）
- 运行速度较慢
- 测试整个系统集成后是否正常工作
- 编写相对复杂

### 在本项目中的位置
E2E 测试统一放在项目根目录的 `test/` 目录下：
```
test/
  app.e2e-spec.ts          ← E2E 测试
  jest-e2e.json            ← E2E 测试配置
```

### 示例
```typescript
// test/app.e2e-spec.ts
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/api/users (GET)', () => {
    return request(app.getHttpServer())
      .get('/api/users')
      .expect(200);
  });
});
```

### 用途
- 验证整个 API 端点工作正常
- 测试完整的业务流程（比如用户注册 → 登录 → 获取信息）
- 确保各个模块集成在一起没有问题

---

## 🆚 对比

| 对比项 | 单元测试 | E2E 测试 |
|--------|----------|----------|
| **测试范围** | 单个函数/类/服务 | 整个应用/完整流程 |
| **依赖处理** | 用 mock 隔离外部依赖 | 使用真实依赖（数据库等） |
| **运行速度** | 很快（毫秒级） | 较慢（秒级） |
| **定位问题** | 容易，直接定位到具体方法 | 困难，需要逐级排查 |
| **编写难度** | 简单 | 复杂 |
| **文件位置** | `src/**/*.spec.ts` | `test/*.e2e-spec.ts` |

---

## 🚀 在本项目中运行测试

### 进入 backend 目录
```bash
cd backend
```

### 可用命令

| 命令 | 作用 |
|------|------|
| `npm run test` | 运行所有单元测试一次 |
| `npm run test:watch` | 监听模式运行测试（开发时用，文件改了自动重跑） |
| `npm run test:cov` | 运行测试并生成覆盖率报告 |
| `npm run test:debug` | 调试模式运行测试 |
| `npm run test:e2e` | 运行所有 E2E 测试 |

---

## 💡 最佳实践建议

1. **优先写单元测试**：核心业务逻辑一定要覆盖单元测试
2. **关键流程写 E2E**：用户注册、登录、支付等核心完整流程用 E2E 测试保障
3. **测试驱动开发 (TDD)**：先写测试，再写实现，代码质量会更好
