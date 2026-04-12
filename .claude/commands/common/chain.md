# 调用链预演规范

**触发**: `/chain <任务描述>`
**行为**: 不执行任何操作，只输出调用链规划，用流程图展示层级关系，确认后再执行。

---

## 输出模板

```markdown
## 🔗 调用链预演：「任务名」

### 📋 任务
> 一句话总结

### 📊 流程图

```mermaid
flowchart TD
    U[用户<br/>/chain ...] --> S[/chain<br/>预演]
    S --> W[等待确认]
    W -- 是 --> A[Agent<br/>frontend-developer]
    A --> G[Glob<br/>搜索]
    A --> R[Read<br/>读规范]
    A --> W1[Write<br/>样式]
    A --> W2[Write<br/>组件]
    A --> B[Bash<br/>检查]
    A --> ✅
    W -- 否 --> End[结束]
```

### 📋 步骤

| # | 调用者 | 工具 | 说明 |
|---|--------|------|------|
| 1 | 用户 | `/chain` | 触发预演 |
| ... | ... | ... | ... |

### 📁 文件

| 操作 | 路径 |
|------|------|
| 新建 | `...` |
| 读取 | `...` |

### ❓ 确认执行？
```

---

## 示例

## 🔗 调用链预演：「创建发现页面」

### 📋 任务
> 在 `src/pages/Discover` 创建发现页面，遵循项目规范

### 📊 流程图

```mermaid
flowchart TD
    U[用户<br/>/chain 创建发现页面] --> S[/chain<br/>预演]
    S --> W[等待确认]
    W -- 确认 --> A[Agent<br/>frontend-developer]
    A --> G[Glob<br/>搜索 pages]
    A --> R1[Read<br/>CLAUDE.md]
    A --> R2[Read<br/>开发规范]
    A --> R3[Read<br/>About 参考]
    A --> W1[Write<br/>index.scss]
    A --> W2[Write<br/>index.tsx]
    A --> B1[Bash<br/>lint]
    A --> B2[Bash<br/>tsc]
    A --> ✅
    W -- 取消 --> End[结束]
```

### 📋 步骤

| # | 调用者 | 工具 | 说明 |
|---|--------|------|------|
| 1 | 用户 | `/chain` | 触发预演 |
| 2 | `/chain` | - | 输出本规划 |
| 3 | 用户 | - | 确认执行 |
| 4 | frontend-developer | `Glob` | 搜索现有结构 |
| 5 | frontend-developer | `Read` ×3 | 读规范和参考 |
| 6 | frontend-developer | `Write` ×2 | 创建文件 |
| 7 | frontend-developer | `Bash` ×2 | 检查代码 |

### 📁 文件

| 操作 | 路径 |
|------|------|
| 新建 | `src/pages/Discover/index.tsx` |
| 新建 | `src/pages/Discover/index.module.scss` |
| 读取 | `CLAUDE.md` |
| 读取 | `.../h5-frontend-developer.md` |


## 规则

- **不执行**: `/chain` 只输出规划，绝不碰文件
- **流程图**: Mermaid TD 从上到下，清晰展示嵌套调用
- **精简**: 每个节点 2 行以内，只说关键
- **完整**: 从用户输入到最终检查，一步不缺
- **确认**: 必须等用户确认后才实际执行

---

## MCP 调用示例

### 🔗 调用链预演：「Figma 设计转 React 组件」

### 📋 任务
> 根据提供的 Figma URL，获取设计并生成 React 组件代码

### 📊 流程图

```mermaid
flowchart TD
    U[用户<br/>提供 Figma URL] --> S[/chain<br/>预演]
    S --> W[等待确认]
    W -- 确认 --> M1[mcp__figma<br/>get_design_context]
    M1 --> A[Agent<br/>frontend-developer]
    A --> G[Glob<br/>探查项目结构]
    A --> R[Read<br/>读开发规范]
    A --> D[适配<br/>设计→代码]
    A --> S[Write<br/>创建文件]
    A --> B[Bash<br/>lint + tsc]
    A --> ✅
    W -- 取消 --> End[结束]
```

### 📋 步骤

| # | 调用者 | 工具/MCP | 说明 |
|---|--------|----------|------|
| 1 | 用户 | `/chain` | 触发预演 |
| 2 | `/chain` | - | 输出本规划 |
| 3 | 用户 | - | 确认执行 |
| 4 | MCP | `figma/get_design_context` | 获取设计代码、截图、元数据 |
| 5 | frontend-developer | `Glob` | 探查项目结构 |
| 6 | frontend-developer | `Read` | 读取 CLAUDE 开发规范 |
| 7 | frontend-developer | - | 适配设计到项目栈（React + SCSS + MobX） |
| 8 | frontend-developer | `Write` | 写入组件和样式文件 |
| 9 | frontend-developer | `Bash` | `lint` + `tsc` 检查 |

### 📁 文件

| 操作 | 路径 |
|------|------|
| 读取 | `CLAUDE.md` |
| 读取 | `.claude/skills/*.md` |
| 新建 | `src/components/ComponentName/index.tsx` |
| 新建 | `src/components/ComponentName/index.module.scss` |

---

### 🔗 调用链预演：「查询 Context7 库文档」

### 📋 任务
> 通过 Context7 MCP 查询指定库的最新文档

### 📊 流程图

```mermaid
flowchart TD
    U[用户<br/>查询文档] --> S[/chain<br/>预演]
    S --> W[等待确认]
    W -- 确认 --> M1[mcp__context7<br/>resolve-library-id]
    M1 --> M2[mcp__context7<br/>query-docs]
    M2 --> R[返回文档<br/>+代码示例]
    R --> ✅
    W -- 取消 --> End[结束]
```

### 📋 步骤

| # | 调用者 | 工具/MCP | 说明 |
|---|--------|----------|------|
| 1 | 用户 | `/chain` | 触发预演 |
| 2 | `/chain` | - | 输出本规划 |
| 3 | 用户 | - | 确认执行 |
| 4 | MCP | `context7/resolve-library-id` | 解析库名获取 ID |
| 5 | MCP | `context7/query-docs` | 查询文档获取代码示例 |

---

### 🔗 MCP 调用通用规则

| MCP 服务 | 典型场景 | 流程要点 |
|----------|----------|----------|
| **figma** | 设计转码、获取设计元数据 | 先 `get_design_context`，再根据结果开发 |
| **context7** | 查询库文档、获取示例代码 | 先 `resolve-library-id`，再 `query-docs` |
| **filesystem** | 读取/操作远程文件系统 | 确认路径权限，再执行操作 |
| **pixso** | 设计转码（替代 Figma） | 类似 figma 流程，调用不同端点 |

**通用原则**：
- MCP 调用**必须**放在开发流程**第一步**，先获取设计/文档，再编码
- MCP 返回的参考代码需要适配项目现有规范，不能直接输出
- 保持调用链清晰：`MCP 获取信息 → 阅读项目规范 → 编码 → 检查`
