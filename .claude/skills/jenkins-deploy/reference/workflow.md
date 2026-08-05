# 执行流程

Jenkins 发布流程共 7 个步骤，触发后即完成，不轮询最终构建结果。

## 步骤 1：确定 app_branch

- 用户在 prompt 中明确指定分支时，直接使用。
- 用户未指定时，执行 `git rev-parse --abbrev-ref HEAD` 获取当前分支。
- 当前分支为 `master` / `main` / `develop` 且用户未明确要求时，进行二次确认。

详见 [`branch-routing.md`](branch-routing.md)。

## 步骤 2：路由 Jenkins Job

根据分支前缀自动选择 Job：

| 分支前缀 | Jenkins Job |
|----------|-------------|
| `frodo*` | `dev_mini_deploy` |
| `galaxy*` / `externalChannels*` | `dev_web_deploy` |
| 匹配不到 | 列出所有 Job 让用户手动选择，不猜测 |

详见 [`branch-routing.md`](branch-routing.md)。

## 步骤 3：拉取 Job 参数定义

调用 Jenkins API 获取目标 Job 的实时参数定义，提取默认值和 choices，不依赖硬编码。

详见 [`job-parameters.md`](job-parameters.md)。

## 步骤 4：合并参数值

合并优先级：用户明确指定的参数 > Job 默认值 > 留空。

- `app_branch` 必填。
- 其他参数全部使用默认值，用户明确要求时才覆盖，不主动询问。

详见 [`job-parameters.md`](job-parameters.md)。

## 步骤 5：展示发布摘要并等待确认

以表格形式展示发布摘要，包含 Job、分支、参数值及来源。以下情况附加醒目警告：

- `app_branch` 为 `master` / `main`。
- 参数值含 `prd` / `pre` / `production`。
- `appid=wxc60b6ff0ee2c8814`。
- 目标 Job 有构建正在进行。

必须获得用户明确确认后才能触发。

模板见 [`templates/output-templates.md`](../templates/output-templates.md)。

## 步骤 6：触发构建

- 优先使用 MCP 工具。
- MCP 不可用时降级使用 curl。
- 触发后获取队列 ID 或构建号。

详见 [`build-trigger.md`](build-trigger.md)。

## 步骤 7：反馈触发结果

- 拿到构建号：输出构建号、分支、环境、Jenkins 链接。
- 仍在排队：输出队列 ID、排队原因、队列链接。
- 触发失败：直接告知错误原因和建议。

不轮询最终结果，任务到触发完成为止。

模板见 [`templates/output-templates.md`](../templates/output-templates.md)。
