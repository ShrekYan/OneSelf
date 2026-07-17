# API 文档规范

API 文档**通过 TypeScript 类型 + JSDoc 注释实现**，不需要单独的 README 文件。

```typescript
// apps/web/src/api/user/types.ts
/** 用户信息 */
export interface UserInfo {
  /** 用户ID */
  id: string;
  /** 用户昵称 */
  nickname: string;
  /** 用户头像URL，可能为空 */
  avatar: string | null;
}

/** 登录请求参数 */
export interface LoginRequest {
  /** 手机号（11位） */
  mobile: string;
  /** 验证码（6位） */
  code: string;
}

// apps/web/src/api/user/index.ts
/** 手机号验证码登录 */
export async function login(
  params: LoginRequest
): Promise<LoginResponse> {
  return await api.post('/auth/login', params);
}
```
