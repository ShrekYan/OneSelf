# 项目测试规范

## 测试框架

- **框架**：Jest + @nestjs/testing
- **文件命名**：`*.spec.ts`，和源文件放在同一目录
  - `auth.controller.ts` → `auth.controller.spec.ts`
  - `auth.service.ts` → `auth.service.spec.ts`
- **e2e 测试**：放在 `test/` 目录，命名 `*.e2e-spec.ts`

## 测试编写原则

1. **所有依赖必须 mock**：PrismaService、其他 Service、ConfigService 等外部依赖都使用 Jest mock，不连接真实数据库
2. **测试隔离**：`beforeEach` 重新初始化测试模块，`jest.clearAllMocks()` 清除 mock 调用
3. **完整覆盖**：每个公共方法至少两个测试用例：成功场景 + 一个主要异常场景
4. **清晰分组**：`describe` 分层次（大类 → 方法 → 场景）
5. **描述清晰**：`it("should ...", () => {})` 用自然语言清晰描述测试行为
6. **断言准确**：检查返回值，检查 mock 是否被正确调用，检查异常是否正确抛出
7. **AAA 模式**：使用 `// given / when / then` 三段式结构组织测试代码
