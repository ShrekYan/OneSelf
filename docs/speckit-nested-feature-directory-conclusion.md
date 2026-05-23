# Spec Kit 多阶段任务与嵌套 Feature 目录结论

## 1. 背景

当前讨论的是“小贝 utils”这类多阶段需求如何使用 Spec Kit 组织。

假设需求包含三个阶段：

```text
001 string-utils
002 number-utils
003 array-utils
```

阶段依赖关系为：

```text
001 → 002 → 003
```

核心问题包括：

1. 三个阶段是否应该拆成独立 feature 分支？
2. 001 完成后进入 002，是否需要先合并到 `main/master`？
3. 如果 001 后续有需求变更，如何同步到 002，是否会导致效率低？
4. 如果每个阶段都是独立 feature，`specs/` 根目录内容会越来越多，是否可以按项目分组？

## 2. 官方 Spec Kit 默认模型

Spec Kit 官方默认更倾向于：

```text
specs/[###-feature-name]/
├── spec.md
├── plan.md
└── tasks.md
```

也就是：

```text
一个 feature = 一个 specs/[feature] 目录
```

一个 feature 内部会有完整的 Spec Kit 工作流产物：

```text
spec.md → plan.md → tasks.md → implement
```

官方也支持在 `tasks.md` 内部做 phase 拆分，例如：

```text
Phase 1: Setup
Phase 2: Foundational tasks
Phase 3+: User Stories
Final Phase: Polish
```

但这类 phase 更适合一个 feature 内部的实现步骤，不适合长期把大量独立能力都塞进一个 feature 的 `stages/` 子目录。

## 3. 平铺方案的问题

如果所有阶段都直接平铺到 `specs/` 根目录，例如：

```text
specs/
├── xiaobei-01-string-utils/
├── xiaobei-02-number-utils/
├── xiaobei-03-array-utils/
├── xiaobei-04-object-utils/
├── xiaobei-05-date-utils/
└── ...
```

长期会出现几个问题：

- `specs/` 根目录越来越臃肿；
- 不同大需求、不同项目的 feature 混在一起；
- 已完成、进行中、废弃的 spec 不易区分；
- Agent 或人工检索时容易读到过多无关上下文；
- 缺少一个项目级总览来管理阶段依赖和状态。

因此，平铺结构适合少量 feature，但不适合长期演进型项目。

## 4. 当前项目 Speckit 扩展能力

虽然官方默认模型是 `specs/[feature]/` 平铺，但当前项目的 Speckit 扩展支持显式指定 feature 目录。

关键依据来自当前项目脚本和技能说明：

### 4.1 `SPECIFY_FEATURE_DIRECTORY`

`.claude/skills/speckit-specify/SKILL.md` 中说明：

```text
Specs live under the default specs/ directory unless the user explicitly provides SPECIFY_FEATURE_DIRECTORY.
```

也就是说，如果显式提供：

```text
SPECIFY_FEATURE_DIRECTORY=specs/xiaobei-utils/01-string-utils
```

则可以使用该路径作为当前 feature 目录。

### 4.2 `.specify/feature.json`

当前项目通过 `.specify/feature.json` 记录当前 feature 目录，例如：

```json
{
  "feature_directory": "specs/xiaobei-utils/01-string-utils"
}
```

下游命令会读取这个路径，用来定位：

```text
spec.md
plan.md
tasks.md
research.md
data-model.md
quickstart.md
contracts/
```

### 4.3 `get_feature_paths()` 解析优先级

`.specify/scripts/bash/common.sh` 中的 `get_feature_paths()` 解析优先级为：

```text
1. SPECIFY_FEATURE_DIRECTORY 环境变量
2. .specify/feature.json 中的 feature_directory
3. 根据当前 Git 分支名回退查找 specs/ 下的目录
```

因此，只要 `.specify/feature.json` 指向嵌套路径，下游命令就可以围绕该目录工作。

## 5. 推荐目录架构

对于“小贝 utils”这类长期演进型需求，推荐采用：

```text
specs/
└── xiaobei-utils/
    ├── epic/
    │   ├── roadmap.md
    │   ├── status.md
    │   └── dependency-map.md
    │
    ├── 01-string-utils/
    │   ├── spec.md
    │   ├── plan.md
    │   └── tasks.md
    │
    ├── 02-number-utils/
    │   ├── spec.md
    │   ├── plan.md
    │   └── tasks.md
    │
    └── 03-array-utils/
        ├── spec.md
        ├── plan.md
        └── tasks.md
```

这个结构的核心思想是：

```text
大需求 = 项目分组目录
Epic = 全局路线图和状态管理
阶段 = 独立 Spec Kit feature
任务 = 当前阶段 tasks.md 内部 task/phase
```

## 6. Epic 目录职责

`epic/` 不直接承载具体实现任务，而是负责跨阶段管理。

推荐文件职责：

| 文件                | 作用                                                       |
| ------------------- | ---------------------------------------------------------- |
| `roadmap.md`        | 记录整体路线、阶段范围、里程碑                             |
| `status.md`         | 记录每个阶段的 Spec / Plan / Tasks / Implement / Test 状态 |
| `dependency-map.md` | 记录阶段之间的依赖关系，例如 `001 → 002 → 003`             |

示例：

```text
specs/xiaobei-utils/epic/status.md
```

