# Claude Code 项目指南

### 项目描述
全栈博客项目，前端 H5 移动端 + 后端 NestJS API 服务。

## 🚀 核心技术栈

### 前端
- React 19.2.3 + TypeScript 5.5.3
- Vite 7.3.1 + MobX 6.13.5
- Ant Design Mobile 5.42.3 + SCSS (CSS Modules)

### 后端
- NestJS 11.0.1 + TypeScript 5.7.3
- Prisma ORM 6.4.1

## 🛠️ 关键指令

### 前端
- **开发**: `npm run dev` (默认外测环境)
- **构建**: `npm run build` (全流程)
- **检查**: `npm run lint` / `npx tsc --noEmit`
- **各环境开发**: `npm run test-dev` (测试) | `npm run sit-dev` (SIT) | `npm run prd-dev` (生产)

### 后端 (backend 目录)
- **开发**: `npm run start:dev`
- **构建**: `npm run build`
- **检查**: `npm run lint`

## 📚 项目规范入口

- **前端 H5 规范**: [.claude/projects/frontend-project-info.md](.claude/projects/frontend-project-info.md)
- **后端 NestJS 规范**: [.claude/projects/backend-project-info.md](.claude/projects/backend-project-info.md)

## 行为标准

### 代码规范
1. 优先复用已有组件和工具函数，不要重复实现相同功能。
2. 不要无理由重名文件、函数或者目录
3. 涉及公共接口或导出结构的修改，先确认影响范围，避免引入未知问题
4. 新增代码与当前项目风格保持一致，包括命名规范、代码格式、注释等。
5. 项目中尽量少用any类型，优先定义具体的类型。

### 安全规范
1. 不直接操作生产环境配置
2. 不提交API密钥、Token等敏感信息

## ✅ 验证流程

完成开发后，请务必依次执行：
1. `npm run lint` (代码风格校验)
2. `npx tsc --noEmit` (TypeScript 类型检查)
3. 参照 [.claude/commands/review.md](.claude/commands/review.md) 进行自我审计。
