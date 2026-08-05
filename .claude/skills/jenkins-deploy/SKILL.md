---
name: jenkins-deploy
description: 当用户需要触发 Jenkins 构建发布时使用本 skill。触发词包括"发布、部署、deploy、发版、打包上传、触发 Jenkins 构建"。根据当前 git 分支自动路由到 dev_mini_deploy（frodo 小程序）或 dev_web_deploy（galaxy/externalChannels H5），自动填充默认参数，确认后触发构建。不适用于查询构建状态、查看历史日志、修改 Jenkins 配置等非发布场景。
license: Complete terms in LICENSE.txt
---

# Jenkins 发布流程

## 概述

本 skill 用于帮助用户通过 Jenkins 触发一次发布构建。核心能力包括：

- 根据当前 git 分支或用户指定分支自动选择 Jenkins Job。
- 拉取目标 Job 的实时参数定义，自动填充默认值。
- 展示发布摘要并等待用户确认后触发构建。
- 触发成功后返回队列 ID 或构建号，不轮询最终结果。

## 使用时机

### 适用场景

- 用户说"发布 / 部署 / 发版 / 打包上传 / deploy"。
- 用户明确要求触发 Jenkins 构建（如"帮我发个版"、"触发一下 dev_mini_deploy"）。
- 用户提供了分支名并要求发布（如"把 frodo-aug-20260813-batch5 发一下"）。

### 不适用场景

- 查询构建状态、查看历史日志、分析构建失败原因。
- 修改 Jenkins Job 配置或权限。
- 非发布类 Jenkins 操作。

## 输入

- 用户明确指定的分支名（可选）。
- 用户明确指定的 Job 参数（可选）。
- 当前 git 分支（当用户未指定分支时自动获取）。
- Jenkins 凭证从项目根目录 `.mcp.json` 读取，不在 skill 中硬编码。

## 执行流程

执行流程详见 [`reference/workflow.md`](reference/workflow.md)。

## 资源文件

| 资源 | 用途 |
|------|------|
| [`reference/workflow.md`](reference/workflow.md) | 完整执行流程与步骤说明 |
| [`reference/branch-routing.md`](reference/branch-routing.md) | 分支路由与 `app_branch` 确定规则 |
| [`reference/job-parameters.md`](reference/job-parameters.md) | Job 参数定义与参数值合并规则 |
| [`reference/build-trigger.md`](reference/build-trigger.md) | MCP / curl 构建触发方式 |
| [`reference/troubleshooting.md`](reference/troubleshooting.md) | 常见错误与排障指南 |
| [`templates/output-templates.md`](templates/output-templates.md) | 发布确认与触发结果输出模板 |

## 输出格式

### 触发前

以表格展示发布确认摘要，包含 Job、app_branch、各参数值及来源（默认 / 用户指定），并在特殊情况下附加醒目警告。

### 触发后

- 拿到构建号时：输出构建号、分支、环境、Jenkins 链接。
- 仍在排队时：输出队列 ID、排队原因、队列链接。
- 触发失败时：直接告知错误原因和建议，不输出"已触发"摘要。

具体模板见 `templates/output-templates.md`。

## 验证

- [ ] 是否正确识别了目标分支和 Jenkins Job。
- [ ] 是否从 Jenkins API 成功拉取了实时参数定义。
- [ ] app_branch 是否已正确填充且经过二次确认（主分支场景）。
- [ ] 是否在用户明确确认后才触发构建。
- [ ] 触发后是否返回了队列 ID 或构建号，并附上了 Jenkins 链接。
- [ ] 是否在日志中避免输出完整 Token 或凭证。

## 约束

- 触发前必须获得用户明确确认，不得擅自触发。
- 参数值含 `prd`/`pre`/`production` 时额外醒目提示。
- `app_branch` 为 `master`/`main` 时额外提示。
- `appid=wxc60b6ff0ee2c8814` 时提示"即将发布正式版"。
- 目标 Job 有构建在跑时提示用户是否仍要排队。
- 403 权限不足时明确告知用户，不反复重试。
- 禁止在代码、日志、SKILL 文件中硬编码 Token。
- 不轮询构建最终结果，任务到触发完成为止。
