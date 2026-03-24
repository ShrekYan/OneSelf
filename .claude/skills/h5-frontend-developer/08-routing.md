# 08 - 路由规范

项目使用 **React Router DOM 6+** 进行路由管理，遵循以下规范：

## 基本规范

- 路由配置统一放在 `src/routes/` 目录
- 使用 `useParams` 获取路由参数
- 使用 `useSearchParams` 获取查询参数
- 使用 `useNavigate` hook 进行编程式导航
- **页面跳转必须使用 `useNavigate` hook，禁止使用 `<a>` 标签的 `href` 属性**，避免页面完全刷新，保持应用状态

## 使用示例

```tsx
import { useParams, useSearchParams, useNavigate } from 'react-router-dom'

// 获取路由参数
const { id } = useParams<{ id: string }>()

// 获取查询参数
const [searchParams, setSearchParams] = useSearchParams()
const page = searchParams.get('page') || '1'

// 编程式导航
const navigate = useNavigate()
navigate('/home')
navigate(-1) // 返回上一页
```
