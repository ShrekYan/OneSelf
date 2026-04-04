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

## 最后一步
- [ ] 启动服务 `npm run start:dev` 验证 API 可正常访问？
- [ ] 打开 Swagger 文档检查文档显示正常？

## Prisma ORM
- [ ] Schema 中每个模型和字段都添加了 `///` 文档注释吗？
- [ ] 表名字段名是否遵循下划线命名规范？
- [ ] 是否只查询需要的字段（使用 `select` 优化查询性能）？
- [ ] 多个原子写操作是否使用事务保证一致性？
- [ ] 查询单条记录时是否处理了记录不存在的情况？
- [ ] 从数据库到 DTO 是否正确完成下划线到驼峰命名转换？
- [ ] 分页查询是否正确使用 `skip` + `take` 并查询总数？
- [ ] 常用查询字段是否添加了索引？
