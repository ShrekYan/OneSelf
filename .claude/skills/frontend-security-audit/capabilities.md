# Capabilities

## XSS 与 DOM 注入审计

- 检查原始 HTML 渲染、DOM 原始 HTML 写入、富文本、Markdown、SVG、iframe、JSONP、WebView 注入等风险。
- 识别 URL 参数、接口响应、表单输入、本地存储、跨窗口消息进入危险输出点的路径。
- 关注脚本协议、HTML data 协议、动态脚本执行、字符串形式定时器执行、动态 iframe 和动态链接拼接。
- 判断是否依赖安全转义、安全 sanitizer、URL 协议白名单、CSP、Trusted Types 等防护。

## 敏感信息泄露审计

- 检查 API Key、Secret、Token、Cookie、个人身份信息、联系方式、用户标识、业务流水号、内部接口地址、内部环境标识、加密密钥、签名密钥、白名单配置等敏感信息。
- 识别 console 日志、debugger、错误提示、埋点参数、URL query、本地存储、SourceMap、构建产物和注释中的泄露风险。
- 判断敏感信息是否经过脱敏展示、最小化存储、生命周期控制和环境隔离。

## 认证、授权与会话安全审计

- 检查 Token 存储位置、Cookie 安全属性、登录态刷新、登出清理、账号切换、本地状态清理等问题。
- 识别路由权限、菜单权限、按钮权限、接口权限是否被误当作最终安全边界。
- 关注用户 ID、资源 ID、订单 ID、业务对象 ID 等关键参数是否可被前端篡改并造成越权风险。
- 判断权限最终是否由服务端校验，敏感操作是否存在二次确认或服务端二次校验。

## CSRF、重放与敏感操作安全审计

- 审计登录、注册、修改密码、修改联系方式、提交表单、创建订单、删除资源、导出数据、权限变更等敏感流程。
- 检查重复提交、请求幂等、验证码、二次确认、关键参数可信边界等风险。
- 判断资源 ID、订单 ID、用户身份、权限标识等关键业务参数是否完全依赖前端传入。
- 关注 CSRF Token、SameSite Cookie、防重复点击、服务端幂等控制和关键参数服务端强校验。

## 前端存储安全审计

- 检查 localStorage、sessionStorage、Cookie、IndexedDB、WebSQL、Cache Storage、URL query、history state、window.name 和跨窗口消息数据。
- 识别 Token、个人身份信息、联系方式、用户标识、接口原始响应、业务敏感数据等长期存储风险。
- 关注登出、账号切换、页面返回、WebView 缓存恢复时的数据残留和串号风险。

## 第三方依赖与供应链风险审计

- 检查 package.json、lock 文件、第三方 SDK、埋点 SDK、分享 SDK、登录 SDK、CDN 资源和动态加载脚本。
- 结合依赖审计、依赖版本、维护状态、脚本加载来源和 SRI 情况识别供应链风险。
- 关注敏感页面是否引入过多第三方脚本，SDK 采集范围和权限是否符合最小化原则。

## CSP、安全响应头与浏览器安全能力审计

- 检查 Content-Security-Policy、X-Frame-Options、frame-ancestors、Referrer-Policy、Permissions-Policy、Strict-Transport-Security、X-Content-Type-Options、iframe sandbox 和 Trusted Types。
- 识别脚本源过宽、允许内联脚本、允许字符串动态执行、允许任意 iframe 嵌入、referrer 泄露敏感路径、缺少点击劫持防护等问题。
- 对安全响应头、CSP 和浏览器安全能力保持证据优先；无法从前端代码确认时，应标注为需要后端或部署配置补充确认。

## WebView、JSBridge 与跨窗口消息审计

- 检查 message 事件监听、postMessage、JSBridge、WebView 注入、App 与 H5 通信、Scheme URL、Universal Link、Deep Link。
- 识别消息来源未校验、消息结构未校验、任意页面可调用 JSBridge、敏感信息发送给不可信窗口、执行外部传入指令等风险。
- 关注微信内置浏览器、App 内嵌页、分享参数、唤端参数、返回栈数据残留等移动端 H5 特有问题。

## 文件上传与下载安全审计

- 检查图片上传、文件上传、base64 上传、Excel/PDF 下载、Blob URL、文件名处理和 MIME 类型判断。
- 识别仅依赖前端校验文件类型、允许上传 HTML/SVG/JS 等高风险文件、使用用户输入作为文件名、下载链接可篡改、预览 XSS、base64 大小限制缺失等问题。
- 强调文件类型、内容、权限和下载鉴权必须由服务端最终校验。
