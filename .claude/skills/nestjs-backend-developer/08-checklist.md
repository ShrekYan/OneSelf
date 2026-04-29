# 08 - 开发完成检查清单

开发完成后，请检查以下项目：

## 架构与模块
- [ ] 是否按业务领域正确创建了模块？
- [ ] 模块目录结构是否符合标准？
- [ ] 分层是否正确（Controller 不包含业务逻辑，Service 不处理 HTTP）？

## 命名规范
- [ ] 所有文件是否使用 kebab-case？
- [ ] 文件名是否符合规范（`.controller.ts`, `.service.ts`, `.dto.ts`）？
- [ ] 所有 DTO 是否以 `Dto` 结尾？
- [ ] 类名是否符合 PascalCase 规范？

## DTO 与验证
- [ ] 所有请求参数是否都有 DTO 定义？
- [ ] 所有响应数据是否都有 DTO 定义？
- [ ] 是否所有字段都添加了 `class-validator` 验证装饰器？
- [ ] 数字类型是否添加了 `@Type(() => Number)`？
- [ ] 可选字段是否添加了 `@IsOptional()` 并设置了默认值？
- [ ] 所有 DTO 是否在 `dto/index.ts` 导出？
- [ ] Controller 是否统一从 `./dto` 导入？

## TypeScript
- [ ] 是否所有参数和返回值都有显式类型声明？
- [ ] 是否避免了使用 `any`？
- [ ] 依赖注入是否使用 `private readonly`？
- [ ] Promise 是否正确指定了泛型类型？

## API 文档
- [ ] Controller 是否添加了 `@ApiTags`？
- [ ] 每个路由是否添加了 `@ApiOperation({ summary })`？
- [ ] 每个 DTO 字段是否添加了 `@ApiProperty` 并填写了 description？

## 代码质量
- [ ] 执行过 `npm run lint` 并修复了所有问题？
- [ ] 执行过 `npm run format` 格式化代码？
- [ ] 执行过 `npx tsc --noEmit` 没有类型错误？
- [ ] 为新功能编写了单元测试？
- [ ] 移除了调试用的 `console.log`？

## 安全认证
- [ ] Token 是否优先从 HttpOnly Cookie 提取？
- [ ] 设置 Cookie 时是否启用了 `httpOnly: true`？
- [ ] 生产环境是否启用了 `secure: true`？
- [ ] 密码加密是否使用了 Argon2id（argon2 包）？
- [ ] Refresh Token 是否存储在 Redis 中？
- [ ] 是否支持单设备登出和全部设备登出功能？
- [ ] 登录失败提示是否统一，不暴露具体错误原因？
- [ ] 敏感信息（密码、Token）是否不会被完整记录到日志？
- [ ] Auth Guard 是否正确处理了 Token 无效和过期的情况？
- [ ] 是否使用了 CORS 中间件并正确配置了允许的 Origin？
- [ ] 远程认证服务调用失败时是否返回适当的错误信息，不暴露服务细节？
- [ ] 所有需要认证的接口是否都正确使用了 Auth Guard？

## 中间件与可观测性
- [ ] 中间件类是否使用了 `@Injectable()` 装饰器？
- [ ] 中间件是否正确实现了 `NestMiddleware` 接口？
- [ ] 中间件是否在正确的层级注册（全局 vs 模块）？
- [ ] 请求日志中间件是否记录了方法、路径、状态码、耗时、IP？
- [ ] 慢请求是否有专门的警告日志？

## Prisma ORM
- [ ] Schema 中每个模型和字段都添加了 `///` 文档注释吗？
- [ ] 表名字段名是否遵循下划线命名规范？
- [ ] 是否只查询需要的字段（使用 `select` 优化查询性能）？
- [ ] 多个原子写操作是否使用事务保证一致性？
- [ ] 查询单条记录时是否处理了记录不存在的情况？
- [ ] 从数据库到 DTO 是否正确完成下划线到驼峰命名转换？
- [ ] 分页查询是否正确使用 `skip` + `take` 并查询总数？
- [ ] 常用查询字段是否添加了索引？
- [ ] 全小写模型名访问时是否正确处理了 TypeScript 类型问题？
- [ ] PrismaService 是否实现了连接重试机制？
- [ ] 是否配置了慢查询检测阈值？
- [ ] 是否正确实现了 OnModuleInit 和 OnModuleDestroy 生命周期？

## 业务错误处理
- [ ] 业务错误是否使用 `BusinessException` + 业务错误码？
- [ ] 新增业务错误码是否添加了默认错误消息？
- [ ] Prisma 操作是否处理了记录不存在等常见错误？

## 最后一步
- [ ] 启动服务 `npm run start:dev` 验证 API 可正常访问？
- [ ] 打开 Swagger 文档检查文档显示正常？

## 代码格式
- [ ] 执行过 `npm run lint` 并修复了所有错误和警告？
- [ ] 执行过 `npm run format` 格式化所有代码？
