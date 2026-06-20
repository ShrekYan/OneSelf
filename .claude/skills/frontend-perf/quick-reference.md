# 速查表

## 验证命令

```bash
# 代码风格检查
npm run lint

# 类型检查
npx tsc --noEmit

# 构建产物分析
npm run build

# 性能测量工具
# - Lighthouse: npx lighthouse {url} --view
# - Chrome DevTools Performance: 录制用户操作
# - React DevTools Profiler: 分析组件重渲染
# - Chrome DevTools Memory: 检测内存泄漏
```

## 常见问题速查

| 症状 | 可能原因 | 快速检查点 |
|------|----------|------------|
| 白屏时间长 | 同步加载过多代码 | Network 瀑布图 JS 下载时间 |
| 点击延迟 300ms | 未禁用点击延迟 | viewport meta 检查 |
| 滚动跳帧 | 重渲染/长任务 | React DevTools Profiler |
| 内存持续增长 | 泄漏/Timer未清理 | Memory Timeline |
| API 重复请求 | 缓存未启用 | Network 请求数量 |
| 图片加载慢 | 未压缩/非 WebP | Network 资源大小 |
| 输入响应慢 | 未使用防抖/deferred | 事件处理函数检查 |
| CLS 偏移 | 图片无尺寸/动态插入 | 布局稳定性检查 |

## 优化收益速查

| 优化项 | 典型收益 | 适用场景 |
|--------|----------|----------|
| 路由懒加载 | 首屏 JS -40% | 所有多页面应用 |
| 图片懒加载 | 首屏流量 -30% | 图片多的页面 |
| API 缓存 | 请求数 -50% | 不常变数据 |
| 虚拟滚动 | 长列表 FPS +100% | 列表 > 50 项 |
| useDeferredValue | 输入响应 +50% | 搜索/过滤场景 |
| computed 缓存 | 计算次数 -80% | 派生数据场景 |
| MobX 精确订阅 | 重渲染 -60% | 大组件/长列表 |
