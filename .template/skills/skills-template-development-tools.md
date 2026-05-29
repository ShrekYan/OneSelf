# 开发工具类 Skills 模板

## 适用技能

适用于面向开发、构建、API、协议、工具链和 skill 迭代的 skills：

- `claude-api`
- `mcp-builder`
- `skill-creator`

交叉参考：

- `web-artifacts-builder`：主归类为设计创作类，但具备复杂前端工具链和组件构建特征。

## 分类特征

开发工具类 skill 的共同特征：

1. 用户目标通常是构建、集成、调试、评估或优化某类开发产物。
2. 输出可能是代码、配置、评估用例、参考实现、工具调用方案或开发流程。
3. 常需要加载 `reference/` 中的长指南或多语言实现说明。
4. 常包含分阶段流程：研究、设计、实现、测试、评估、迭代。
5. 强调可运行、可验证、可维护和安全边界。

## 典型目录结构

```text
development-tool-skill/
├── SKILL.md
├── LICENSE.txt
├── reference/
│   ├── best_practices.md
│   ├── python_guide.md
│   ├── node_guide.md
│   └── evaluation.md
├── scripts/
│   ├── evaluation.py
│   ├── connections.py
│   └── requirements.txt
├── assets/
│   └── eval_review.html
└── examples/
```

## `SKILL.md` 推荐结构

```markdown
---
name: development-tool-skill
description: Use this skill when the user wants to build, integrate, evaluate, or improve {{developer-facing system}}.
license: Complete terms in LICENSE.txt
---

# Development Tool Skill

## Overview

## Process

## Phase 1: Research and Planning

## Phase 2: Implementation

## Phase 3: Review and Test

## Phase 4: Evaluation

## Reference Files

## Scripts and Tooling

## Output Format

## Quality Checklist
```

## 开发流程模板

```markdown
## Development Workflow

1. 明确用户要构建或集成的目标。
2. 收集技术栈、运行环境、接口、认证和约束。
3. 读取必要参考文档。
4. 设计目录结构、数据流、错误处理和验证方式。
5. 实现最小可运行版本。
6. 执行构建、语法检查、单元测试或集成测试。
7. 根据测试结果迭代。
8. 交付代码、配置、运行说明和验证结果。
```

## 参考文档组织模板

```text
development-tool-skill/
└── reference/
    ├── overview.md
    ├── best_practices.md
    ├── sdk_usage.md
    ├── python_guide.md
    ├── node_guide.md
    └── evaluation.md
```

`SKILL.md` 中应提供资源导航：

```markdown
## Reference Files

- Load `reference/best_practices.md` before implementation.
- Load `reference/python_guide.md` when implementing Python.
- Load `reference/node_guide.md` when implementing Node or TypeScript.
- Load `reference/evaluation.md` when creating evals.
```

## 多语言文档组织模板

当 skill 支持多语言时，建议按语言拆分：

```text
reference/
├── shared_concepts.md
├── python.md
├── typescript.md
├── go.md
├── java.md
├── curl.md
└── troubleshooting.md
```

组织原则：

1. 通用概念放入 `shared_concepts.md`。
2. 每个语言文件只包含该语言的安装、初始化、关键 API 和常见错误。
3. `SKILL.md` 只负责根据用户技术栈选择读取哪个文件。
4. 避免把所有语言内容堆入 `SKILL.md`。

## 脚本工具模板

```text
development-tool-skill/
└── scripts/
    ├── connections.py
    ├── evaluation.py
    ├── generate_report.py
    ├── example_evaluation.xml
    └── requirements.txt
```

脚本适用场景：

- 检查外部服务连接。
- 生成或运行评估用例。
- 汇总测试报告。
- 验证配置是否正确。
- 辅助生成标准文件。

`SKILL.md` 中应说明脚本的输入输出，不应让用户猜测调用方式。

## 评估与迭代模板

```markdown
## Evaluation Workflow

1. 定义用户真实任务。
2. 编写少量代表性测试 prompt。
3. 如果结果可客观验证，补充断言或检查项。
4. 同时运行当前方案和 baseline。
5. 记录输出质量、错误、耗时和 token 消耗。
6. 根据评估结果修改 skill、代码或参考文档。
7. 扩大测试集后再次验证。
```

适合评估的内容：

- skill 触发准确率。
- 工具或 API 集成是否成功。
- MCP server 工具是否可被模型发现和正确使用。
- 代码生成结果是否可构建、可运行、可测试。
- 输出是否符合用户指定格式。

## 打包与发布检查

- [ ] `SKILL.md` 是否包含清晰触发描述。
- [ ] 是否把长参考资料拆入 `reference/`。
- [ ] 是否说明支持的语言、框架和运行环境。
- [ ] 是否有本地验证方式。
- [ ] 是否说明外部依赖和认证要求。
- [ ] 是否避免在模板中硬编码密钥、token 或私有 URL。
- [ ] 是否有错误处理与排障指引。
- [ ] 是否有评估或测试样例。
- [ ] 是否说明不适用场景。

## 适用示例

### 示例 1：构建 MCP server

```markdown
用户需求：为某个外部 API 构建 MCP server。

流程：
1. 读取 MCP 最佳实践。
2. 确认语言和 transport。
3. 设计工具名称、输入 schema、输出结构。
4. 实现 API client、错误处理、分页。
5. 使用 Inspector 或测试脚本验证。
6. 编写 eval questions。
```

### 示例 2：创建新 skill

```markdown
用户需求：把一套重复工作流沉淀为 skill。

流程：
1. 捕获触发场景、输入、输出和成功标准。
2. 起草 `SKILL.md`。
3. 编写测试 prompts。
4. 对比有 skill 和无 skill 的输出。
5. 根据评估结果迭代 description 和流程。
```

### 示例 3：Claude API 指南类

```markdown
用户需求：用某种语言接入 Claude API。

流程：
1. 判断语言和 SDK。
2. 读取对应语言参考。
3. 给出最小可运行示例。
4. 补充认证、错误处理、流式输出或工具调用说明。
5. 提供本地验证方式。
```
