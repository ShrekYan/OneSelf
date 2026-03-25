# 项目结构分析文档

## 项目概览

这是一个基于 **Vite 7.3.1** + **React 19.2.3** + **TypeScript 5.5.3** 的H5移动端前端项目。

**核心技术栈：**
- 组件库：Ant Design Mobile 5.42.3
- 状态管理：MobX 6.13.5 + MobX React 9.1.1
- 路由：React Router DOM 6.27.0
- 样式：SCSS 1.79.6 + CSS Modules
- 表单：React Hook Form 7.54.2
- HTTP：Axios 1.7.7
- 图表：ECharts 5.6.0

**工程化：**
- 代码规范：ESLint + Prettier + Stylelint
- Git钩子：Husky + lint-staged + commitlint
- 自适应：postcss-px-to-viewport-8-plugin (px → vw)
- 优化：React Compiler、gzip压缩、vConsole调试

---

## 目录结构

```
├── .claude/                 # Claude Code 配置与开发规则
│   ├── agents/              # 自定义 Agent 定义
│   ├── skills/              # Skill 规则
│   └── rules/               # 开发规范文档
├── .husky/                  # Git Hooks 配置
├── src/                     # 主源码目录
│   ├── api/                 # API 接口层
│   │   ├── product/         # 业务模块示例 - 商品
│   │   ├── api-utils.ts     # API 工具函数
│   │   ├── axios-instance.ts# Axios 实例配置
│   │   ├── cancel-manager.ts# 请求取消管理器
│   │   ├── request-cache.ts # 请求缓存工具
│   │   ├── types.ts         # API 通用类型定义
│   │   ├── index.ts         # API 统一出口
│   │   └── index.tsx        # axios 实例导出
│   ├── assets/              # 静态资源（图片、字体等）
│   ├── components/          # 公共可复用组件
│   │   ├── Button/          # 自定义按钮
│   │   ├── CountDown/       # 倒计时组件
│   │   ├── ErrorFallback/   # 错误降级组件
│   │   └── Loading/         # 加载状态组件
│   ├── hooks/               # 自定义 Hooks
│   │   ├── useLocalStorage.ts
│   │   └── useRequest.ts
│   ├── pages/               # 页面组件（按业务划分）
│   │   ├── About/           # 关于页面
│   │   ├── Discover/        # 发现模块
│   │   │   └── routes/      # Discover 子路由
│   │   ├── ForgotPassword/  # 忘记密码
│   │   ├── Home/            # 首页
│   │   ├── Login/           # H5登录
│   │   ├── NotFound/        # 404页面
│   │   ├── PCLogin/         # PC端登录
│   │   ├── Product/          # 商品详情
│   │   └── Register/        # 注册页面
│   ├── routes/              # 路由配置
│   │   └── index.tsx
│   ├── store/               # MobX 状态管理
│   │   ├── AppStore.ts      # 全局状态
│   │   └── index.ts         # Store 导出
│   ├── styles/              # 全局样式
│   │   ├── global.scss      # 全局样式
│   │   ├── reset.scss       # 样式重置
│   │   └── variables.scss   # SCSS 全局变量
│   ├── types/               # TypeScript 类型定义
│   │   ├── requests/        # 请求类型
│   │   ├── responses/       # 响应类型
│   │   ├── index.ts
│   │   └── product.ts       # 商品相关类型
│   ├── App.tsx              # 根组件
│   └── main.tsx             # 应用入口
├── public/                  # 静态公共资源
├── backend/                 # 后端相关代码
├── docs/                    # 项目文档
├── dist/                    # 构建输出目录
├── memory/                  # Claude 自动内存
├── .env*                    # 多环境配置文件
│   ├── .env.development     # 开发环境
│   ├── .env.outDev          # 外测环境（默认）
│   ├── .env.test            # 测试环境
│   ├── .env.fofTest         # 专项测试
│   ├── .env.sit             # SIT 环境
│   ├── .env.pre             # 预生产
│   └── .env.production      # 生产
├── package.json             # 依赖配置
├── vite.config.ts           # Vite 配置
├── tsconfig.json            # TypeScript 配置
├── postcss.config.js        # PostCSS 配置
├── eslint.config.js         # ESLint 配置
├── prettier.config.js       # Prettier 配置
├── stylelint.config.cjs     # Stylelint 配置
├── commitlint.config.js     # Commitlint 配置
├── index.html               # HTML 入口模板
└── README.md                # 项目说明
```

---

## 模块职责说明

### 1. API 层 (`src/api/`)

遵循**领域驱动**的API设计规范：

**核心特性：**
- ✅ 智能 Token 注入：拦截器自动从 Storage 获取并注入
- ✅ 全局异常捕获：默认 Toast 提示，支持静默模式
- ✅ 幂等性保障：自动取消重复并发请求
- ✅ 缓存加速：支持 GET 请求客户端缓存
- ✅ 失败自愈：超时错误自动重试

