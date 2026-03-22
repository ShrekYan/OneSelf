# H5 前端脚手架

基于 React + TypeScript + Vite 的 H5 前端项目脚手架，集成了 Ant Design Mobile 组件库和完整的开发工具链。

## 技术栈

- **构建工具**: Vite 7.3.1
- **UI 框架**: React 19.2.3
- **开发语言**: TypeScript 5.5.3
- **组件库**: Ant Design Mobile 5.42.3
- **状态管理**: MobX 6.13.5
- **路由**: React Router DOM 6.27.0
- **样式**: SCSS + PostCSS
- **代码规范**: ESLint + Prettier + Stylelint
- **Git 工具**: Husky + Commitlint + lint-staged

## 功能特性

- ⚡️ 基于 Vite 构建，极速的开发体验
- 📱 专门为 H5 端优化，响应式设计
- 🎨 集成 Ant Design Mobile 组件库
- 🔧 完善的开发工具链
- 📦 多环境配置支持（dev、test、sit、pre、prd）
- 🔒 代码规范与质量检查
- 🚀 性能优化（懒加载、代码分割、CDN）
- 📊 打包分析

## 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
# 启动开发服务器
npm run dev

# 测试环境
npm run test-dev

# 预生产环境
npm run pre-dev
```

### 构建

```bash
# 生产环境构建
npm run build

# 其他环境构建
npm run dev-build     # 外测环境
npm run sit-build     # SIT环境
npm run pre-build     # 预生产环境
```

### 代码检查

```bash
# 运行 lint
npm run lint

# 代码预览
npm run preview
```

## 项目结构

```
├── src/
│   ├── api/           # API 接口
│   ├── assets/        # 静态资源
│   ├── components/    # 公共组件
│   ├── hooks/         # 自定义 Hooks
│   ├── pages/         # 页面组件
│   ├── routes/        # 路由配置
│   ├── store/         # MobX 状态管理
│   ├── styles/        # 全局样式
│   ├── types/         # TypeScript 类型定义
│   ├── utils/         # 工具函数
│   ├── App.tsx        # 应用根组件
│   └── main.tsx       # 应用入口
├── public/            # 公共静态资源
├── .env.*             # 环境变量配置
├── .husky/            # Git hooks
├── vite.config.ts     # Vite 配置
├── tsconfig.json      # TypeScript 配置
└── package.json       # 项目依赖
```

## 环境配置

项目支持多环境配置，对应不同的 `.env.*` 文件：

- `.env` - 基础配置
- `.env.development` - 开发环境
- `.env.outDev` - 外测环境
- `.env.test` - 测试环境
- `.env.fofTest` - 专项测试环境
- `.env.sit` - SIT 环境
- `.env.pre` - 预生产环境
- `.env.production` - 生产环境

## 开发规范

### 提交规范

使用 Commitlint 规范提交信息：

```bash
# 类型
feat:     新功能
fix:      修复bug
docs:     文档变更
style:    代码格式调整
refactor: 重构
perf:     性能优化
test:     测试相关
chore:    构建/工具相关
```

### 代码规范

- ESLint 检查 JavaScript/TypeScript 代码
- Prettier 格式化代码
- Stylelint 检查 SCSS/CSS 样式
- Husky + lint-staged 在提交前自动检查

## 浏览器支持

- IE >= 10
- iOS >= 9
- 现代浏览器

## License

MIT
