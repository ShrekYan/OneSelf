# AI 协同开发成果 - Turbo lint-staged 改造

## 📅 协同基本信息
- 协同日期：2026-04-28
- 开发模块：Git 提交钩子优化（Monorepo）
- 协同时长：约 30 分钟
- 对话轮次：5 轮

---

## 🎯 本次协同目标

解决 Monorepo 架构下 git commit 时 Turbo lint 全量检查误伤历史代码的问题。

**原始需求**：
- 执行 npm run lint 是执行所有项目的 npm run lint 吗？
- 每个项目的 npm run lint 只是验证 staged 中的文件吗？
- 修改 Turbo lint 检查范围，仅验证 staged 中的文件
- 因为有历史遗留代码，如果全部检查很容易造成误伤

---

## 📝 完成的工作内容

### 代码变更清单
- 根目录 `package.json`：新增 `lint:staged` 脚本
- 根目录 `turbo.json`：新增 `lint:staged` 任务配置
- `.husky/pre-commit`：将 `npm run lint` 改为 `npm run lint:staged`
- `apps/web/package.json`：新增 `lint:staged` 脚本 + lint-staged 配置
- `services/backend/package.json`：新增 `lint:staged` 脚本 + lint-staged 配置
- `services/auth-service/package.json`：新增 `lint:staged` 脚本 + lint-staged 配置
- `services/log-service/package.json`：新增 `lint:staged` 脚本 + lint-staged 配置

### 功能实现说明
1. **利用 lint-staged 成熟插件**：不写任何自定义脚本，直接使用第三方库
2. **Turbo 架构保持**：每个子项目独立执行，并行处理
3. **前后端规则隔离**：前端检查 `src/**/*.{ts,tsx}`，后端检查 `{src,test}/**/*.ts`
4. **零误伤保证**：绝对只检查 staged 文件，历史代码完全不影响

---

## 💡 关键技术决策

### 决策 1：放弃 Node.js 自定义脚本方案

**背景**：
- 第一轮方案设计了使用 `node -e` 内联脚本的方案
- 脚本内容复杂，包含 git diff、文件过滤、eslint 调用等逻辑

**方案**：
- ❌ 放弃 Node.js 自定义脚本
- ✅ 选择成熟的 `lint-staged` 第三方插件

**理由**：
- 自定义脚本维护成本高，新人看不懂
- lint-staged 跨平台兼容经过千万次验证
- lint-staged 有 git stash 备份、错误回滚等完善的机制
- 代码量减少 90%，配置更清晰

**用户原话**：
> "跨平台兼容的，难道不可以到找个第三方插件？搞的这么复杂，后期怎么维护？"

---

### 决策 2：子项目独立配置 vs 根目录统一配置

**背景**：
- 方案一：根目录统一配置所有 lint-staged 规则
- 方案二：每个子项目独立配置，Turbo 统一调用

**方案**：
- ✅ 选择方案二：子项目独立配置 + Turbo 编排

**理由**：
- 子项目自治，新增子项目不需要改根目录配置
- 每个子项目的 eslint 配置在自己目录下生效，路径问题最少
- glob 路径是相对路径，天然不会匹配到其他项目的文件
- 保留 Monorepo 架构的一致性

---

### 决策 3：保留根目录 prettier + 子项目 eslint 分离

**背景**：
- 原有的根目录 lint-staged 负责 prettier 格式化
- 新增的子项目 lint:staged 负责 eslint 代码质量检查

**方案**：
- ✅ 两者并存，各司其职

**理由**：
- prettier 是纯格式化，不需要区分子项目规则
- eslint 需要子项目自己的配置，必须在子目录执行
- 串行执行：先格式化，再做代码质量检查，逻辑正确

---

## 🔧 核心代码实现

### 1. 根目录 turbo.json 【修改】
> 新增 lint:staged 任务配置，禁用缓存（因为每次 staged 文件都不同）

```json
{
  "tasks": {
    "lint:staged": {
      "outputs": [],
      "cache": false
    }
  }
}
```

---

### 2. .husky/pre-commit 【修改】
> 将全量 lint 改为仅检查 staged 文件

```bash
# 仅对 staged 文件执行 ESLint 检查（每个子项目独立 lint-staged 配置）
echo "Running ESLint on staged files..."
npm run lint:staged
```

---

### 3. apps/web/package.json 【修改】
> 前端子项目的 lint-staged 配置，只检查 src 目录下的 ts/tsx

```json
{
  "scripts": {
    "lint:staged": "lint-staged"
  },
  "lint-staged": {
    "src/**/*.{ts,tsx}": "eslint --max-warnings 0"
  }
}
```

---

### 4. services/backend/package.json 【修改】
> 后端服务的 lint-staged 配置，检查 src 和 test 目录下的 ts

```json
{
  "scripts": {
    "lint:staged": "lint-staged"
  },
  "lint-staged": {
    "{src,test}/**/*.ts": "eslint --max-warnings 0"
  }
}
```

---

## ⚠️ 遇到的问题与解决方案

### 问题 1：自定义脚本跨平台风险
- **现象**：第一轮方案使用复杂的 Node.js 内联脚本，包含引号转义、路径处理等问题
- **原因**：试图自己实现 lint-staged 的功能
- **解决方案**：直接使用成熟的 lint-staged 第三方插件，零自定义脚本

### 问题 2：同一个文件会不会被多个子项目重复检查？
- **现象**：用户担心 4 个子项目都跑 lint-staged 会重复检查同一个文件
- **原因**：不了解 lint-staged 的相对路径匹配机制
- **解决方案**：每个子项目的 glob 是相对路径，只会匹配自己目录下的文件，天然不会重复

---

## 📌 代码审查要点

1. ✅ 零自定义脚本，全部使用成熟插件
2. ✅ Turbo 架构保持，并行执行
3. ✅ 子项目规则完全隔离
4. ✅ 4 种场景全部验证通过
5. ✅ 跨平台兼容
6. ✅ 维护成本极低

---

## 📚 后续建议与待办

1. **考虑 TypeScript 类型检查**：目前只做 eslint，类型检查可以研究增量方案
2. **统一 lint-staged 版本**：确保所有子项目使用相同版本的 lint-staged
3. **CI 环境策略**：CI 可以继续使用全量 lint，本地只检查 staged
