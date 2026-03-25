# Claude Code 项目专属配置

## 项目概览

**项目类型**: H5 移动端前端项目
**构建工具**: Vite 7.3.1
**代码规范**: ESLint + Prettier + Stylelint + Husky + lint-staged

---

## 技术栈版本

| 技术 | 版本 |
|------|------|
| React | 19.2.3 |
| TypeScript | 5.5.3 |
| Vite | 7.3.1 |
| Ant Design Mobile | 5.42.3 |
| MobX | 6.13.5 |
| MobX React | 9.1.1 |
| React Router DOM | 6.27.0 |
| React Hook Form | 7.54.2 |
| Axios | 1.7.7 |
| SCSS | 1.79.6 |
| ECharts | 5.6.0 |

**特色工具**:
- React Compiler (已启用自动优化)
- postcss-px-to-viewport-8-plugin (px 转 vw)
- React Compression (gzip 压缩)
- vConsole (移动端调试)

---

## 项目结构

```
src/
├── api/          # API 接口定义
├── assets/       # 静态资源
├── components/   # 公共组件
├── hooks/        # 自定义 Hooks
├── pages/        # 页面组件
├── routes/       # 路由配置
├── store/        # MobX 状态管理
├── styles/       # 全局样式
├── types/        # TypeScript 类型定义
├── App.tsx       # 根组件
└── main.tsx      # 入口文件
```

---

## 路径别名

```json
{
  "@/": "src/",
  "@/components": "src/components/",
  "@/pages": "src/pages/",
  "@/utils": "src/utils/",
  "@/hooks": "src/hooks/",
  "@/store": "src/store/",
  "@/api": "src/api/",
  "@/styles": "src/styles/",
  "@/types": "src/types/"
}
```

---

## 样式配置

- 预处理: **SCSS**
- CSS Modules: `*.module.scss`
- 设计稿宽度: **750px**
- 单位转换: px 自动转换为 vw
- 全局变量: `@/styles/variables.scss`

---

## 环境配置

| 环境 | 配置文件 | 启动命令 |
|------|----------|----------|
| 开发 | `.env.development` | `npm run dev` |
| 外测 | `.env.outDev` | `npm run dev` (默认) |
| 测试 | `.env.test` | `npm run test-dev` |
| 专项测试 | `.env.fofTest` | `npm run fofTest-dev` |
| SIT | `.env.sit` | `npm run sit-dev` |
| 预生产 | `.env.pre` | `npm run pre-dev` |
| 生产 | `.env.production` | `npm run prd-dev` |

**构建命令**:
```bash
# 生产构建
npm run build

# 各环境构建
npm run dev-build      # 外测
npm run fofTest-build  # 专项测试
npm run sit-build      # SIT
npm run pre-build      # 预生产
```

---

## 可用脚本

```json
{
  "dev": "vite --force --mode outDev",
  "test-dev": "vite --force --mode test",
  "fofTest-dev": "vite --force --mode fofTest",
  "sit-dev": "vite --force --mode sit",
  "pre-dev": "vite --force --mode pre",
  "prd-dev": "vite --force --mode production",
  "dev-build": "vite build --mode outDev",
  "fofTest-build": "vite build --mode fofTest",
  "sit-build": "vite build --mode sit",
  "pre-build": "vite build --mode pre",
  "build": "tsc -b && vite build",
  "lint": "npx lint-staged --allow-empty",
  "preview": "vite preview",
  "prepare": "husky install"
}
```

---

## 开发规范

1. **组件库**: 使用 Ant Design Mobile (`antd-mobile`)
2. **状态管理**: 使用 MobX
3. **类型检查**: 严格 TypeScript 类型检查
4. **代码规范**:
   - 提交前自动 lint (Husky + lint-staged)
   - commitlint 检查提交信息 (conventional commits)
5. **开发 Skill**: 参考 `.claude/skills/h5-frontend-developer.md`

---

## 浏览器兼容

```
browserslist: [
  "ie >= 10",
  ">0.3%, ios >= 9"
]
```

---

## Git 提交规范

- 遵循 Conventional Commits 规范
- Husky 自动检查
- lint-staged 自动格式化代码

---

## Claude Code 开发指南

当你协助开发时，请遵循以下规则：

1. **导入路径**: 使用路径别名 `@/xxx` 而不是相对路径 `../../xxx`
2. **样式**: 对于组件样式使用 `*.module.scss` + CSS Modules
3. **状态管理**: 使用 MobX，在 `src/store/` 中定义 store
4. **API**: 在 `src/api/` 中定义接口，使用 axios
5. **表单**: 优先使用 React Hook Form
6. **类型**: 必须为所有代码添加正确的 TypeScript 类型
7. **移动端**: 使用 px 编写，会自动转换为 vw，设计稿基于 750px
8. **组件**: 使用 Ant Design Mobile 组件，避免重复造轮子

## MCP 使用规则
- 涉及到框架 API 语法时，自动使用 Context7 查询最新文档