可以维护：

```markdown
| Feature         | Spec    | Plan    | Tasks   | Implement | Test    |
| --------------- | ------- | ------- | ------- | --------- | ------- |
| 01-string-utils | Done    | Done    | Done    | Done      | Done    |
| 02-number-utils | Pending | Pending | Pending | Pending   | Pending |
| 03-array-utils  | Pending | Pending | Pending | Pending   | Pending |
```

## 7. 推荐分支策略

虽然目录可以按项目分组，但 Git 分支仍建议保持 Spec Kit 友好的 feature 命名。

推荐：

```text
001-xiaobei-string-utils
002-xiaobei-number-utils
003-xiaobei-array-utils
```

推荐流程：

```text
001-xiaobei-string-utils
  → review / test / accept
  → merge main/master

main/master
  → create 002-xiaobei-number-utils

002-xiaobei-number-utils
  → review / test / accept
  → merge main/master

main/master
  → create 003-xiaobei-array-utils
```

核心原则：

```text
001 → main/master → 002 → main/master → 003
```

不要长期使用：

```text
001 feature 分支 → 直接拉 002 feature 分支 → 直接拉 003 feature 分支
```

否则会导致多个 feature 分支串联，后续 PR、回滚、冲突处理都会变复杂。

## 8. 001 后续需求变更如何处理

如果 001 已经合并，002 已经开始，此时 001 出现需求变更，不一定要机械地切回 001 再合并到 002。

应按变更性质分流。

### 8.1 变更阻塞 002

例如：

- 001 的 API 签名变了；
- 001 的导出路径变了；
- 001 的核心行为影响 002；
- 001 的测试契约影响 002。

处理方式：

```text
hotfix/xiaobei-01-xxx 或 001-xiaobei-string-utils
  → 修复
  → merge main/master
  → 002-xiaobei-number-utils merge/rebase main/master
```

### 8.2 小修复，002 已开发较多

例如：

- 文档修正；
- 补测试；
- 小 bug；
- 非核心边缘逻辑。

处理方式：

```text
main/master
  → hotfix/xiaobei-01-xxx
  → merge main/master
  → cherry-pick 或 merge 到 002 分支
```

### 8.3 不阻塞 002

例如：

- 优化项；
- 低优先级边缘 case；
- 后续增强；
- 不影响 002/003 的文档补充。

处理方式：

```text
记录到 specs/xiaobei-utils/epic/status.md 或 roadmap.md
后续统一处理
```

## 9. 当前架构是否支持

结论：支持，但要区分“官方默认”和“当前项目扩展”。

| 问题                                | 结论                                                                                          |
| ----------------------------------- | --------------------------------------------------------------------------------------------- |
| 官方默认是否推荐嵌套 feature 目录？ | 没看到明确推荐，官方默认是 `specs/[feature]/` 平铺                                            |
| 当前项目是否支持嵌套 feature 目录？ | 支持，前提是显式设置 `SPECIFY_FEATURE_DIRECTORY` 或 `.specify/feature.json.feature_directory` |
| 是否适合长期项目？                  | 适合，比 `specs/` 根目录无限平铺更清晰                                                        |
| 是否适合只有 3 个小阶段？           | 也可以，但如果确定永远只有 3 个阶段，单 feature + tasks.md phases 也足够                      |

## 10. 使用时的注意事项

### 10.1 不要只依赖默认创建逻辑

默认创建逻辑通常会生成：

```text
specs/<branch-name>/
```

如果要使用项目分组结构，应显式指定：

```text
SPECIFY_FEATURE_DIRECTORY=specs/xiaobei-utils/01-string-utils
```

或者确保 `.specify/feature.json` 写入：

```json
{
  "feature_directory": "specs/xiaobei-utils/01-string-utils"
}
```

### 10.2 分支名建议仍保持规范

由于部分脚本仍会检查 feature branch 命名，建议使用：

```text
001-xiaobei-string-utils
002-xiaobei-number-utils
003-xiaobei-array-utils
```

避免过于自由的命名导致某些 Speckit 检查失败。

### 10.3 目录和分支可以不完全一致

推荐做法：

```text
Git 分支：001-xiaobei-string-utils
Spec 目录：specs/xiaobei-utils/01-string-utils
```

两者职责不同：

```text
分支负责 Git 工作流
目录负责 Spec Kit 文档组织
```

## 11. 最终结论

对于“小贝 utils”这种可能长期扩展的多阶段需求，推荐采用：

```text
目录按项目分组
阶段保持独立 feature
Epic 管理全局状态和依赖
分支按阶段独立开发并合并 main/master
```

推荐架构：

```text
specs/
└── xiaobei-utils/
    ├── epic/
    ├── 01-string-utils/
    ├── 02-number-utils/
    └── 03-array-utils/
```

推荐分支流：

```text
001-xiaobei-string-utils → main/master
main/master → 002-xiaobei-number-utils
002-xiaobei-number-utils → main/master
main/master → 003-xiaobei-array-utils
```

一句话总结：

> 官方默认是 `specs/[feature]/` 平铺；当前项目 Speckit 扩展支持显式嵌套路径。对于长期项目，推荐使用 `specs/<project>/<stage-feature>/` 分组结构，既保留独立 feature 工作流，又避免 `specs/` 根目录无限膨胀。
