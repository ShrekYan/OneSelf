# 博客 H5 应用

基于 React 19 + TypeScript + Vite 构建的现代化移动端博客应用，采用 MobX 状态管理，集成 Ant Design Mobile 组件库，遵循严格的工程化开发规范。

## 🚀 技术栈

| 技术 | 版本 | 说明 |
|------|------|------|
| React | 19.2.3 | UI 框架 |
| TypeScript | 5.5.3 | 类型系统 |
| Vite | 7.3.1 | 构建工具 |
| MobX | 6.13.5 | 状态管理 |
| Ant Design Mobile | 5.42.3 | 移动端组件库 |
| React Router DOM | 6.27.0 | 路由管理 |
| Axios | 1.7.7 | HTTP 客户端 |
| SCSS | - | 样式预处理 |
| PostCSS | - | CSS 后处理 |
| Zod | 3.24.2 | 数据校验 |
| dayjs | 1.11.13 | 日期处理 |
| ESLint | 9.11.1 | 代码检查 |
| Prettier | 3.3.3 | 代码格式化 |
| Husky + lint-staged | - | Git 钩子工具 |

## ✨ 功能特性

- ⚡️ **极速开发体验**：基于 Vite 构建，热更新秒级启动
- 📱 **移动端优先**：专为 H5 移动端设计，`px` 自动转换 `vw` 适配不同屏幕
- 🎨 **现代化 UI**：集成 Ant Design Mobile，优雅的交互体验
- 🔒 **类型安全**：全程 TypeScript 开发，严格模式保障代码质量
- 🌍 **多环境支持**：内置开发/外测/测试/SIT/预发/生产六套环境配置
- 🧹 **代码质量**：ESLint + Prettier + Stylelint 三位一体保证代码规范
- 📦 **模块化架构**：清晰的目录分层，按业务领域拆分模块
- 🎯 **工程化流程**：Husky 提交前自动检查，Commitlint 规范提交信息
- 🚀 **性能优化**：路由懒加载、请求缓存、重复请求自动取消、Gzip 压缩
- 🔄 **状态管理**：MobX 响应式状态管理，页面局部状态使用 `useLocalObservable`

## 📁 项目结构

```
src/
├── api/                    # API 接口层（按业务领域拆分）
│   ├── [module]/          # 业务模块：定义接口函数 + 类型
│   ├── index.ts           # 统一出口，导出所有模块 API
│   ├── axios-instance.ts  # Axios 实例配置 + 拦截器
│   ├── request-cache.ts   # 轻量级请求缓存
│   └── cancel-manager.ts  # 重复请求取消管理
├── assets/                 # 静态资源
│   ├── images/            # 业务图片（kebab-case 命名）
│   └── icons/             # SVG 图标（*-icon.svg 命名）
├── components/            # 全局公共组件
│   └── [Component]/       # 每个组件独立目录：index.tsx + index.module.scss
├── hooks/                 # 自定义 Hooks（一个 Hook 一个文件：useXXX.ts）
├── pages/                 # 页面组件（路由对应页面）
│   └── [Page]/            # 页面目录
│       ├── index.tsx      # 页面入口（只做渲染和组合）
│       ├── useStore.ts    # 页面局部状态（MobX useLocalObservable）
│       ├── constant.ts    # 页面常量定义
│       ├── handle.ts      # 页面事件处理 / 纯业务逻辑
│       ├── components/    # 页面内部分拆的子组件
│       └── index.module.scss # 页面样式
├── routes/                # 路由配置
├── store/                 # 全局 Store
├── styles/                # 全局样式 + 变量 + mixins
├── types/                 # 全局类型定义
│   ├── index.ts           # 通用类型导出
│   └── [domain].ts        # 按领域定义业务实体类型
├── App.tsx                # 应用根组件
└── main.tsx               # 应用入口
```

> 详细的开发规范请参考 [CLAUDE.md](./CLAUDE.md)

## 🚀 快速开始

### 环境要求

- Node.js >= 18
- npm >= 9

### 安装依赖

```bash
npm install
```

### 开发启动

```bash
# 外测环境（默认开发）
npm run dev

# 测试环境
npm run test-dev

# 专项测试环境
npm run fofTest-dev

# SIT 环境
npm run sit-dev

# 预生产环境
npm run pre-dev

# 生产环境
npm run prd-dev
```

### 构建打包

```bash
# 生产环境构建
npm run build

# 其他环境构建
npm run dev-build     # 外测环境
npm run fofTest-build # 专项测试环境
npm run sit-build     # SIT 环境
npm run pre-build     # 预生产环境
```

### 代码检查

```bash
# ESLint 代码检查
npm run lint

# TypeScript 类型检查
npx tsc --noEmit

# 预览构建产物
npm run preview
```

### 测试

