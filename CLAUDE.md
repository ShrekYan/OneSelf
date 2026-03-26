# Claude Code 项目指南

## 🚀 核心技术栈
- **React 19.2.3** + **TypeScript 5.5.3**
- **Vite 7.3.1** + **MobX 6.13.5**
- **Ant Design Mobile 5.42.3**
- **SCSS** (CSS Modules) + **Axios**

## 🛠️ 关键指令
- **开发**: `npm run dev` (默认外测环境)
- **构建**: `npm run build` (全流程)
- **检查**: `npm run lint` / `npx tsc --noEmit`
- **各环境开发**: `npm run test-dev` (测试) | `npm run sit-dev` (SIT) | `npm run prd-dev` (生产)

## ⚖️ 黄金开发准则 (必读)
1. **导入路径**: 始终使用路径别名 `@/xxx`，禁止相对路径。
2. **样式管理**: 仅使用 `*.module.scss` (kebab-case class, camelCase TS)。
3. **状态管理**: 使用 MobX + `useObserver` (Hook 写法)，**禁止使用 observer HOC**。
4. **组件拆分**: 优先使用 `antd-mobile`；长页面必须按功能模块拆分子组件。
5. **强类型**: 必须为所有代码（Props, API, Store）添加显式 TypeScript 类型。
6. **API 规范**: 在 `src/api/` 定义，必须包含 Request/Response 完整类型。
7. **移动端**: 基于 750px 设计稿编写 px，插件会自动转换为 vw。

## 📚 规范索引 (模块化拆分)
- **专家级开发规范**: [.claude/skills/h5-frontend-developer.md](file:///.claude/skills/h5-frontend-developer.md)
- **API 详细规范**: [src/api/CLAUDE.md](file:///src/api/CLAUDE.md)
- **公共组件规范**: [src/components/CLAUDE.md](file:///src/components/CLAUDE.md)
- **代码审查清单**: [.claude/commands/review.md](file:///.claude/commands/review.md)
- **提交规范**: [commitlint.config.js](file:///commitlint.config.js)

## ✅ 验证流程
完成开发后，请务必依次执行：
1. `npm run lint` (代码风格校验)
2. `npx tsc --noEmit` (TypeScript 类型检查)
3. 参照 [.claude/commands/review.md](file:///.claude/commands/review.md) 进行自我审计。
