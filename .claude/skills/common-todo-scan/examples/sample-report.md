# TODO / FIXME 扫描报告

## 统计

- **扫描范围**: `项目根目录`
- **发现条目**: 5 个

---

## 待办清单

按文件路径排序：

### `apps/web/src/pages/Home/useStore.ts`

| 行号 | 类型 | 内容 |
|------|------|------|
| 23 | TODO | 接入首页文章列表真实接口 |
| 45 | FIXME | 下拉刷新状态未正确重置 |

### `services/backend/src/article/article.service.ts`

| 行号 | 类型 | 内容 |
|------|------|------|
| 112 | TODO | 阅读量去重逻辑待补充 |
| 156 | XXX | 分类排序硬编码，考虑抽离配置 |

### `services/auth-service/src/auth/auth.service.ts`

| 行号 | 类型 | 内容 |
|------|------|------|
| 88 | FIXME | 登录失败提示文案需统一 |

---

## 清理建议

1. 已完成的 TODO 及时删除
2. 长期未处理的 TODO 考虑安排进迭代
3. 紧急的 FIXME 优先处理
