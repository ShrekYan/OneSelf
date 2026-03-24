# 07 - API 请求规范

## 基本规范

- 使用 `@/api/` 目录中定义的 API 模块，不要在组件中直接写 axios 请求
- API 设计遵循 `.claude/rules/api-design.md` 中的详细规范
- 所有 API 请求都经过统一拦截器处理，自动添加 Token、处理错误
- 请求拦截器自动添加 `Authorization` header
- 统一错误处理，默认使用 Toast 显示错误信息
- 如需手动处理错误，可以设置 `skipErrorToast: true` 关闭全局提示

## 使用示例

```typescript
import { api } from '@/api/index.tsx'

// 获取列表
const data = await api.get('/api/v1/product/list', { params })

// 提交数据
await api.post('/api/v1/product/create', payload)

// 关闭全局错误提示，手动处理
try {
  await api.post('/api/v1/login', data, { skipErrorToast: true })
} catch (error) {
  // 自定义错误处理
}

// 开启缓存（适合不变的配置数据）
const config = await api.get('/api/v1/config', { cache: true })
```

## 相关文档

完整的 API 设计规范请参考：`.claude/rules/api-design.md`
