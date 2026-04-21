# 前端 H5 项目开发指南

## 📋 项目描述

博客项目前端 H5 移动端，基于 React 19.2.3 + TypeScript 5.5.3 + MobX 6.13.5 + Ant Design Mobile 5.42.3 + SCSS (CSS Modules) + Axios 实现。

## 🚀 核心技术栈

- **React 19.2.3** + **TypeScript 5.5.3**
- **Vite 7.3.1** + **MobX 6.13.5**
- **Ant Design Mobile 5.42.3**
- **SCSS** (CSS Modules) + **Axios**

## 📁 关键目录结构

```
apps/web/src/
├── api/                # API 接口层（按业务领域拆分）
│   ├── core/           # 核心工具：axios-instance / types / request-cache / cancel-manager
│   └── [module]/       # 业务模块：定义接口函数 + 类型
├── assets/             # 静态资源
│   ├── images/         # 业务图片（命名：kebab-case）
│   └── icons/          # SVG 图标（命名：*-icon.svg）
├── components/         # 全局公共组件
│   └── [Component]/    # 每个组件独立目录：index.tsx + index.module.scss
├── hooks/              # 自定义 Hooks（一个 Hook 一个文件：useXXX.ts）
├── pages/              # 页面组件（路由对应页面）
│   └── [Page]/         # 页面目录
│       ├── index.tsx   # 页面入口（只做渲染和组合）
│       ├── useStore.ts # 页面局部状态（MobX useLocalObservable）
│       ├── constant.ts # 页面常量定义
│       ├── handle.ts   # 页面事件处理 / 业务逻辑
│       ├── types.ts    # 页面类型定义
│       ├── components/ # 页面内部分拆的子组件
│       └── index.module.scss # 页面样式
├── store/              # 全局 Store（如果需要）
├── styles/             # 全局样式 + 变量 + mixins
├── types/              # 全局类型定义
│   ├── index.ts        # 通用类型导出
│   └── [domain].ts     # 按领域定义业务实体类型
└── routes/             # 路由配置
```

### 目录命名与职责约定

| 目录 | 职责 | 命名规则 |
|------|------|----------|
| `api/[module]` | 按业务领域拆分 API | 小写，短横线分隔 |
| `components/[Component]` | 公共组件 | PascalCase |
| `pages/[Page]` | 页面 | PascalCase |
| `hooks/useXXX` | 自定义 Hooks | camelCase，必须以 `use` 开头 |
| `assets/images` | 静态图片 | kebab-case |
| `assets/icons` | SVG 图标 | kebab-case，以 `-icon` 结尾 |

## ⚖️ 黄金开发准则 (必读)

1. **导入路径**: 始终使用路径别名 `@/xxx`，禁止相对路径。
2. **样式管理**: 仅使用 `*.module.scss`，**SCSS 源码和 TS 引用全部使用 camelCase**。
3. **状态管理**: 使用 MobX + `useObserver` (Hook 写法)，**禁止使用 observer HOC**。
4. **组件拆分**: 优先使用 `antd-mobile`；长页面必须按功能模块拆分子组件。
5. **强类型**: 必须为所有代码（Props, API, Store）添加显式 TypeScript 类型。
6. **API 规范**: 在 `apps/web/src/api/` 定义，必须包含 Request/Response 完整类型。
7. **移动端**: 基于 750px 设计稿编写 px，插件会自动转换为 vw。

## 📚 规范索引 (模块化拆分)

- **专家级开发规范**: [.claude/skills/h5-frontend-developer/h5-frontend-developer.md](.claude/skills/h5-frontend-developer/h5-frontend-developer.md)
- **API 设计规范**: [.claude/rules/frontend-api-design.md](.claude/rules/frontend-api-design.md)
- **TypeScript 规范**: [.claude/rules/frontend-typescript.md](.claude/rules/frontend-typescript.md)
- **CSS/SCSS 规范**: [.claude/rules/frontend-css-scss.md](.claude/rules/frontend-css-scss.md)
- **Hooks 与错误处理**: [.claude/rules/frontend-hooks-error-handling.md](.claude/rules/frontend-hooks-error-handling.md)
- **静态资源规范**: [.claude/rules/frontend-assets-resources.md](.claude/rules/frontend-assets-resources.md)
- **第三方库规范**: [.claude/rules/frontend-third-party-libraries.md](.claude/rules/frontend-third-party-libraries.md)
- **公共组件规范**: [apps/web/src/components/CLAUDE.md](apps/web/src/components/CLAUDE.md)
- **代码审查清单**: [.claude/commands/review.md](.claude/commands/review.md)
- **提交规范**: [commitlint.config.js](commitlint.config.js)

---

<!-- 引入完整 H5 前端开发技能规范 -->
include: ../skills/h5-frontend-developer/h5-frontend-developer.md
