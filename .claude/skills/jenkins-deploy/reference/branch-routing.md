# 分支路由与 app_branch 确定

## 分支到 Job 路由表

根据分支名前缀（不区分大小写）自动选择 Jenkins Job：

| 分支前缀 | Jenkins Job | 用途 |
|----------|-------------|------|
| `frodo` | `dev_mini_deploy` | frodo 微信小程序发布 |
| `galaxy` | `dev_web_deploy` | galaxy H5 发布 |
| `externalChannels` | `dev_web_deploy` | externalChannels H5 发布 |

### 匹配规则

1. 分支名以这些前缀开头即命中（如 `frodo-aug-20260813-batch5`、`externalChannels-new-dev-2099`）。
2. 同时命中多个前缀时，按上表从上到下优先级匹配。
3. 匹配不到时，不要猜测，调用 Jenkins API 列出所有 Job 让用户手动选择：

```bash
curl -s -u "$USER:$TOKEN" "$JENKINS_URL/api/json?tree=jobs[name,color]"
```

## app_branch 确定优先级

1. 用户在 prompt 中明确指定时，直接使用。
2. 用户未指定时，执行 `git rev-parse --abbrev-ref HEAD` 获取当前分支。
3. 当前分支是 `master` / `main` / `develop` 且用户未明确要求时，进行二次确认，防止误发主分支。

### 判断要点

- 用户说"把 xxx 分支发一下"、"app_branch 用 xxx"时，使用用户指定的分支。
- 用户只说"发布"、"帮我发版"时，取当前 git 分支。
- 取到的分支名需要和路由表能匹配上，否则进入手动选 Job 流程。
- 分支名区分大小写，触发前再次核对与 git 远端实际分支名一致。
