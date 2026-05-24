# XMind 跨任务协作机制架构设计文档

## 📄 文档说明

本文档完整记录从个人单机版到企业团队版的三阶段演进路线图，作为后续执行的蓝图。

| 项目         | 内容                            |
| ------------ | ------------------------------- |
| **文档版本** | 1.0                             |
| **创建日期** | 2026-05-10                      |
| **维护者**   | Claude Code                     |
| **适用范围** | 个人多窗口开发 → 企业级团队协作 |

---

## 🎯 核心设计理念

| 原则             | 说明                                                         |
| ---------------- | ------------------------------------------------------------ |
| **渐进式演进**   | 从个人版 → 小团队版 → 企业版，每一步都能用，每一步都平滑升级 |
| **预留扩展点**   | 接口抽象，底层实现可替换，不破坏上层逻辑                     |
| **最小可用优先** | 每个阶段都聚焦核心价值，不做过度设计                         |

---

## 🚀 三阶段演进路线图

### 阶段 1：个人单机版 ✅ 近期实现

**目标场景：** 你一个人开 3-5 个 Claude 窗口并发开发
**核心价值：** 防错、提效、不踩坑

| 功能模块                 | 详细设计                                                                      | 实现难度  | 优先级 |
| ------------------------ | ----------------------------------------------------------------------------- | --------- | ------ |
| **启动时依赖检查**       | 读取 `explicit_dependencies`，扫描本地 runs 目录<br>依赖未完成 → 友好拦截提示 | ⭐ 简单   | P0     |
| **依赖链可视化**         | 自动检测任务间依赖，画出 DAG 图<br>明确给出执行顺序建议：可并发 / 需串行      | ⭐ 简单   | P0     |
| **本地产物自动加载**     | 读取前置任务的 `output-manifest.json`<br>自动导入类型、函数定义               | ⭐⭐ 中等 | P1     |
| **本地文件冲突检测**     | 扫描所有任务的 `result.md`<br>相同文件被多任务修改 → 预警                     | ⭐ 简单   | P1     |
| **output-manifest 标准** | 任务完成时自动生成标准格式产物<br>包含：修改文件、导出符号、状态              | ⭐ 简单   | P0     |

**验收标准：**

- ✅ 故意先开任务2 → 系统正确拦截，提示依赖任务1未完成
- ✅ 看板一眼看出执行顺序：可并发 / 需串行 1→2→3
- ✅ 任务2启动时 → 自动加载任务1的类型定义，不需要重复写

---

### 阶段 2：小团队版 🔄 中期实现（2-5 人）

**目标场景：** 小团队共享同一个 Git 仓库，都用 Claude 开发
**核心价值：** 防冲突、透明化、减少沟通成本

| 功能模块                  | 详细设计                                                                               | 实现难度  | 优先级 |
| ------------------------- | -------------------------------------------------------------------------------------- | --------- | ------ |
| **基于 Git 的全局文件锁** | 锁文件存 `.claude/locks/` 目录，Git 同步<br>30分钟无心跳自动过期<br>抢锁操作留审计日志 | ⭐⭐ 中等 | P0     |
| **团队状态看板**          | 每个人的状态都提交到 Git<br>实时拉取聚合显示<br>显示：谁在做什么、改了什么文件         | ⭐⭐ 中等 | P0     |
| **Git 产物自动发现**      | Git pull 发现新 `output-manifest.json`<br>自动提示："你等待的 xxx 已完成"              | ⭐ 简单   | P1     |
| **跨机器产物自动加载**    | 和本地一样，只是路径来自 Git<br>无缝使用队友输出的产物                                 | ⭐ 简单   | P1     |
| **简单冲突预警**          | 检测到多人计划修改同一文件 → 提前预警<br>建议协商执行顺序                              | ⭐ 简单   | P1     |

**验收标准：**

- ✅ A 开始改文件 → B 再想改 → 立即提示"A 正在编辑"
- ✅ 每个人的看板都能看到全团队实时状态
- ✅ A 完成任务 → B/C/D 自动收到通知：可以继续了

---

### 阶段 3：企业团队版 🔮 远期规划（10+ 人）

**目标场景：** 企业级协同开发平台
**核心价值：** 规模化、可观测、效能分析

| 功能模块              | 详细设计                                     | 依赖基础设施   |
| --------------------- | -------------------------------------------- | -------------- |
| **实时同步服务**      | WebSocket 服务器推送状态<br>不再需要轮询 Git | WebSocket 服务 |
| **用户身份认证**      | 企业账号、权限管理、审计                     | 账号系统       |
| **任务看板 + 甘特图** | 项目管理可视化、进度追踪                     | 前端可视化组件 |
| **实时消息推送**      | 浏览器通知、企业微信/钉钉推送                | 消息队列       |
| **团队效能分析**      | 开发速度、瓶颈分析、优化建议                 | 数据统计面板   |
| **Redis 分布式锁**    | 高性能、高可靠的全局锁                       | Redis 集群     |

---

## 🏗️ 技术架构设计（预留扩展点）

### 1. 依赖检查器 - 抽象接口

```typescript
// 接口定义（保持不变）
interface DependencyChecker {
  checkDependencies(taskId: string): Promise<CheckResult>;
}

// 阶段 1 实现：本地文件
class LocalDependencyChecker implements DependencyChecker {
  // 读 .claude/runs/ 目录
}

// 阶段 2 实现：Git 同步
class GitDependencyChecker implements DependencyChecker {
  // 先 git pull，再读文件
}

// 阶段 3 实现：API 调用
class ApiDependencyChecker implements DependencyChecker {
  // GET /api/dependencies/{taskId}
}
```

