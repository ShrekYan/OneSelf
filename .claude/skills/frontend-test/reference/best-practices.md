# 最佳实践与检查清单

## 命名规范

```typescript
describe('FunctionOrComponentName', () => {
  it('should do something when some condition', () => { /* ... */ });
  it('should do another thing when some condition', () => { /* ... */ });
});
```

格式：`should {expected behavior} [when {condition}]`

## AAA 模式

```typescript
it('should calculate total price correctly', () => {
  // Arrange - 准备
  store.addItem(product1);
  store.addItem(product2);

  // Act - 执行
  const total = store.totalPrice;

  // Assert - 断言
  expect(total).toBe(300);
});
```

## 一个测试用例只测一件事

- 好：每个测试一个断言（或一组相关断言）
- 不好：一个测试测试多个不相关场景

## 测试用户行为，不测试实现

```typescript
// 好 - 测试用户可见结果
fireEvent.click(screen.getByRole('button', { name: /开始/ }));
expect(screen.getByRole('button', { name: /开始/ })).toBeDisabled();

// 不好 - 测试内部状态
expect(component.instance.state.isRunning).toBe(true);
```

## 常见错误避免

1. 不要测试实现细节，只测试外部行为
2. 不要在测试中使用 `act` 包裹不必要的代码
3. 不要忘记清理定时器、fakeTimers（`vi.useRealTimers()`）
4. 不要忘记在 `beforeEach` 重置 mock
5. 不要用 `expect.any(Object)` 模糊匹配，尽可能精确断言
6. 不要在测试中写复杂逻辑 - 如果测试本身复杂，可能拆分错了
7. 不要使用相对路径导入，始终使用 `@/` 别名

## 生成测试检查清单

生成测试后，请检查：

- [ ] 测试文件位置和命名是否正确？
- [ ] 是否覆盖了所有分支？
- [ ] 是否测试了边界条件和错误情况？
- [ ] Mock 是否正确重置？
- [ ] 断言是否精确？
- [ ] 是否遵循 AAA 模式？
- [ ] 命名是否符合 `should ... when ...` 格式？
- [ ] 是否清理了副作用（定时器、fakeTimers）？
- [ ] TypeScript 类型是否正确，无 `any`？
- [ ] 导入排序是否正确（第三方 → 别名 → 相对）？
