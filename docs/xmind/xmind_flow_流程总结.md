# XMind 极简执行流 v1.0 — 流程总结

> 源文件：`.claude/scripts/xmind_flow.py`
> 设计目标：最精简、最强悍的 XMind 任务执行流
> 核心思想：**零状态机**，`input()` 阻塞推进，全程持锁保证并发安全。

---

## 一、整体架构

| 维度           | 设计                                          |
| -------------- | --------------------------------------------- |
| **流程模型**   | 线性 5 步，无状态机，`input()` 阻塞推进       |
| **并发安全**   | 目录锁机制（10 min TTL），最多重试 10 次      |
| **持久化**     | 仅 1 个 `task-manifest.json`，方案文本不落盘  |
| **追溯审计**   | `execution-log.jsonl` 脚本兜底回写            |
| **Agent 通信** | `<<<INVOKE_AGENT:name>>>` 信令交给外层 Claude |

---

## 二、5 步核心流程

```
[1] 解析 XMind  ──→ [2] 弹出看板  ──→ [3] 选中任务  ──→ [4] 输出方案  ──→ [5] 执行代码
     (Python)           (Python)          (Python)         (Agent)          (Agent)
```

### Step 1：解析 XMind

- **复用机制**：扫描 `.claude/runs/**/task-manifest.json`，若已有同源（`source_xmind` 相同）manifest，直接复用，跳过解析。
- **首次解析**：调用 `xmind_parser.py`，生成 `task-manifest.json`（含任务列表、模块、风险、依赖等）。
- **产出**：`run_dir`（运行目录）+ `tasks`（任务数组）。

### Step 2：弹出看板

- 读取 `execution-log.jsonl`，标记已完成的任务为 ✅，未完成的为 ⬜。
- 终端展示任务列表：
  - `task_id`
  - 模块 `module`
  - 目标 `goal`（截断 50 字符）
  - 风险等级 `risk_level`

```
📊 XMind 任务看板（共 N 个任务）
  ⬜ T001  [模块名] [高]  任务目标描述...
  ✅ T002  [模块名] [中]  任务目标描述...
```

### Step 3：选中任务

- 用户输入 `task_id`。
- 校验任务存在性，提取并展示上下文：
  - 目标 `goal`
  - 模块 `module`
  - 风险 `risk_level`
  - 依赖 `dependencies`

### Step 4：输出方案

- **信令触发**：打印 `<<<INVOKE_AGENT:task-scheme-generator>>>`，外层 Claude 接管生成方案。
- **方案要求**（硬编码在脚本中）：
  1. 受影响文件清单
  2. 完整代码
  3. 风险点
  4. 回滚方案
- **不落盘**：方案只在终端显示，不写文件。
- **用户确认**：输入 `yes` / `no` 决定是否执行（`--yes` 模式自动跳过）。

### Step 5：执行代码

- **信令触发**：打印 `<<<INVOKE_AGENT:task-executor>>>`，外层 Claude 接管执行代码修改。
- **脚本兜底**：Agent 执行完成后，Python 脚本回写一行到 `execution-log.jsonl`，包含：
  - `task_id`、`time`、`goal`、`module`
  - `status: completed`
  - 各阶段耗时（`parse_ms`、`scheme_ms`、`execute_ms`、`total_ms`）

---

## 三、两种执行模式

| 模式         | 触发命令                                        | 流程差异                                                       |
| ------------ | ----------------------------------------------- | -------------------------------------------------------------- |
| **完整模式** | `python xmind_flow.py file.md`                  | 解析 → 看板 → 循环（选任务 → 出方案 → 执行）→ 输入 `exit` 退出 |
| **快速模式** | `python xmind_flow.py file.md --task <task_id>` | 跳过解析和看板，直接复用已有 manifest 执行任务                 |

### 命令行参数

| 参数               | 说明                            |
| ------------------ | ------------------------------- |
| `file`             | XMind Markdown 文件路径（必填） |
| `--task <task_id>` | 直接指定任务 ID，跳过解析和看板 |
| `--yes`            | 自动确认方案并执行，无需交互    |

---

## 四、关键设计亮点

### 1. 信令机制

Python 脚本与外层 Claude 的通信协议：

```text
<<<INVOKE_AGENT:task-scheme-generator>>>
{ "task_id": "T001", "goal": "...", ... }
<<<END_INVOKE>>>
```

- 脚本只负责**打印信令 + 任务 JSON**。
- 外层 Claude 捕获信令后，调用对应 Agent 完成任务，再返回脚本继续执行。

### 2. 零状态机

- 没有复杂的状态流转图。
- 全程靠 `input()` 阻塞等待用户输入，流程自然推进。
- `while True` 循环在看板界面，直到用户输入 `exit` 才退出。

### 3. 并发安全（目录锁）

```python
lock_file = RUNS_DIR / f".lock.{hashlib.md5(key.encode()).hexdigest()}"
lock_file.mkdir()   # 原子操作，成功即获得锁
```

- 锁目录的 `mkdir()` 是**原子操作**。
- TTL 10 分钟：若锁过期，自动清理，防止死锁。
- 最多重试 10 次，间隔递增等待。

### 4. 复用机制

- 解析结果长期保存在 `.claude/runs/<name>-run-<时间戳>/task-manifest.json` 中。
- 同源文件再次执行时，直接读取已有 manifest，**秒级复用**。
- `source_xmind` 字段记录绝对路径，作为复用的匹配键。

### 5. 计时器

内置 `StepTimer` 类，记录各阶段耗时：

- `parse_ms`：解析耗时
- `scheme_ms`：方案确认耗时
- `execute_ms`：Agent 执行耗时
- `total_ms`：总耗时

最终全部写入 `execution-log.jsonl`。

---

## 五、文件产出

| 文件                  | 路径                                | 用途                        |
| --------------------- | ----------------------------------- | --------------------------- |
| `task-manifest.json`  | `.claude/runs/<name>-run-<时间戳>/` | 任务清单，持久化复用        |
| `execution-log.jsonl` | 同上                                | 执行审计日志，每行一个 JSON |
| `.lock.<hash>`        | `.claude/runs/`                     | 目录锁，保证并发安全        |

---

## 六、代码结构速查

```
xmind_flow.py
├── StepTimer            # 步骤计时器
├── acquire_lock()       # 获取目录锁（10min TTL）
├── release_lock()       # 释放目录锁
├── step1_parse()        # 解析 XMind（含复用逻辑）
├── find_task_by_id()    # 反向查找已有任务
├── step2_dashboard()    # 展示任务看板
├── step3_select()       # 校验并选中任务
├── step4_scheme()       # 输出方案（Agent 信令）
├── step5_execute()      # 执行任务（Agent 信令 + 日志回写）
└── main()               # 主流程：完整模式 / 快速模式
```

---

## 七、学习要点

1. **原子锁**：用 `mkdir()` 做锁，比文件锁更可靠（无竞争写问题）。
2. **信令模式**：脚本不直接调用 Agent，而是通过标准输出信令，由外层编排器接管。
3. **极简持久化**：只保留 `manifest`（输入）和 `log`（输出），中间过程全部在内存/终端完成。
4. **复用优于重算**：解析一次，多次执行，避免重复消耗资源。
5. **人机协作**：`input()` 做交互确认，`--yes` 做自动化开关，兼顾灵活性和批量能力。