```bash
# 进入测试交互模式
npm run test

# 单次运行所有测试
npm run test:run

# 生成测试覆盖率
npm run test:coverage
```

## 🔧 环境配置

项目支持多环境配置，通过 `.env.*` 文件管理：

| 文件 | 环境 | 启动命令 |
|------|------|----------|
| `.env` | 基础配置 | - |
| `.env.development` | 本地开发 | `npm run dev` |
| `.env.outDev` | 外测环境 | `npm run dev-build` |
| `.env.test` | 测试环境 | `npm run test-dev` |
| `.env.fofTest` | 专项测试 | `npm run fofTest-dev` |
| `.env.sit` | SIT 集成测试 | `npm run sit-dev` |
| `.env.pre` | 预生产环境 | `npm run pre-dev` |
| `.env.production` | 生产环境 | `npm run prd-dev` / `npm run build` |

**环境变量说明**：
- `VITE_APP_BASE_URL`: API 接口基础地址
- `VITE_APP_ENV`: 环境名称
- `VITE_ENABLE_VCONSOLE`: 是否开启 vconsole 调试

## 📖 开发规范

项目遵循严格的开发规范，确保代码可维护性和团队协作效率：

### 目录命名规范

| 目录 | 命名规则 | 示例 |
|------|----------|------|
| `api/[module]` | 小写，短横线分隔 | `user`, `article` |
| `components/[Component]` | PascalCase | `LazyImage`, `ArticleCard` |
| `pages/[Page]` | PascalCase | `Home`, `ArticleDetail` |
| `hooks/useXXX` | camelCase，以 `use` 开头 | `useLocalStorage`, `usePagination` |

### 样式规范

- 仅使用 `*.module.scss` CSS Modules
- class 选择器必须使用 camelCase
- 根容器命名：`{componentName}Container`（页面根容器为 `{pageName}Container`）
- 基于 750px 设计稿，直接写 `px`，插件自动转换为 `vw`
- 点击区域 ≥ 44px × 44px，适配移动端触摸操作

详细规范：[.claude/rules/css-scss.md](./.claude/rules/css-scss.md)

### API 设计规范

- 按业务领域拆分模块，统一从 `@/api` 导入
- 必须定义完整的 Request/Response TypeScript 类型
- 支持请求缓存、自动取消重复请求、错误自动重试
- 默认全局 Toast 错误提示，可通过 `skipErrorToast: true` 关闭

详细规范：[.claude/rules/api-design.md](./.claude/rules/api-design.md)

### TypeScript 规范

- 开启严格模式，严禁滥用 `any`
- 优先使用联合类型代替 `enum`
- 必须为所有函数参数和返回值添加显式类型
- 使用 `export type` 导出类型，便于 tree-shaking

详细规范：[.claude/rules/typescript.md](./.claude/rules/typescript.md)

### 逻辑拆分规范 (`handle.ts` vs `useStore.ts` vs `hooks/`)

| 文件 | 职责 | 允许副作用 | 允许 React Hook |
|------|------|------------|----------------|
| `index.tsx` | UI 渲染、组件组合 | ❌ | ✅ |
| `useStore.ts` | MobX 响应式状态 + 修改状态的动作 | ✅ | ✅ |
| `handle.ts` | 纯函数、数据处理、事件处理 | ❌ | ❌ |
| `hooks/useXxx.ts` | 需要依赖 Hook 的业务逻辑 | ✅ | ✅ |
| `constant.ts` | 静态常量配置 | ❌ | ❌ |

详细规范：[.claude/rules/handle-ts.md](./.claude/rules/handle-ts.md)

## 📝 提交规范

使用 [Conventional Commits](https://www.conventionalcommits.org/zh-hans/) 规范：

```
<type>: <description>

<body>

<footer>
```

**类型**：
- `feat`: 新功能
- `fix`: 修复 Bug
- `docs`: 文档变更
- `style`: 代码格式调整（不影响代码运行）
- `refactor`: 重构（既不新增功能，也不修复 Bug）
- `perf`: 性能优化
- `test`: 测试相关
- `chore`: 构建/工具相关

示例：
```
feat(discover): 添加个人主页统计数字滚动动画

- 引入 react-countup 实现滚动动画
- 当元素进入视口时触发动画
```

## 🌐 浏览器支持

- `ie >= 10`
- `ios >= 9`
- `> 0.3%` 的现代浏览器

## 🧪 性能优化

- `postcss-px-to-viewport`: px 自动转 vw，移动端自适应
- 路由懒加载：按需加载页面代码
- 请求缓存：减少重复请求，提升响应速度
- 自动取消重复请求：避免网络拥塞
- Gzip/Brotli 压缩：减小打包体积
- `react-freeze` + `react-activation`: 冻结不活跃页面，减少重渲染
- React Compiler：自动编译优化，减少不必要重渲染

## 📄 License

MIT
