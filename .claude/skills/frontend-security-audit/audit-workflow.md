# Security Audit Workflow

## Step 1: Define Scope

开始审计前必须确认或推断分析范围，并在报告中说明：

- 审计对象：页面、组件、路由、模块、服务封装、配置、依赖、构建产物或指定文件。
- 审计目标：XSS、敏感信息、认证授权、敏感操作安全、前端存储、依赖风险、WebView、CSP 或综合安全。
- 审计方式：静态代码分析、配置分析、依赖分析、构建产物分析、运行时数据分析或混合分析。
- 范围不明确时，先根据用户描述给出合理假设；关键条件缺失时，应说明需要用户补充。

## Step 2: Collect Evidence

根据任务范围收集必要证据：

- 使用 Read 查看用户指定文件、关键入口文件、相关组件、服务封装、配置或依赖文件。
- 使用 Grep 搜索安全相关模式，例如原始 HTML 渲染、DOM HTML 写入、动态代码执行、字符串形式定时器、localStorage、sessionStorage、Cookie 读写、postMessage、message 事件监听、iframe、script、token、secret、password、idCard、bankCard、mobile、console、debugger 等。
- 使用 Glob 查找相关页面、组件、服务、配置、构建产物和静态资源。
- 使用 Bash 只执行必要且范围明确的只读命令，例如依赖审计、查看依赖树、查看过期依赖、查看文件大小或项目已有只读检查命令。
- 使用 mcp__ide__getDiagnostics 获取 IDE 诊断信息，辅助识别明显代码问题。

执行命令时必须避免副作用，不执行安装、升级、删除、全局修复、破坏性命令或外部批量扫描。

## Step 3: Analyze Data Flow

重点分析以下数据来源：

- URL query、hash、path 参数。
- localStorage、sessionStorage、Cookie、IndexedDB、Cache Storage、window.name、history state。
- 接口响应、表单输入、文件内容、base64 内容。
- postMessage、JSBridge、App 注入数据、iframe 消息、第三方 SDK 回调。
- 环境变量、构建配置、静态资源和埋点参数。

重点分析以下危险输出点：

- HTML 渲染、DOM 写入、富文本渲染、Markdown 渲染、SVG 渲染。
- URL 跳转、iframe 地址、script 地址、图片地址、Scheme 地址。
- 本地存储、日志输出、错误提示、埋点上报、接口请求参数。
- 登录、注册、权限变更、资源删除、订单提交、数据导出等敏感流程参数。

## Step 4: Classify Findings

基于证据判断问题类型：

- **确定漏洞**：有明确代码、配置或运行时证据，且风险路径成立的问题。
- **高可信风险**：缺少完整运行环境或服务端证据，但代码模式高度危险，风险成立概率较高。
- **潜在风险**：需要更多后端、部署、运行时或业务流程信息确认的问题。
- **非问题**：看似危险但已有上下文保护、可信输入约束、服务端兜底或风险不成立的问题。

## Step 5: Prioritize

所有问题必须标注风险等级。审计发现必须优先按风险等级排序，再结合业务影响和上线风险排序。

排序规则：

1. 高危问题。
2. 中危问题。
3. 低危问题。

同一风险等级内，按以下顺序排序：

1. 可直接导致认证、授权、隐私或核心业务数据风险的问题。
2. 可直接利用的 XSS、Token 泄露、越权问题。
3. 敏感信息存储、日志、URL 泄露问题。
4. 跨窗口消息、JSBridge、第三方脚本问题。
5. CSP、安全响应头、依赖风险问题。
6. 代码质量引发的潜在安全问题。

## Step 6: Report

必须使用中文输出结构清晰的报告。报告中必须区分确定漏洞、高可信风险、潜在风险和需要补充确认的问题，并为每条问题提供证据、影响、修复建议和验证方式。
