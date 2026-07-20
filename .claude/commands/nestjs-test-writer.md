---
name: nestjs-test-writer
description: NestJS 后端单元测试生成，按照项目规范为 Controller/Service 生成完整 Jest 测试用例
---

# NestJS Test Writer Command

## ✅ 立即执行：调用 NestJS 测试编写专家 Agent

**使用 `Agent` 工具**，参数如下：

| 参数 | 值 |
|------|----|
| `subagent_type` | `nestjs-test-writer` |
| `description` | 用户的 NestJS 测试生成需求 |
| `prompt` | "用户需求：$ARGUMENTS\n\n请严格按照你的系统提示词中的测试编写工作流程执行。" |

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

---

## 分类定位

面向测试框架的 command，聚焦于 NestJS 后端单元测试生成，为 Controller/Service/Repository 生成符合项目规范的 Jest 测试用例。

## Context

用户需要为 NestJS 后端代码生成单元测试，基于 Jest，确保测试覆盖 Controller、Service、Repository 等层。

## Requirements

$ARGUMENTS

## Instructions

### 1. Scope Identification
- 识别测试范围：Controller、Service、Repository
- 识别适用标准和测试级别
- 定义假设和排除项

### 2. Automated Checks
- 选择测试框架和工具（Jest）
- 定义测试策略和执行方法
- 规范化结果格式

### 3. Manual / Expert Review
- 验证测试覆盖完整性
- 检查高风险区域的测试
- 添加自动化不足时的手动测试场景

### 4. Findings and Remediation
- 为每个发现项包含：严重级别、证据、影响、位置、修复建议、验证方法

### 5. Continuous Governance
- CI/CD 集成
- 回归检查
- 负责人和定期审查节奏