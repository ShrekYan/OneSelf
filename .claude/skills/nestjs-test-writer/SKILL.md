---
name: nestjs-test-writer
description: Use this skill when the user wants to generate NestJS backend unit tests. Triggers include "写测试", "生成测试", "单元测试", "NestJS 测试", "Jest 测试", "Controller 测试", "Service 测试", "Guard 测试". Also use when reviewing test coverage or creating test cases for NestJS 11 + TypeScript + Prisma backend code. Do NOT use for frontend unit tests (use frontend-test instead), e2e tests, or non-NestJS frameworks.
license: Complete terms in LICENSE.txt
---

# NestJS 后端单元测试编写规范

## Overview

本 Skill 用于为 NestJS 后端项目生成高质量、可直接运行的 Jest 单元测试。适用于 Controller、Service、Guard、Interceptor、Pipe、Middleware 等 NestJS 组件，严格遵循项目测试规范和 AAA 三段式结构。

## When to use this skill

- 用户要求为 NestJS Controller / Service / Guard / Interceptor / Pipe / Middleware 生成单元测试
- 用户输入包含 "写测试"、"生成测试"、"单元测试"、"NestJS 测试"、"Jest 测试" 等关键词
- 需要补充已有模块的测试覆盖
- 审查测试用例是否完整

不适用场景：

- 前端单元测试（应使用 frontend-test）
- e2e 测试或集成测试
- 非 NestJS 框架的测试

## Inputs

- 待测试的源文件路径或源码内容
- 测试目标类型（Controller / Service / Guard / Interceptor / Pipe / Middleware）
- 源文件中的依赖项（Service、Prisma、Config 等需要 mock 的对象）
- 需要重点覆盖的成功 / 异常 / 边界场景

## Workflow

1. **识别任务类型**：判断目标属于 Controller、Service、Guard、Interceptor、Pipe 还是 Middleware。
2. **读取参考文档**：按需加载 [reference/core-philosophy.md](./reference/core-philosophy.md)、[reference/testing-principles.md](./reference/testing-principles.md) 和 [reference/capabilities.md](./reference/capabilities.md)。
3. **分析源文件**：识别所有公共方法、依赖、参数、返回值和可能抛出的异常。
4. **制定测试计划**：为每个公共方法规划成功场景 + 至少一个主要异常场景。
5. **生成测试代码**：参考 [templates/test-templates.md](./templates/test-templates.md) 编写 `*.spec.ts` 文件。
6. **输出测试报告**：按照 [reference/output-format.md](./reference/output-format.md) 说明覆盖场景和运行命令。
7. **验证完整性**：对照 [reference/workflow.md](./reference/workflow.md) 检查是否遗漏公共方法或依赖未 mock。

## Resources

| 资源 | 何时使用 |
|------|----------|
| `reference/core-philosophy.md` | 开始生成测试前，理解核心理念和行为准则 |
| `reference/capabilities.md` | 确认本 Skill 支持的测试类型和覆盖范围 |
| `reference/testing-principles.md` | 编写测试时遵循项目规范 |
| `reference/workflow.md` | 按照标准流程执行测试生成 |
| `reference/output-format.md` | 输出测试覆盖说明和运行命令 |
| `templates/test-templates.md` | 复制 Controller / Service / Guard 等测试模板 |
| `examples/` | 未来补充示例输入输出时使用 |

## Output format

最终交付物包括：

1. 生成的 `*.spec.ts` 测试文件内容
2. 测试覆盖说明表格（方法 → 覆盖场景）
3. Mock 说明
4. 运行测试的命令

具体格式参考 [reference/output-format.md](./reference/output-format.md)。

## Validation

- [ ] 是否识别了所有公共方法
- [ ] 每个公共方法是否至少覆盖成功和主要异常场景
- [ ] 所有外部依赖是否都已 mock
- [ ] 是否使用 `beforeEach` + `jest.clearAllMocks()` 保证测试隔离
- [ ] 是否使用 `// given / when / then` 三段式结构
- [ ] 测试文件名是否与源文件对应（`xxx.service.ts` → `xxx.service.spec.ts`）
- [ ] 生成的测试代码是否可直接运行

## Constraints

- 必须使用 Jest + `@nestjs/testing`，不使用真实数据库或外部服务
- 不生成前端测试代码
- 不生成 e2e 测试
- 所有依赖必须 mock，禁止直接调用真实 Service / Prisma / Redis
- 测试文件和源文件放在同一目录
