# 项目开发记忆 - 错误记录

## CSS 命名规范错误记录

### 错误场景
新建页面和组件时，**根容器 class 直接使用通用名称 `.container`，没有添加页面/组件名称作为前缀**。

### 正确规范
> 在 CSS Modules 中，虽然不会发生命名冲突，但是**所有 class 名称都应该使用页面/组件名称作为前缀**，保持语义清晰：
> - 页面 `Notifications` → 根容器 `.notificationsContainer`，所有其他 class 如 `.notificationsHeader`, `.notificationsBackBtn`, 等等
> - 组件 `NotificationListItem` → 根容器 `.notificationListItemContainer`，所有其他 class 如 `.notificationListItemAvatar`, `.notificationListItemContent`, 等等

### 原因
这样做可以：
1. 保持样式语义化，一眼就能看出这个 class 属于哪个组件
2. 方便调试和查找
3. 避免在开发者工具中看到一堆通用的 `.container` `.header` `.content` 无法区分

### 示例
❌ 错误写法：
```scss
.container { ... }
.header { ... }
.content { ... }
```

✅ 正确写法：
```scss
.notificationsContainer { ... }
.notificationsHeader { ... }
.notificationsContent { ... }
```

---

**记录日期**: 2026-03-27
**错误原因**: 沿袭了其他项目习惯，忘记本项目要求所有 class 都加前缀
