# Command 分类结构化模板总览

> 来源目录：`/tmp/commands/tools`
>
> 目标：根据现有 command Markdown 模板的内容结构，抽离可复用的分类体系与结构化模板。

## 1. 通用 command 文件结构

所有模板整体可抽象为以下结构：

```yaml
frontmatter:
  model: claude-sonnet-4-0

command:
  title: 命令标题
  role: 该命令要求模型扮演的专家角色
  context: 使用场景和目标说明
  requirements: 用户输入占位符，通常为 $ARGUMENTS
  instructions:
    - step: 分阶段执行说明
      purpose: 当前阶段目标
      artifacts: 需要产出的代码、配置、报告或清单
  output_format:
    - summary: 总结
    - findings: 发现项
    - recommendations: 建议
    - next_steps: 后续步骤
```

## 2. 分类总表

| 分类 | 文档 | 包含命令 | 核心产物 |
| --- | --- | --- | --- |
| 代码质量与开发流程 | `01-code-quality-dev-flow.md` | `ai-review`、`code-explain`、`code-migrate`、`refactor-clean`、`tech-debt`、`pr-enhance`、`issue`、TDD 系列 | 审查报告、解释文档、迁移计划、重构方案、PR 描述 |
| 测试、安全与合规 | `02-testing-security-compliance.md` | `test-harness`、`security-scan`、`deps-audit`、`compliance-check`、`accessibility-audit` | 测试框架、安全报告、依赖审计、合规清单、无障碍报告 |
| 可观测性与调试 | `03-observability-debugging.md` | `monitor-setup`、`debug-trace`、`error-trace`、`error-analysis`、`smart-debug` | 监控方案、Tracing 配置、错误分析、调试路径 |
| 部署与基础设施 | `04-deployment-infrastructure.md` | `k8s-manifest`、`docker-optimize`、`deploy-checklist`、`db-migrate`、`cost-optimize` | K8s/Docker 配置、部署清单、迁移脚本、成本优化计划 |
| API 与 AI 服务开发 | `05-api-ai-service-development.md` | `api-scaffold`、`api-mock`、`ai-assistant`、`langchain-agent` | API 脚手架、Mock 服务、AI Assistant 架构、Agent Scaffold |
| 文档与知识管理 | `06-docs-knowledge-management.md` | `doc-generate`、`standup-notes`、`onboard`、`context-save`、`context-restore` | API 文档、会议记录、入职指南、上下文快照 |
| 数据与配置治理 | `07-data-config-governance.md` | `data-pipeline`、`data-validation`、`config-validate`、`slo-implement` | 数据管道、数据校验、配置 Schema、SLO 方案 |
| 依赖升级与提示词优化 | `08-dependency-prompt-optimization.md` | `deps-upgrade`、`prompt-optimize` | 升级路径、迁移指南、Prompt 优化方案 |
| 多智能体协作 | `09-multi-agent-collaboration.md` | `multi-agent-review`、`multi-agent-optimize` | 多角色审查、综合优化计划、决策流 |

## 3. 重复/相近命令处理建议

| 相近组 | 文件 | 建议 |
| --- | --- | --- |
| 调试/错误分析 | `debug-trace`、`error-trace`、`error-analysis`、`smart-debug` | 按“观测配置”和“问题诊断”拆分，保留共同字段：现象、复现、根因、证据、修复方案。 |
| 成本优化 | `cost-optimize` | 当前目录仅存在通用云成本优化模板，可作为部署基础设施分类的成本子模板。 |
| TDD 流程 | `tdd-red`、`tdd-green`、`tdd-refactor` | 保持独立命令，但共享 TDD 状态字段和阶段产物。 |
| 上下文管理 | `context-save`、`context-restore`、`onboard` | 共享项目概览、决策记录、当前状态、下一步字段。 |

## 4. 推荐落地方式

1. 新增 command 时先选择分类。
2. 复用分类文档中的结构化模板。
3. 保持 `$ARGUMENTS` 作为输入占位符。
4. 输出格式必须包含可执行下一步，避免只给泛泛建议。
5. 对审计、安全、合规类命令，必须包含严重级别与修复优先级。
