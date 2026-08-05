# 构建触发方式

优先使用 MCP 工具；MCP 不可用时降级 curl。触发成功后获取队列 ID / 构建号即完成，不轮询最终构建结果。

## 方式一：MCP 工具（优先）

如果 `mcp__jenkins__*` 工具可用：

| 工具 | 用途 |
|------|------|
| `mcp__jenkins__jenkins_get_job_parameters` | 获取参数定义 |
| `mcp__jenkins__jenkins_trigger_build` | 触发构建，传入 `jobName` + `params` |
| `mcp__jenkins__jenkins_get_queue` | 查看队列，获取构建号（可选） |

### 触发参数组织

```yaml
jobName: dev_mini_deploy
params:
  app_branch: frodo-aug-20260813-batch5
  master_or_branch: branch
  env: outDev
  appid: wx3df9c2aa01afe055
  pagePath: pages/Home/index
```

触发成功后，工具返回队列项或构建号，直接输出"已触发构建"摘要即可。

## 方式二：curl（MCP 不可用时降级）

### 凭证读取

从项目根目录 `.mcp.json` 的 `mcpServers.jenkins.env` 读取：

```bash
JENKINS_URL=$(python3 -c "import json;print(json.load(open('.mcp.json'))['mcpServers']['jenkins']['env']['MCP_JENKINS_URL'])")
JENKINS_USER=$(python3 -c "import json;print(json.load(open('.mcp.json'))['mcpServers']['jenkins']['env']['MCP_JENKINS_USER'])")
JENKINS_TOKEN=$(python3 -c "import json;print(json.load(open('.mcp.json'))['mcpServers']['jenkins']['env']['MCP_JENKINS_API_TOKEN'])")
```

禁止在代码、日志、SKILL 文件中硬编码 token。

### 第一步：获取 CSRF crumb（触发前现取）

```bash
CRUMB=$(curl -s -u "$JENKINS_USER:$JENKINS_TOKEN" \
  "$JENKINS_URL/crumbIssuer/api/json" \
  | python3 -c "import sys,json;print(json.load(sys.stdin)['crumb'])")
```

### 第二步：触发构建

```bash
curl -s -u "$JENKINS_USER:$JENKINS_TOKEN" \
  -H "Jenkins-Crumb:$CRUMB" \
  -X POST "$JENKINS_URL/job/<jobName>/buildWithParameters" \
  --data-urlencode "app_branch=<branch>" \
  --data-urlencode "key2=value2" \
  -D - -o /dev/null -w "\nHTTP_CODE: %{http_code}\n"
```

- 成功返回 `HTTP/1.1 201 Created`。
- 响应头 `Location` 为队列 item URL，格式如 `http://jenkins.dev.zocf/queue/item/82193/`。
- 从 URL 末尾提取 itemId（如 `82193`）。

### 第三步：尝试获取构建号（可选，做一次即可）

队列项可能需要几秒才分配构建号。做一次查询，拿到就展示，拿不到就只展示队列 ID，不轮询：

```bash
sleep 3
curl -s -u "$JENKINS_USER:$JENKINS_TOKEN" \
  "$JENKINS_URL/queue/item/<itemId>/api/json" \
  | python3 -c "
import sys,json
d=json.load(sys.stdin)
e=d.get('executable')
if e:
    print('buildNumber:', e.get('number'))
    print('url:', e.get('url'))
else:
    print('排队中:', d.get('why','等待分配执行器'))
"
```

- 拿到构建号：摘要中展示构建号 + 链接。
- 没拿到：摘要中展示队列 ID + 队列链接，告诉用户"正在排队，可点击链接查看进度"。

## 错误码判断

| HTTP 码 | 含义 | 处理 |
|---------|------|------|
| 201 | 已入队 | 输出已触发摘要 |
| 400 | 参数错误 | 检查参数名/值，对照 choices |
| 403 | 权限不足 | 告知用户，不重试 |
| 404 | Job 不存在 | 检查 jobName 拼写 |
| 500 | Jenkins 内部错误 | 稍后重试或查看 Jenkins 状态 |

## 触发前检查

触发前建议检查目标 Job 是否已有正在进行的构建，避免重复排队：

```bash
curl -s -u "$USER:$TOKEN" \
  "$JENKINS_URL/job/<jobName>/lastBuild/api/json?tree=building,number"
```

如果 `building=true`，在确认摘要中提示用户："该 Job 有构建 #N 正在进行，本次将排队"，由用户决定是否继续。
