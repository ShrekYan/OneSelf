## 完整示例

### 示例 1: 新增功能
```
feat(discover): 添加底部导航栏

实现了响应式底部导航，支持标签页之间的平滑过渡。
支持未读消息徽章显示。

Closes: #12
Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
```

### 示例 2: 修复 Bug
```
fix(api): 正确处理网络超时错误

为 GET 请求添加重试逻辑，网络超时时自动重试。
防止应用在不稳定网络环境下崩溃。

Fixes: #35
Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
```

### 示例 3: 代码重构
```
refactor(product): 将商品页面拆分为小组件

把大型商品页面组件拆分为多个可复用小组件：
商品列表、商品筛选、商品卡片。
提升了代码可维护性，支持组件复用。

无功能性变更。
Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
```

### 示例 4: 性能优化
```
perf(images): 实现商品图片懒加载

使用原生懒加载，降级方案使用 intersection observer。
减少首屏加载时间和网络数据用量。
Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
```

### 示例 5: 简单修复
```
fix: 修正登录按钮文字拼写错误
Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
```