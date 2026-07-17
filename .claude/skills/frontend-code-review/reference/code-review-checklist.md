# 前端代码审查清单

## 🔴 架构规范（必须检查，违反即中等以上）

### 页面目录结构规范（遵循 `CLAUDE.md`）
- [ ] 页面是否按职责拆分：`index.tsx` + `useStore.ts` + `constant.ts` + `types.ts` + `hooks/` + `components/`？
- [ ] `useStore.ts` 是否使用 `useLocalObservable` + **对象字面量**写法？（禁止页面级使用 class）
- [ ] 复杂业务逻辑是否抽离到 `hooks/useXxx.ts`？纯函数是否正确放置？
- [ ] `constant.ts` 是否存放页面所有常量配置？

### API 层规范（遵循 `.claude/rules/frontend-api-design.md`）
- [ ] 是否按业务模块拆分到 `apps/web/src/api/[module]/`？
- [ ] 是否在 `apps/web/src/api/index.ts` 统一导出？
- [ ] 所有请求/响应是否有完整 `Params`/`Response` 类型定义？
- [ ] 缓存配置是否合理（不常变数据开启 `cache: true`）？
- [ ] 是否使用路径别名 `@/api` 而非相对路径？

## 🔵 TypeScript 类型安全（遵循 `.claude/skills/h5-frontend-developer/rules/frontend-typescript.md`）
- [ ] 是否存在隐式 `any` 或滥用 `any` 绕过类型检查？（优先 `unknown`）
- [ ] 组件 Props、API 请求/响应是否有完整类型定义？
- [ ] 可空值是否用 `Type | null` 明确标注？（区分 `undefined` 和 `null` 语义）
- [ ] 泛型是否添加了正确约束？
- [ ] 类型导出是否都使用 `export type`？
- [ ] 是否优先使用联合类型代替 `enum`？

## 🔵 React 19 规范
- [ ] Hooks 规则是否遵守（顶层调用、依赖完整）？
- [ ] `useState`/`useRef` 是否指定了正确泛型类型？
- [ ] 是否合理使用 `useMemo`/`useCallback` 避免不必要重渲染？
- [ ] 单个组件是否过大（> 500 行），是否抽离可复用子组件？
- [ ] `useEffect` 是否正确返回清理函数（防止内存泄漏）？

## 🔵 MobX 6 状态管理
- [ ] **页面级 Store**: 是否遵循 `useLocalObservable` + 对象字面量？
- [ ] **全局 Store**: 是否正确使用 class + `makeAutoObservable`？
- [ ] Store 所有字段是否显式声明类型并初始化？
- [ ] 方法参数和返回值是否都有类型？
- [ ] 是否使用 `useObserver` Hook？（禁止 observer HOC）
- [ ] 是否避免在 actions 之外修改状态？

## 🔵 样式规范（SCSS + CSS Modules，遵循 `.claude/skills/h5-frontend-developer/rules/frontend-css-scss.md`）
- [ ] 是否使用 `*.module.scss`？（禁止全局样式污染）
- [ ] class 命名是否为 **camelCase**（SCSS 源码与 TS 引用保持一致）？
- [ ] **根容器命名** 是否遵循 `{componentName}Container` 规则？
- [ ] 是否基于 **750px 设计稿** 使用 px 编写（自动转 vw，禁止手动 vw）？
- [ ] SCSS 嵌套深度是否 ≤ 3 层？
- [ ] 点击元素尺寸是否 ≥ 44px × 44px？
- [ ] 是否适配安全区域（`env(safe-area-inset-bottom)` 等）？
- [ ] 是否合理使用全局样式变量？

## 🔵 业务逻辑拆分（遵循 `.claude/rules/frontend-hooks-ts.md`）
- [ ] 纯函数是否正确放置在 `useStore.ts` 或 `utils.ts`？
- [ ] API 调用是否放在 `useStore.ts` 或 `hooks/`？
- [ ] 复杂业务逻辑是否抽离到 `hooks/useXxx.ts`？
- [ ] 所有函数是否使用具名导出？（禁止 `export default`）

## 🔵 自定义 Hooks 规范（遵循 `.claude/rules/frontend-hooks-error-handling.md`）
- [ ] 文件名是否以 `use` 开头（`useXxx.ts`）？
- [ ] 是否为参数和返回值定义完整类型？
- [ ] 副作用是否正确清理（timer、事件监听）？

## 🔵 第三方库使用规范（遵循 `.claude/rules/frontend-third-party-libraries.md`）
- [ ] `react-use` 是否按需导入（`react-use/lib/useDebounce`）？
- [ ] 是否优先使用 `zod` 做数据校验？
- [ ] 是否优先使用 `es-toolkit` 代替 `lodash`？
- [ ] 动态 className 拼接是否使用 `classnames`？

## 🔵 H5 移动端适配
- [ ] 点击元素最小尺寸是否 ≥ 44px？
- [ ] 是否适配安全区域（刘海屏、底部小黑条）？
- [ ] 是否优先使用 Ant Design Mobile 组件，避免重复造轮子？
- [ ] 非首屏图片是否懒加载？

## 🔵 安全与性能
- [ ] 是否存在 XSS 风险（用户输入未转义）？
- [ ] 是否有敏感信息（API 密钥、Token）硬编码在代码中？
- [ ] 大图是否压缩？是否使用 WebP 格式？
- [ ] 是否存在内存泄漏风险（事件监听/timer 未清理）？
- [ ] 大型列表是否使用虚拟滚动？

## 🔵 代码整洁度
- [ ] 是否所有导入使用路径别名 `@/`，禁止长相对路径？
- [ ] 是否有未使用的导入/变量？
- [ ] 命名是否符合规则：
  - 变量/函数：`camelCase`
  - 类/接口/组件：`PascalCase`
  - 文件名：目录按规范（组件 PascalCase，api 模块 kebab-case）
- [ ] 导入排序是否正确：第三方 → 别名 → 相对路径？
- [ ] 是否删除了注释掉的死代码？
- [ ] 是否通过 `npm run lint` 检查？

## 问题严重程度分级

| 级别 | 说明 |
|------|------|
| 🔴 **严重** | 功能不可用、内存泄漏、安全漏洞、数据丢失、违反架构核心规则导致难以维护 |
| 🟠 **中等** | 功能异常、类型不安全、性能问题、不符合项目规范、影响可维护性 |
| 🟡 **轻微** | 代码风格、缺少注释、命名不规范、不影响功能和维护 |

## 检查维度优先级

1. **架构与目录结构** - 确保符合项目架构规范
2. **TypeScript 类型安全** - 零 any 原则、类型完整性
3. **React 19 最佳实践** - Hooks 规则、渲染优化
4. **MobX 状态管理** - 状态修改规范、observable 使用
5. **API 层规范** - 请求响应类型、缓存配置
6. **样式规范** - CSS Modules、命名规则
7. **自定义 Hooks** - 命名规范、副作用清理
8. **H5 移动端适配** - 点击区域、安全区域
9. **性能优化** - 懒加载、虚拟滚动、避免重复渲染
10. **安全规范** - XSS防护、敏感信息保护
11. **代码整洁度** - 命名、导入排序、死代码清理