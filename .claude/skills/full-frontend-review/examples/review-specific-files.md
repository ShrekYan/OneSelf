# 示例：检查指定页面和 API 模块

## 用户输入

```
/full-frontend-review apps/web/src/pages/ArticleList apps/web/src/api/article
```

## 执行过程

1. 将两个路径同时传递给三个 Agent。
2. 代码质量 Agent 检查页面组件与 API 模块规范。
3. 安全 Agent 检查接口调用与输入处理。
4. 性能 Agent 检查页面渲染与数据获取性能。
5. 整合结果。

## 预期输出

- 针对指定文件 / 目录的问题清单。
- 按文件组织，便于定位修复。
