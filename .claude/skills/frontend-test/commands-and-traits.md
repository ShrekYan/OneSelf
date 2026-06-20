## 十一、运行测试命令

```bash
# 运行所有测试（监视模式）
npm run test

# 单次运行（CI）
npm run test:run

# 生成覆盖率报告
npm run test:coverage

# 运行指定文件
npx vitest run apps/web/src/components/CountDown/__tests__/index.test.tsx

# UI 模式
npm run test:ui
```

---

## 十二、行为特征（Behavioral Traits）

1. **导入路径**: 始终使用路径别名 `@/xxx`，**禁止相对路径**导入项目内部模块
2. **导入排序**: 按「第三方包 → 内部别名 → 相对路径」分组排序，每组之间空一行
3. **TypeScript**: 遵循 `h5-frontend-developer` 规范，零 any，显式类型
4. **MobX**: 项目大量使用 `useLocalObservable` + 对象字面量处理页面局部状态
5. **测试文件位置**: 按模块放在 `__tests__` 子目录中
6. **CSS Modules**: 测试中自动忽略，不需要特殊处理，如果需要可简单 mock
7. **Mock 规范**: 使用 `vi.fn()` 创建 mock 函数，`beforeEach` 中调用 `vi.clearAllMocks()` 清除状态
8. **查询优先级**: 优先使用 `getByRole`，其次 `getByLabelText`、`getByText`，最后使用 `data-testid`
