# 输出格式模板

## 发布确认摘要（触发前，强制）

触发前必须展示，等待用户明确确认（"确认 / 可以 / 执行 / 发吧"）后才触发。

```markdown
## 发布确认

| 项 | 值 |
|---|---|
| Job | dev_mini_deploy |
| app_branch | frodo-aug-20260813-batch5 |
| env | outDev（默认） |
| appid | wx3df9c2aa01afe055（默认，frodo 测试） |
| 其他参数 | 全部默认 |

回复"确认"执行发布。
```

### 特殊情况加警告

以下情况在摘要下方加醒目提示：

- **主分支**：`app_branch` 为 master/main 时，提示"即将发布主分支，请确认"。
- **生产环境**：参数值含 prd/pre/production 时，提示"即将发布到生产/预发环境"。
- **正式 appid**：`appid=wxc60b6ff0ee2c8814` 时，提示"即将发布 frodo 正式版"。
- **Job 进行中**：目标 Job 有构建在跑时，提示"该 Job 有构建 #N 正在进行，本次将排队"。

## 已触发构建（触发后，最终输出）

### 拿到构建号时

```markdown
## 已触发构建

| 项 | 值 |
|---|---|
| Job | dev_mini_deploy |
| 构建号 | #324 |
| 分支 | frodo-aug-20260813-batch5 |
| 环境 | outDev |
| 链接 | http://jenkins.dev.zocf/job/dev_mini_deploy/324/ |

构建任务已提交，可点击链接查看实时进度和结果。
```

### 仍在排队时

```markdown
## 已加入构建队列

| 项 | 值 |
|---|---|
| Job | dev_mini_deploy |
| 队列 ID | #82193 |
| 分支 | frodo-aug-20260813-batch5 |
| 环境 | outDev |
| 排队原因 | Waiting for next available executor |
| 队列链接 | http://jenkins.dev.zocf/queue/item/82193/ |

构建任务已提交，正在等待执行器分配。可点击队列链接查看排队状态，分配构建号后页面会自动跳转到构建详情。
```

## 输出要点

1. 用表格呈现参数，清晰可读。
2. 非默认参数标注 `（用户指定）`，默认参数标注 `（默认）`。
3. 触发后只输出"已触发"摘要，不轮询构建结果，不报告成功/失败。
4. 附 Jenkins 链接，让用户自行点击查看进度和结果。
5. 如果触发失败（403/400/404 等），直接告知错误原因和建议，不输出"已触发"摘要。