**文件职责：**
- `axios-instance.ts`：封装 Axios 实例，配置拦截器
- `types.ts`：定义 `ApiResponse<T>` 标准返回结构
- `cancel-manager.ts`：请求取消控制器
- `request-cache.ts`：轻量级请求缓存
- `[module]/index.ts`：业务模块 API 定义

**使用示例：**
```typescript
import { api } from '@/api/index.tsx'

// 获取商品列表
const getList = async (params: ProductListParams): Promise<ProductListResponse> => {
  return await api.get('/api/v1/product/list', { params, cache: true })
}
```

### 2. 组件库 (`src/components/`)

通用可复用组件：

| 组件 | 说明 |
|------|------|
| `Button` | 自定义按钮组件，封装统一样式 |
| `CountDown` | 倒计时组件 |
| `ErrorFallback` | 错误边界降级显示组件 |
| `Loading` | 加载状态占位组件 |

### 3. 自定义 Hooks (`src/hooks/`)

| Hook | 功能 |
|------|------|
| `useLocalStorage` | 持久化本地存储 State |
| `useRequest` | 请求封装 Hook，支持加载状态 |

### 4. 页面 (`src/pages/`)

按业务领域划分页面，每个页面包含：
- `index.tsx`：页面组件
- `useStore.ts`：页面级 MobX Store（可选）
- `index.module.scss`：CSS Modules 样式

**现有页面：**
- 认证：`Login/`、`PCLogin/`、`Register/`、`ForgotPassword/`
- 主业务：`Home/`、`Discover/`、`Product/`、`About/`
- 异常：`NotFound/`

### 5. 路由 (`src/routes/index.tsx`)

使用 React Router DOM v6，采用**懒加载**方式导入所有页面组件，减少首屏包体积。

### 6. 状态管理 (`src/store/`)

采用**全局 + 页面级**的状态管理架构：
- `AppStore.ts`：全局状态（用户信息、Token、加载状态）
- 每个页面维护自身的 `useStore.ts` 状态
- 使用 MobX `makeAutoObservable` 自动配置

### 7. 样式系统

- **全局样式**：`src/styles/` 目录
- **组件样式**：每个组件使用 `*.module.scss` + CSS Modules
- **单位转换**：px 自动转换为 vw，基于 750px 设计稿
- **变量**：主题色、间距等定义在 `variables.scss`

---

## 可用脚本

| 命令 | 说明 |
|------|------|
| `npm run dev` | 启动开发服务器（外测环境） |
| `npm run test-dev` | 测试环境开发 |
| `npm run sit-dev` | SIT 环境开发 |
| `npm run pre-dev` | 预生产环境开发 |
| `npm run prd-dev` | 生产环境开发 |
| `npm run build` | TypeScript 检查 + 生产构建 |
| `npm run dev-build` | 外测环境构建 |
| `npm run lint` | 运行 lint-staged 代码检查 |
| `npm run preview` | 预览构建产物 |

---

## 开发规范

### 导入路径
使用路径别名 `@/`，不使用相对路径 `../../`：
```scss
✅ 正确：@/components/Button
❌ 错误：../../components/Button
```

### 类型安全
- 开启 `strict: true` 严格模式
- 禁止滥用 `any`，使用 `unknown` 代替
- 所有异步函数必须显式声明返回类型 `Promise<T>`

### 命名规范

| 语法 | 命名方式 | 示例 |
|------|----------|------|
| 组件 | PascalCase | `ProductList.tsx` |
| 工具函数 | camelCase | `formatTime.ts` |
| 样式文件 | kebab-case | `index.module.scss` |
| 接口 | PascalCase | `interface Product {}` |

### Git 提交
遵循 **Conventional Commits** 规范：
```
<type>: <description>

type: feat | fix | docs | refactor | test | chore
```

---

## 环境配置

项目支持多环境配置，通过 `.env.[env]` 文件管理：

| 环境 | 配置文件 | 启动命令 |
|------|----------|----------|
| 开发 | `.env.development` | `npm run dev` |
| 外测 | `.env.outDev` | `npm run dev` (默认) |
| 测试 | `.env.test` | `npm run test-dev` |
| 专项测试 | `.env.fofTest` | `npm run fofTest-dev` |
| SIT | `.env.sit` | `npm run sit-dev` |
| 预生产 | `.env.pre` | `npm run pre-dev` |
| 生产 | `.env.production` | `npm run prd-dev` |

---

## 浏览器兼容

```
browserslist: [
  "ie >= 10",
  ">0.3%",
  "ios >= 9"
]
```

---

## 架构特点

1. **清晰的分层架构**：API → Store → Page → Component，职责分离
2. **工程化完善**：完整的代码规范检查和Git钩子
3. **移动端优先**：px 自动转 vw，适配不同屏幕
4. **性能优化**：路由懒加载、代码分包、React Compiler 自动优化
5. **类型安全**：全链路 TypeScript 支持，严格模式开启

---

*生成时间：2026-03-25*
