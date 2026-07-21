---
title: Claude Code 基础指令速查表
slug: claude-code-basic-commands-cheatsheet
date: 2024-06-01
tags: [Claude Code, 工具, 命令]
---

## 关于 Claude Code

本文档整理了 Claude Code 的**全部内置基础指令**，包括：

- **斜杠命令（Slash Commands）**  ：在交互式会话中输入 `/` 触发的内置命令
- **CLI 启动参数**：在终端启动 `claude` 时使用的命令行参数
- **键盘快捷键**：终端交互中的常用快捷操作

## 一、会话管理

表格

| 指令                  | 说明                                                                    |
| --------------------- | ----------------------------------------------------------------------- |
| `/clear`              | 清空当前对话，开始新会话（清空后可通过 `/resume` 找回）                 |
| `/compact` [指令]     | 压缩上下文释放空间，可附加保留重点，如 `/compact 重点保留 API 设计决策` |
| `/resume` [会话名/ID] | 恢复之前的会话，支持搜索选择；`Ctrl+A` 切换查看所有项目的会话           |
| `/rewind`             | 回滚对话和代码到某个 checkpoint（同时回退对话记录和文件改动）           |
| `/rename`             | 命名当前会话                                                            |
| `/export [filename]`  | 导出会话                                                                |
| `/exit`               | 退出会话                                                                |
| `/branch` / `/fork`   | 从当前对话分支出新会话，原对话不受影响（两者功能相同）                  |
| `/recap`              | 生成当前会话的一句话摘要，快速回忆做到哪了                              |
| `/btw`                | 临时插一个问题，不污染当前上下文（by the way）                          |

**使用建议：**

- 切换任务时用 `/clear`，同任务上下文太长时用 `/compact`
- 建议上下文用量超过 80% 时主动执行 `/compact`，不要等到自动压缩
- `/compact` 后可附加指令指定保留重点，避免关键细节被压缩掉

## 二、配置 & 状态

表格

| 指令                 | 说明                                 |
| -------------------- | ------------------------------------ |
| `/config`            | 查看/修改配置（settings.json）       |
| `/model`             | 切换模型（Sonnet / Opus / Haiku 等） |
| `/permissions`       | 管理工具权限规则                     |
| `/context`           | 查看当前会话上下文使用量             |
| `/status`            | 版本、模型、账号、连接状态           |
| `/doctor`            | 诊断安装和环境问题                   |
| `/cost`              | 查看 token 使用量和费用              |
| `/fast`              | 切换快速模式                         |
| `/theme`             | 切换主题                             |
| `/login` / `/logout` | 切换账号/登出                        |

## 三、工具 & 集成

表格

| 指令                  | 说明                                      |
| --------------------- | ----------------------------------------- |
| `/mcp`                | 管理 MCP 服务器连接和 OAuth               |
| `/agents`             | 管理 agents 配置                          |
| `/hooks`              | 查看/配置 hook（工具事件钩子）            |
| `/ide`                | 查看/配置 IDE 配置                        |
| `/memory`             | 编辑 CLAUDE.md 记忆文件、开关 auto-memory |
| `/init`               | 用 CLAUDE.md 模板初始化项目               |
| `/plugin`             | 管理插件                                  |
| `/add-dir`            | 添加目录到当前工作区                      |
| `/terminal-setup`     | 配置终端集成（Shift+Enter 换行等）        |
| `/install-github-app` | 启用 GitHub 集成                          |

## 四、代码审查 & 质量检查

表格

| 指令               | 说明                                                            |
| ------------------ | --------------------------------------------------------------- |
| `/diff`            | 交互式查看代码差异                                              |
| `/review`          | 审查 Pull Request，分析当前分支改动（内置功能，非自定义 Agent） |
| `/security-review` | 安全审查当前分支的待提交改动                                    |
| `/simplify`        | 审查最近改动的文件，自动做质量/效率修复                         |

## 五、规划 & 效率

表格

| 指令            | 说明                                                    |
| --------------- | ------------------------------------------------------- |
| `/plan`         | 进入 Plan Modal 模式（Claude 先输出计划，确认后再执行） |
| `/loop`         | 定时重复执行某个 prompt，如 `/loop 5m /run`             |
| `/batch`        | 并行编排大批量改动                                      |
| `/autofix-pr`   | 启动持续监听当前 PR 的云端 Agent                        |
| `/tasks`        | 列出后台运行任务                                        |
| `/debug` [desc] | 开启调试日志、分析当前 session 的故障                   |
| `/help`         | 显示所有可用命令及用法                                  |

## 六、CLI 启动参数

表格

| 命令/参数                              | 说明                                                           |
| -------------------------------------- | -------------------------------------------------------------- |
| `claude`                               | 启动交互式会话                                                 |
| `claude "query"`                       | 带初始提示启动                                                 |
| `claude -p "query"`                    | 单次执行（print mode），输出结果后退出                         |
| `claude -c`                            | 继续最近的会话                                                 |
| `claude -r`                            | 从历史中选择会话恢复                                           |
| `claude -m opus`                       | 指定启动模型，如 `--model sonnet`、`--model claude-sonnet-4-6` |
| `claude --add-dir ../backend`          | 启动时添加额外目录到工作区                                     |
| `claude --verbose --debug`             | 调试模式，显示详细日志                                         |
| `claude --effort low/medium/high/max`  | 控制推理深度和 token 预算                                      |
| `claude --permission-mode default`     | 标准模式：高风险操作需确认                                     |
| `claude --permission-mode acceptEdits` | 自动接受文件编辑，破坏性操作仍需确认                           |
| `claude --permission-mode plan`        | 只读模式：只规划不执行                                         |
| `claude update`                        | 更新 Claude Code 到最新版本                                    |
| `claude auth login/logout/status`      | 账号认证管理                                                   |

## 七、常用键盘快捷键

表格

| 快捷键          | 说明                                      |
| --------------- | ----------------------------------------- |
| `Escape`        | 停止当前操作（不退出）                    |
| `Escape Escape` | 显示消息导航列表                          |
| `Tab`           | 命令/文件路径补全                         |
| `Shift+Enter`   | 输入框换行（需先 `/terminal-setup` 配置） |
| `Ctrl+C`        | 退出 Claude Code                          |
| `Ctrl+L`        | 清屏                                      |
| `Ctrl+R`        | 搜索命令历史                              |
| `Shift+Drag`    | 拖拽文件到终端 = 引用文件（非打开）       |
| `↑` / `↓`       | 浏览历史输入                              |
