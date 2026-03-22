# Backend 项目配置

## 项目概览

**项目类型**: NestJS 后端服务
**框架**: NestJS 11
**语言**: TypeScript 5.7.3
**包管理器**: npm
**代码规范**: ESLint + Prettier

---

## 技术栈版本

| 技术 | 版本 |
|------|------|
| NestJS | 11.0.1 |
| TypeScript | 5.7.3 |
| Node.js | 要求 20+ |
| @nestjs/config | 4.0.3 |
| @nestjs/platform-express | 11.0.1 |
| @nestjs/swagger | 11.2.6 |
| rxjs | 7.8.1 |

**认证授权**:
- jsonwebtoken ^9.0.3
- bcrypt ^6.0.0
- class-validator ^0.14.4
- class-transformer ^0.5.1

**测试**:
- Jest 30.0.0
- Supertest 7.0.0

---

## 项目结构

```
backend/
├── src/
│   ├── auth/                    # 认证模块
│   │   ├── decorators/          # 装饰器
│   │   ├── dto/                 # 数据传输对象
│   │   └── guards/              # 守卫
│   ├── common/                  # 公共模块
│   │   ├── decorators/          # 公共装饰器
│   │   ├── dto/                 # 公共 DTO
│   │   ├── filters/             # 异常过滤器
│   │   └── interceptors/        # 拦截器
│   ├── product/                 # 商品模块
│   │   └── dto/                 # 商品 DTO
│   ├── app.controller.ts        # 根控制器
│   ├── app.module.ts            # 根模块
│   ├── app.service.ts           # 根服务
│   └── main.ts                  # 入口文件
├── test/                        # 端到端测试
├── dist/                        # 编译输出
├── .env                         # 基础环境配置
├── .env.development             # 开发环境
├── .env.production              # 生产环境
└── package.json
```

---

## 环境配置

| 环境 | 配置文件 |
|------|----------|
| 开发 | `.env.development` |
| 生产 | `.env.production` |

环境变量由 `@nestjs/config` 模块加载。

---

## 可用脚本

```json
{
  "build": "nest build",
  "format": "prettier --write \"src/**/*.ts\" \"test/**/*.ts\"",
  "start": "nest start",
  "start:dev": "nest start --watch",
  "start:debug": "nest start --debug --watch",
  "start:prod": "node dist/main",
  "lint": "eslint \"{src,apps,libs,test}/**/*.ts\" --fix",
  "test": "jest",
  "test:watch": "jest --watch",
  "test:cov": "jest --coverage",
  "test:debug": "node --inspect-brk ...",
  "test:e2e": "jest --config ./test/jest-e2e.json"
}
```

**常用开发命令**:
```bash
# 开发模式启动（热更新）
npm run start:dev

# 构建
npm run build

# 生产启动
npm run start:prod

# 代码格式化
npm run format

# lint 修复
npm run lint

# 单元测试
npm run test

# e2e 测试
npm run test:e2e
```

---

## 开发规范

1. **架构**: 遵循 NestJS 模块化架构
   - 每个业务功能一个模块
   - Controller 处理 HTTP 请求
   - Service 处理业务逻辑
   - DTO 定义数据传输对象

2. **验证**: 使用 `class-validator` 进行请求参数验证
3. **认证**: JWT + 守卫 方式
4. **文档**: 使用 `@nestjs/swagger` 生成 API 文档
5. **异常处理**: 全局异常过滤器
6. **类型**: 严格 TypeScript 类型检查

---

## 测试配置

- **单元测试**: Jest, 测试文件 `*.spec.ts`
- **e2e 测试**: Supertest, 配置 `test/jest-e2e.json`
- **测试目录**: `test/` 存放 e2e 测试，`src/**/*.spec.ts` 存放单元测试

---

## 编译输出

- 输出目录: `dist/`
- 编译命令: `npm run build`
- 入口文件: `dist/main.js`

---

## Claude Code 开发指南

当你协助后端开发时，请遵循以下规则：

1. **NestJS 约定**:
   - 遵循 NestJS 标准的文件结构和装饰器使用
   - 使用依赖注入
   - 保持单一职责原则

2. **认证授权**:
   - 使用 JWT + bcrypt 密码加密
   - 敏感路由使用 AuthGuard
   - 公开路由使用 @Public() 装饰器

3. **数据验证**:
   - 所有请求入参使用 DTO + class-validator 装饰器
   - 使用 class-transformer 转换类型

4. **API 文档**:
   - 为所有 Controller 添加 @ApiOperation、@ApiResponse 装饰器
   - 为所有 DTO 添加 Swagger 文档装饰器

5. **错误处理**:
   - 使用 HttpException 抛出异常
   - 统一异常处理在全局过滤器中处理

6. **环境配置**:
   - 使用 ConfigService 读取环境变量
   - 不要硬编码配置

7. **代码规范**:
   - 遵循 ESLint 规则
   - 使用 Prettier 格式化
   - 执行 `npm run lint` 自动修复

8. **测试**:
   - 为新功能编写单元测试
   - 遵循 Jest 测试规范
