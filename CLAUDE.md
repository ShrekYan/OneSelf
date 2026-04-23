# Claude Code 项目指南

### 项目描述
全栈博客项目，**Monorepo 单代码仓库架构**，前端 H5 移动端应用 + 后端多微服务。

## 🚀 核心技术栈

### 前端（apps/web/）
- React 19.2.3 + TypeScript 5.5.3
- Vite 7.3.1 + MobX 6.13.5
- Ant Design Mobile 5.42.3 + SCSS (CSS Modules)

### 后端（services/）
- NestJS 11.0.1 + TypeScript 5.7.3
- Prisma ORM 6.4.1

### 构建工具
- Turborepo 2.4.2（Monorepo 构建优化）

## 🛠️ 关键指令

### 根项目（Monorepo 全局）
- **全项目构建**: `npm run build`
- **并行开发所有服务**: `npm run dev`
- **全项目代码检查**: `npm run lint`

### 前端（apps/web/ 目录下）
- **开发**: `npm run dev` (默认外测环境)
- **构建**: `npm run build` (全流程)
- **检查**: `npm run lint` / `npx tsc --noEmit`
- **各环境开发**: `npm run test-dev` (测试) | `npm run sit-dev` (SIT) | `npm run prd-dev` (生产)

### 后端（进入对应服务目录执行，如 services/backend）
- **开发**: `npm run start:dev`
- **构建**: `npm run build`
- **检查**: `npm run lint`

## 📚 项目规范入口

- **前端 H5 项目信息**: [.claude/projects/frontend-project-info.md](.claude/projects/frontend-project-info.md)
- **后端 NestJS 项目信息**: [.claude/projects/backend-project-info.md](.claude/projects/backend-project-info.md)
- **公共组件开发规范**: [.claude/rules/frontend-components.md](.claude/rules/frontend-components.md)
- **全局行为规范**: [.claude/rules/project-behavior.md](.claude/rules/project-behavior.md)

## ✅ 验证流程

完成开发后，请务必依次执行：
1. `npm run lint` (根目录执行，全项目代码风格校验)
2. 前端目录：`npx tsc --noEmit` (TypeScript 类型检查)
3. 参照 [.claude/commands/review.md](.claude/commands/review.md) 进行自我审计。

## 🧠 项目记忆规则

当用户说"添加到项目记忆"，请将用户描述的踩坑教训按照以下要求处理：

1. **目标文件**: `.claude/project-memory.md`
2. **格式要求**: 在文件末尾追加，遵循现有格式：
   ```markdown
   ---

   ## 问题标题（一句话概括）

   ### 错误场景
   什么场景下遇到这个错误

   ### 错误现象
   具体遇到了什么问题，有什么错误表现

   ### 原因分析
   分析错误原因

   ### 正确解决方法
   展示正确的代码/配置/操作步骤

   ### 记录信息
   **记录日期**: YYYY-MM-DD
   **错误原因**: 一句话概括根本原因

   ---
   ```
3. **处理流程**:
   - 先读取现有 `.claude/project-memory.md` 查看当前格式
   - 根据用户描述，整理成标准格式（补全缺失必要信息，但不要编造内容）
   - 追加到文件末尾
   - 保持原有内容不变

---

## 🤖 Agent 自动触发规则

当用户输入符合以下特征时，**自动使用对应的专属 Agent**，无需用户手动指定：

| 用户输入特征 | 自动使用 Agent |
|-------------|---------------|
| 开发前端页面、组件、API、Hook | `frontend-developer` |
| 开发 NestJS 后端、Controller、Service、Module | `backend-architect` |
| 审查前端代码质量 | `frontend-code-reviewer` |
| 审查后端代码质量 | `nestjs-code-review` |
| 前端性能问题分析、优化 | `frontend-performance-expert` |
| 后端性能问题分析、优化 | `nestjs-performance-audit` |
| 前端单元测试编写 | `frontend-test-writer` |
| 后端单元测试编写 | `nestjs-test-writer` |
| 前端安全漏洞扫描 | `frontend-security-auditor` |
| 后端安全漏洞扫描 | `nestjs-security-audit` |
| 搜索代码、组件、调用链 | `search-expert` |
| UI 设计稿转代码、组件设计 | `ui-designer` |
| 生成架构图、流程图、序列图 | `mermaid-generator` |
| 全量前端代码审查（质量 + 安全 + 性能） | `full-frontend-review-orchestrator` |
