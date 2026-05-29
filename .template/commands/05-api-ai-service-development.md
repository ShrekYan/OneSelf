# 05. API 与 AI 服务开发 Command 模板

## 分类定位

面向 API 脚手架、API Mock、AI Assistant 与 LangChain/LangGraph Agent 的 command。该类命令关注服务架构、接口契约、状态管理、测试、部署和运行时监控。

## 适用命令

| 命令文件 | 标题/用途 | 典型输出 |
| --- | --- | --- |
| `api-scaffold.md` | API Scaffold Generator | API 项目结构、模型、路由、测试、部署配置 |
| `api-mock.md` | API Mocking Framework | Mock Server、场景、动态数据、契约测试 |
| `ai-assistant.md` | AI Assistant Development | 对话系统架构、NLU、上下文、LLM 集成 |
| `langchain-agent.md` | LangChain/LangGraph Agent Scaffold | Agent 状态图、工具、记忆、执行流 |

## 结构化模板

```markdown
---
model: claude-sonnet-4-0
---

# {API or AI Service Command Title}

You are an API / AI application development expert specializing in {service_type}.

## Context
The user needs to build or simulate {target_service}. Focus on production-ready architecture, clear contracts, robust validation, testing, and observability.

## Requirements
$ARGUMENTS

## Instructions

### 1. Requirement and Contract Analysis
- Identify endpoint, conversation, tool, or workflow requirements.
- Define input/output schemas and error contracts.
- Identify auth, rate limit, persistence, and integration requirements.

### 2. Architecture Design
- Choose framework and project structure.
- Define layers: routes/controllers, schemas, services, repositories, clients, tools.
- For AI systems, define context, memory, tools, guardrails, fallback, and evaluation.

### 3. Implementation Scaffold
- Generate minimal production-ready structure.
- Include validation, error handling, logging, testing, and documentation.
- Include mocks or stubs when external dependencies are not available.

### 4. Testing and Verification
- Unit tests.
- Integration / contract tests.
- Mock scenario tests.
- AI evaluation or conversation tests if relevant.

### 5. Deployment and Operations
- Configuration.
- Health checks.
- Metrics and tracing.
- CI/CD and rollback guidance.

## Output Format
Return:
- Service Summary
- Architecture
- Interface / Contract Definitions
- Implementation Scaffold
- Test Plan
- Deployment Notes
- Operational Checks
```

## 通用字段

```yaml
service_command:
  service_type: rest_api | mock_api | ai_assistant | langchain_agent | langgraph_agent
  inputs: []
  outputs: []
  contracts:
    schemas: []
    errors: []
    auth: 可选
  architecture:
    framework: fastapi | express | django_rest | spring_boot | langchain | langgraph | other
    layers: []
  testing:
    unit: []
    integration: []
    contract: []
    evaluation: []
  operations:
    health_checks: []
    metrics: []
    logs: []
```

## 子类型字段

### A. API Scaffold

```yaml
api_scaffold:
  endpoints:
    - method: GET | POST | PUT | PATCH | DELETE
      path: /path
      request_schema: {}
      response_schema: {}
      errors: []
  persistence:
    database: postgres | mysql | mongodb | redis | none
    migration_tool: alembic | prisma | flyway | other
  security:
    auth: jwt | oauth2 | api_key | session | none
    permissions: []
```

### B. API Mock

```yaml
api_mock:
  mock_server:
    framework: fastapi | express | msw | wiremock | other
    latency_simulation: true | false
    request_tracking: true | false
  scenarios:
    - name: success
      conditions: []
      response: {}
    - name: error
      conditions: []
      response: {}
  contract_tests: []
```

### C. AI Assistant

```yaml
ai_assistant:
  capabilities:
    - intent_recognition
    - entity_extraction
    - response_generation
    - tool_use
    - context_management
  llm:
    provider: anthropic | openai | local | other
    model: 模型名称
    streaming: true | false
  guardrails:
    input_validation: []
    output_validation: []
    fallback_strategy: []
```

### D. Agent Scaffold

```yaml
agent_scaffold:
  graph:
    nodes: []
    edges: []
    state_schema: {}
  tools: []
  memory:
    type: short_term | long_term | vector | none
  evaluation:
    test_cases: []
    success_metrics: []
```
