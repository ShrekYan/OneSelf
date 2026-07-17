# 代码层面性能检测规则

## T0 严重问题检测清单

- [ ] **不必要的嵌套循环**：算法复杂度 O(n²)，数据量大时非常慢
- [ ] **正则表达式陷阱**：容易引发灾难性回溯的正则模式
- [ ] **同步读取大文件**：`fs.readFileSync` 读取大文件阻塞事件循环

## T1 中等问题检测清单

- [ ] **重复计算相同结果**：相同输入每次都重新计算，没有缓存
- [ ] **数组方法使用不当**：频繁用 `unshift`/`splice` 导致数组重排

## T2 优化检测清单

- [ ] **可以懒加载没有懒加载**：模块启动就加载不常用的数据
- [ ] **字符串拼接使用 `+=` 在循环中**：现代 JS 已经优化，问题不大但仍可优化

## 典型问题示例

**O(n²) 嵌套循环**：

```typescript
// ❌ O(n²) 复杂度
function findDuplicates(items: string[]) {
  const duplicates: string[] = [];
  for (let i = 0; i < items.length; i++) {
    for (let j = i + 1; j < items.length; j++) {
      if (items[i] === items[j]) duplicates.push(items[i]);
    }
  }
  return duplicates;
}

// ✅ O(n) 复杂度
function findDuplicates(items: string[]) {
  const seen = new Set<string>();
  const duplicates = new Set<string>();
  for (const item of items) {
    if (seen.has(item)) duplicates.add(item);
    else seen.add(item);
  }
  return Array.from(duplicates);
}
```

## 评分标准

| 等级 | 标准 |
|------|------|
| 100 | 代码性能优秀，无低效算法 |
| 80 | 基本合理，少量优化空间 |
| 60 | 存在明显代码性能问题 |
| 0 | 严重性能问题，需要立即修复 |
