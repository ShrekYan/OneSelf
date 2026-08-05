# Job 参数定义与合并规则

## 拉取实时参数定义（强制）

调用 API 获取实时参数，不要依赖硬编码：

```bash
curl -s -u "$USER:$TOKEN" \
  "$JENKINS_URL/job/<jobName>/api/json?tree=property[parameterDefinitions[name,type,defaultParameterValue[value],description,choices]]"
```

从返回中提取：

- `name`：参数名（大小写敏感）。
- `type`：`StringParameterDefinition` / `ChoiceParameterDefinition` / `BooleanParameterDefinition`。
- `defaultParameterValue.value`：默认值。
- `choices`：可选项（Choice 类型）。
- `description`：参数说明。

## 参数值合并优先级

从高到低：

1. 用户在 prompt 中明确指定的参数（如"env 改成 test"、"appid 用正式的"）。
2. Job 参数定义中的默认值。
3. 无默认值的非必填参数则留空。

`app_branch` 为必填项，没有默认值时必须从分支路由步骤获取。

### 通用规则

- 用户说"其他默认"、"都用默认"时，不额外询问。
- 用户只说了分支，没说其他参数时，全部走默认，不问。
- 对 Choice 参数，用户传入的值必须在 choices 列表中，否则提示用户确认或回退默认。

## dev_mini_deploy 参数参考

> 以实时 API 为准，下表仅为参考，Job 参数可能随时调整。

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `app_branch` | String | 空（必填） | 要发布的分支 |
| `master_or_branch` | Choice | `branch` | `branch` / `master` |
| `env` | Choice | `outDev` | 当前只有 `outDev` 选项 |
| `appid` | String | `wx3df9c2aa01afe055` | frodo 测试；正式为 `wxc60b6ff0ee2c8814` |
| `string_mark` | String | 空 | 备注 |
| `string_version` | String | 空 | 版本号 |
| `pagePath` | String | `pages/Home/index` | 打包路径 |
| `searchQuery` | String | 空 | 路径携带参数 |

### appid 常用值

| appid | 用途 |
|-------|------|
| `wx3df9c2aa01afe055` | frodo 测试（默认） |
| `wxc60b6ff0ee2c8814` | frodo 正式 |
| `wxb08008769eab434b` | miniProgram 测试 |
| `wxbe5bb0257b06300d` | miniProgram 正式 |

## dev_web_deploy 参数参考

> 以实时 API 为准，下表仅为参考。

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `app_branch` | String | 空（必填） | 要发布的分支 |
| `miniprogram_app_name` | String | `welfare` | 小程序应用名 |
| `mobile_srv_url` | Choice | `outDev` | 后端环境：outDev/offline/dev/test/fofTest/sit |
| `master_or_branch` | Choice | `branch` | `branch` / `master` |
| `ENV` | Choice | `Dev` | `Dev` / `OFFLINE`（注意大写） |

### mobile_srv_url 环境映射

| 值 | 后端地址 |
|----|---------|
| `outDev` | http://dev-mobile.qiangungun.com |
| `offline` | http://offline-mobile.qiangungun.com |
| `dev` | http://dev-mobile.qiangungun.com |
| `test` | http://test1-mobile.qiangungun.com |
| `fofTest` | http://test2-mobile.qiangungun.com |
| `sit` | http://sit-mobile.qiangungun.com |

> 注意：该 Job 的 choices 中没有 `pre`/`prd`，只能发到开发/测试类环境。
