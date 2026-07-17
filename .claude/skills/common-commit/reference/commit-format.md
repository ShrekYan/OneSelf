## 提交格式

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### 组成部分说明

1. **type**: 提交类型，必须小写（保持英文）
2. **scope**: 影响范围（可选），指明代码改动的领域/模块（中文/英文均可）
3. **description**: 简短描述，动词开头，使用中文
4. **body**: 详细说明（可选），多行文本，解释改动原因和背景（使用中文）
5. **footer**: 脚注（可选），关联 Issue 或破坏性变更说明

---

## 允许的 type 类型

| 类型 | 说明 | 使用场景 |
|------|------|----------|
| `feat` | 新功能 | 新增产品功能、业务特性 |
| `fix` | 修复缺陷 | 修复 bug、解决线上问题 |
| `docs` | 文档更新 | 修改 README、API 文档、注释等 |
| `style` | 代码格式 | 不影响代码逻辑的格式调整（空格、分号、缩进等） |
| `refactor` | 代码重构 | 既不新增功能也不修复 bug 的代码结构调整 |
| `perf` | 性能优化 | 提升性能的代码改动 |
| `test` | 测试相关 | 添加或修改单元测试、集成测试 |
| `chore` | 构建/工具 | 修改构建工具、脚手架、CI/CD、依赖管理 |
| `ci` | CI 配置 | 修改 CI 配置文件和脚本 |
| `revert` | 回滚 | 回滚之前的提交 |

---

## Scope 命名约定

scope 应当对应代码改动的业务模块或目录结构：

- `api`: API 接口层
- `components`: 公共组件
- `pages`: 页面组件
- `hooks`: 自定义 Hooks
- `store`: MobX 状态管理
- `styles`: 样式文件
- `config`: 项目配置
- `routes`: 路由配置
- `utils`: 工具函数
- `deps`: 依赖更新
- `discover`: Discover 页面业务
- `product`: Product 页面业务

**示例**:
```
feat(discover): 添加全新底部导航组件
fix(api): 正确处理 401 未授权错误
refactor(components): 优化卡片组件渲染
```