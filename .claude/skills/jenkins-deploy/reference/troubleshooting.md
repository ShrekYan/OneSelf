# 常见坑与排障

## MCP 相关

### MCP 工具没加载

**现象**：工具列表里没有 `mcp__jenkins__*` 工具。

**原因**：

- `.mcp.json` 改了但没重启 Claude Code。
- `npx @kud/mcp-jenkins` 首次下载慢或启动失败。
- MCP 服务器环境变量名与包要求不一致。

**处理**：

1. 让用户在 Claude Code 里运行 `/mcp`，查看 jenkins 服务器状态。
2. failed 则 reconnect 或重启 Claude Code。
3. 仍不行则降级用 curl 方式，不阻塞发布流程。

## 认证与权限

### 当前 dev 账号权限矩阵

| 操作 | 权限 |
|------|------|
| 认证登录 | 有 |
| 查看 Jobs 列表 / 构建历史 / console | 有 |
| 获取 CSRF crumb | 有 |
| 触发构建（Job/Build） | 有 |
| 读取 Job config.xml | 无 403 |
| 查看 Workspace | 无 403 |
| 创建 / 修改 / 删除 Job | 无 403 |
| 系统管理 / 插件管理 | 无 403 |

这个账号是"只读 + 触发构建"账号，无法修改 Job 配置。

### 403 Forbidden

- 不要反复重试。
- 明确告知用户当前账号缺少什么权限。
- 如果是触发构建返回 403，可能是该 Job 单独配置了权限，需联系 Jenkins 管理员。

### 401 Unauthorized

- Token 失效或错误。
- 让用户检查 `.mcp.json` 里的 `MCP_JENKINS_API_TOKEN`。
- Token 可在 Jenkins `用户 → 设置 → API Token` 中重新生成。

## 触发相关

### CSRF crumb 过期

crumb 有时效性，触发前现取，不要复用旧 crumb。每次触发构建前重新调 `/crumbIssuer/api/json`。

### 参数名大小写

Jenkins 参数名大小写敏感：

- `dev_web_deploy` 里是 `ENV`（大写），不是 `env`。
- `dev_mini_deploy` 里是 `env`（小写）。

以 API 返回的 `name` 字段为准，不要凭记忆写。

### Choice 参数值非法

传给 Choice 参数的值必须在 `choices` 列表里，否则：

- Jenkins 可能静默回退到默认值。
- 或直接返回 400。

触发前对照 choices 校验。

### 分支名拼写错误

分支名区分大小写。触发前：

1. 用 `git branch --list <branch>` 或 `git ls-remote --heads origin <branch>` 确认分支存在。
2. 确认发布摘要里的分支名与用户输入完全一致。

## 构建相关

### 构建排队不下

- queue item 的 `why` 字段说明原因（executor 忙、等待上游等）。
- 等超过 5 分钟提示用户。
- 用户可选择继续等或取消。

### 构建失败但日志看不出原因

1. 先拉取完整 console。
2. 搜索关键词：`ERROR`、`FAILURE`、`Exception`、`Finished: FAILURE`。
3. 有些构建步骤失败后脚本继续跑，错误信息可能在日志中间而非末尾。
4. 仍无法定位则提示用户在 Jenkins UI 查看或联系相关同事。

### appid 选错

`dev_mini_deploy` 默认 appid 是 frodo 测试（`wx3df9c2aa01afe055`）。用户说"发正式版"时要确认改成 `wxc60b6ff0ee2c8814`，并在确认摘要中醒目提示。

## 网络相关

### Jenkins 域名不通

配置里的 `MCP_JENKINS_URL` 是 `http://jenkins.dev.zocf/`（内网域名）。如果不通：

- 确认是否连了公司 VPN / 内网。
- 可以用 IP `http://172.26.52.101:8080/` 兜底（但以 `.mcp.json` 配置为准）。

### curl 返回 exit code 3/6/7

- exit 3：URL malformed。
- exit 6：DNS 解析失败（没连 VPN/内网）。
- exit 7：连接被拒绝（Jenkins 服务不可达）。

这些都是环境问题，不是参数问题，提示用户检查网络。