### 2. 全局锁 - 抽象接口

```typescript
// 接口定义（保持不变）
interface GlobalLock {
  acquire(file: string, owner: string): Promise<boolean>;
  release(file: string): Promise<void>;
  check(file: string): Promise<LockInfo | null>;
}

// 阶段 1 实现：本地内存锁（其实不需要，只是占位）
class LocalMemoryLock implements GlobalLock {}

// 阶段 2 实现：Git 分布式文件锁
class GitFileLock implements GlobalLock {
  // 读写 .claude/locks/xxx.lock
}

// 阶段 3 实现：Redis 分布式锁
class RedisDistributedLock implements GlobalLock {
  // Redlock 算法
}
```

### 3. 通知器 - 抽象接口

```typescript
// 接口定义（保持不变）
interface Notifier {
  notify(message: NotifyMessage): Promise<void>;
}

// 阶段 1 实现：控制台打印
class ConsoleNotifier implements Notifier {}

// 阶段 2 实现：浏览器通知
class BrowserNotifier implements Notifier {}

// 阶段 3 实现：企业微信/钉钉推送
class WebhookNotifier implements Notifier {}
```

---

## 📁 output-manifest.json 标准格式（V1.0）

```json
{
  "manifest_version": "1.0",
  "run_id": "run-20260510-212059",
  "project_name": "任务1-字符串工具",
  "completed_at": "2026-05-10T21:30:00Z",
  "status": "completed",
  "author": {
    "name": "yanjinqiang",
    "machine_id": "xxx"
  },
  "outputs": {
    "files_modified": [
      {
        "path": "apps/web/src/utils/stringUtils.ts",
        "action": "created",
        "sha256": "xxx"
      }
    ],
    "exports": [
      {
        "file": "apps/web/src/utils/stringUtils.ts",
        "symbols": ["trim", "uppercase", "lowercase"],
        "types": ["StringUtilsOptions"],
        "dependencies": []
      }
    ],
    "tests": {
      "files": ["apps/web/src/utils/stringUtils.test.ts"],
      "coverage": 95,
      "passed": 12,
      "failed": 0
    }
  },
  "quality_gates": [
    {
      "name": "ts-check",
      "passed": true,
      "errors": 0
    }
  ],
  "known_issues": []
}
```

---

## ✅ 各阶段验收标准清单

### 阶段 1 验收（个人版）

- [ ] 依赖检查：任务2启动时正确检测到任务1未完成并拦截
- [ ] 看板显示：依赖链可视化，清晰标注"可并发" / "需串行"
- [ ] 冲突检测：启动时提示相同文件被多任务修改
- [ ] 产物自动加载：任务2自动读取任务1的类型定义
- [ ] 标准产物：每个任务完成自动生成 output-manifest.json

### 阶段 2 验收（小团队版）

- [ ] 全局文件锁：A 锁定文件 → B 尝试修改立即被拦
- [ ] 团队看板：所有人看到相同的实时状态
- [ ] 自动通知：A 完成任务 → B 自动收到可继续通知
- [ ] 跨机器产物加载：无缝使用队友输出的产物

### 阶段 3 验收（企业版）

- [ ] 实时同步：毫秒级状态同步，无需等待 Git pull
- [ ] 权限管理：不同角色不同操作权限
- [ ] 效能分析：团队开发速度、瓶颈可视化
- [ ] 企业集成：对接企业微信/钉钉通知

---

## 📋 实现顺序执行清单

### 第一步：基础标准落地

1. 创建 `output-manifest.json` 生成逻辑
2. 修改 `xmind-exec.yml` 任务完成时自动生成产物

### 第二步：个人版核心功能

1. 实现依赖检查器（本地版）
2. 改造 `xmind-exec.yml` 启动时检查依赖
3. 改造看板，新增依赖链可视化视图
4. 实现本地文件冲突检测

### 第三步：产物自动加载

1. 启动时自动读取前置任务产物
2. 智能提示可用的类型/函数
3. 自动 import 优化

### 第四步：团队版（按需启动）

1. 基于 Git 的文件锁实现
2. 团队状态看板 Git 同步机制
3. Git 产物自动发现与通知

---

## 📝 迁移指南

从个人版升级到团队版，不需要重写任何代码：

1. 团队成员约定：把 `.claude/runs/` 加入 Git 提交
2. 替换依赖检查器实现：`LocalDependencyChecker` → `GitDependencyChecker`
3. 新增文件锁模块：`GitFileLock`
4. 升级看板渲染逻辑，支持多用户

---

## 🔗 相关文件索引

| 文件路径                                  | 说明           | 阶段 |
| ----------------------------------------- | -------------- | ---- |
| `.claude/workflows/xmind-exec.yml`        | 任务执行器     | 1    |
| `.claude/workflows/xmind-multi-stage.yml` | 多任务看板     | 1    |
| `.claude/workflows/xmind-status.yml`      | 状态看板       | 1    |
| `.claude/locks/`                          | 全局文件锁目录 | 2    |
| `.claude/docs/`                           | 文档目录       | -    |

---

_文档版本：1.0_
_最后更新：2026-05-10_
_维护者：Claude Code_
