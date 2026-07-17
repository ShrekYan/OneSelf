# Agent 编排说明

## 三个专业 Agent

### 1. frontend-code-reviewer

- **职责**：前端代码质量审查。
- **检查重点**：TypeScript 类型安全、React 19 最佳实践、MobX 状态管理、项目规范符合度。
- **引用清单**：`.claude/skills/frontend-code-review/SKILL.md`

### 2. frontend-security-auditor

- **职责**：前端安全漏洞扫描。
- **检查重点**：XSS、注入攻击、敏感信息泄露、认证授权、前端存储、CSP、第三方脚本与接口调用安全。
- **引用清单**：`.claude/agents/frontend-security-auditor.md`

### 3. frontend-performance-expert

- **职责**：前端性能优化分析。
- **检查重点**：React 19 + MobX + Vite + Ant Design Mobile 技术栈下的移动端 H5 性能瓶颈。
- **引用清单**：`.claude/skills/frontend-perf/SKILL.md`

## 输入传递方式

- 将用户指定的检查范围原样传递给每个 Agent。
- 将 `--continue-on-error` 语义传递给每个 Agent，使其在内部失败时返回结果而非中断。
- 不向前端安全或性能 Agent 传递代码质量 Agent 的中间结果，避免影响独立判断。

## 结果整合原则

- 保留每个 Agent 的原始发现分类。
- 对跨 Agent 重复的同类问题合并描述，并取最高优先级。
- 按文件 / 模块组织问题，便于开发者按位置修复。
