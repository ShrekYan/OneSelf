---
name: frontend-test
description: 前端单元测试生成规范，基于 Vitest + React Testing Library 编写符合项目规范的测试用例
model: inherit
---

# 前端测试规范

本文档定义了前端项目单元测试的编写规范和生成规则，包括核心哲学、技术栈、测试模板、最佳实践和输出格式。

## 文档结构

本 Skill 由以下模块化文档组成：

- **[核心哲学与技术栈](./core.md)** - Core Philosophy 和技术栈
- **[测试文件位置与原则](./location-and-principles.md)** - 文件位置规范和测试原则
- **[各类测试编写规范](./patterns.md)** - 纯函数、Hook、Store、组件测试模式
- **[Mock 规范](./mock.md)** - Mock 函数、API 请求、CSS Modules 处理
- **[覆盖率要求](./coverage.md)** - 各模块覆盖率指标
- **[最佳实践与检查清单](./practices.md)** - 命名规范、AAA 模式、常见错误避免
- **[测试命令与行为特征](./commands-and-traits.md)** - 运行命令和行为特征
- **[响应流程与输出格式](./workflow-and-output.md)** - Response Approach 和 Output Format

---

## 使用指南

1. **分析需求**：读取相关源文件，理解实现逻辑，识别依赖关系
2. **制定测试计划**：确定测试类型，规划测试场景，确定测试文件位置
3. **生成测试代码**：遵循测试规范，使用 AAA 模式，正确 mock 外部依赖
4. **验证与交付**：运行测试确保可执行，检查覆盖率，输出测试覆盖说明

---

## 核心原则

- **用户行为测试** - 测试用户可见的行为和结果，而非实现细节
- **单一职责** - 一个测试用例只测试一件事情
- **可重复运行** - 测试不依赖外部状态，每次运行结果一致
- **AAA 模式** - 遵循 Arrange-Act-Assert 模式组织测试代码

详细规范请参考 [核心哲学与技术栈](./core.md)。
