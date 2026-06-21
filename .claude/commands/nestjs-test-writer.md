---
name: nestjs-test-writer
description: NestJS 后端单元测试生成，按照项目规范为 Controller/Service 生成完整 Jest 测试用例
---

# NestJS Test Writer Command

## 分类定位

面向测试框架的 command，聚焦于 NestJS 后端单元测试生成，为 Controller/Service/Repository 生成符合项目规范的 Jest 测试用例。

## 适用场景

| 场景 | 描述 | 典型输出 |
| --- | --- | --- |
| Controller 测试 | API 端点测试用例 | 请求响应测试、状态码验证 |
| Service 测试 | 业务逻辑测试 | 方法调用测试、Mock 依赖 |
| Repository 测试 | 数据访问层测试 | 数据库操作验证 |

## Context

用户需要为 NestJS 后端代码生成单元测试，基于 Jest，确保测试覆盖 Controller、Service、Repository 等层。

## Requirements

$ARGUMENTS

## Instructions

### 1. Scope Identification
- 识别测试范围：Controller、Service、Repository
- 确定测试级别：单元测试、集成测试、端到端测试
- 定义测试覆盖目标

### 2. Test Strategy Definition
- 选择测试框架和工具（Jest）
- 定义测试结构和模式
- 确定 Mock 策略和测试数据

### 3. Test Implementation
- 生成测试用例
- 编写断言
- 添加 Mock 和 Spy

### 4. Verification and CI Integration
- 运行测试验证
- 确保测试通过
- 提供 CI 集成建议

## Output Format

Return:
- Test Summary（测试摘要）
- Generated Test Files（生成的测试文件）
- Test Coverage（测试覆盖率）
- CI Integration Steps（CI 集成步骤）
- Next Steps（下一步行动）

## 测试框架配置

```yaml
test_harness:
  language: typescript
  framework: jest
  test_levels:
    - unit
    - integration
    - e2e
  fixtures: []
  ci_steps: []
```

---

## 强制执行协议

<!-- 🔴 🔴 🔴 最高优先级：必须首先执行工具调用 -->
<!-- 使用 Claude Code 原生 Agent 工具，100% 触发 NestJS 测试编写专家 -->

### ✅ 立即执行：调用 NestJS 测试编写专家 Agent

**使用 `Agent` 工具**，参数如下：

| 参数 | 值 |
|------|----|
| `subagent_type` | `nestjs-test-writer` |
| `description` | 用户的 NestJS 测试生成需求 |
| `prompt` | "用户需求：{{完整用户需求描述}}\n\n请严格按照你的系统提示词中的测试编写工作流程执行。" |

### 🔍 自我验证（执行后确认）
- [ ] 我使用了 `Agent` 工具进行调用
- [ ] 我没有自行扫描或分析任何代码
- [ ] 调用 Agent 是我做的第一件事
- [ ] 我在调用前没有输出其他文字

### ❌ 绝对禁止行为（违反即失败）
- 主 Claude 自行编写测试
- 跳过 Agent 直接输出测试代码
- 先解释再调用 Agent
- 输出任何与调用 Agent 无关的内容
