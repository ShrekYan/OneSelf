# 代码注释规范

## JSDoc 快速参考

| 代码元素 | 规范要求 |
|----------|---------|
| **接口/类型** | 每个导出接口必须添加注释，**每个字段都要说明含义** |
| **组件函数** | 一句话说明组件用途，复杂组件需要示例 |
| **自定义 Hook** | 说明用途，标注每个参数和返回值，建议提供使用示例 |
| **工具函数** | 说明用途，标注每个参数和返回值类型 |
| **MobX Store** | 类说明整体用途，每个字段和方法说明作用 |

## JSDoc 示例

```typescript
/**
 * 格式化文章发布时间为相对时间
 * @param publishAt 发布时间 ISO 字符串
 * @param relative 是否返回相对时间，false 返回绝对日期
 * @returns 格式化后的时间字符串
 */
export const formatPublishTime = (
  publishAt: string,
  relative = true,
): string => {
  // 实现...
};
```

## JSX 注释规范

- ✅ **正确**：使用 `{/* 区块说明 */}` 格式，前后保留空格
- ✅ **推荐**：对分块结构（头部、列表、底部）添加说明
- ✅ **推荐**：复杂条件渲染说明判断条件
- ❌ **错误**：不要使用 `//` 或 `/* ... */` 在 JSX 中

## JSX 示例

```tsx
return (
  <div className={styles.container}>
    {/* 头部导航栏 */}
    <header className={styles.header}>
      <BackButton />
      <h1>{title}</h1>
    </header>

    {/* 内容列表 */}
    <div className={styles.content}>
      {list.map(item => (
        <ListItem key={item.id} data={item} />
      ))}
    </div>

    {/* 只有用户登录才显示收藏按钮 */}
    {isLogin && <FavoriteButton />}
  </div>
);
```

## 何时需要添加注释

✅ **必须添加注释：**
- 复杂业务逻辑：说明**为什么**这么做（不是怎么做）
- 处理边界特殊情况：说明处理了什么异常情况
- Hack 或 workaround：说明原因和解决了什么问题
- 复杂算法：说明整体思路

❌ **不需要添加注释：**
- 显而易见的简单代码（代码本身已经说清楚了）
- 好的命名本身就是文档，不要再重复说明
