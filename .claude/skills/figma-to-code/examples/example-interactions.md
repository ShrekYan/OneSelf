# 示例交互

本文件列举本 skill 的典型用户表达与处理路径，供执行时参考。

---

## 示例 1：将 Figma 设计转为新页面

**用户表达**：

> 把这个 Figma URL 转成一个新的文章详情页。

**处理路径**：

1. 前置确认：提取 Figma URL、产出物类型（页面）、产出物地址
2. 拉取上下文：读取 [reference/figma-context-fetch.md](../reference/figma-context-fetch.md)，调用 Figma MCP
3. 路由到页面规范：读取 [../h5-frontend-developer/reference/page-directory-structure.md](../../h5-frontend-developer/reference/page-directory-structure.md)
4. 按页面四文件结构落地代码

---

## 示例 2：将 Figma 设计转为可复用组件

**用户表达**：

> 根据 Figma 设计做一个可复用的文章卡片组件。

**处理路径**：

1. 前置确认：提取 Figma URL、产出物类型（组件）、产出物地址
2. 拉取上下文：读取 [reference/figma-context-fetch.md](../reference/figma-context-fetch.md)，调用 Figma MCP
3. 路由到组件规范：读取 [../../rules/frontend-components.md](../../../rules/frontend-components.md)
4. 按组件目录结构落地代码

---

## 示例 3：涉及新接口的模块转换

**用户表达**：

> Figma 上这个模块用到了新接口。

**处理路径**：

1. 前置确认：标记「涉及新接口」为「是」
2. 拉取上下文并识别新接口字段
3. 同时启用 [../h5-frontend-developer/reference/rules/frontend-api-design.md](../../h5-frontend-developer/reference/rules/frontend-api-design.md)
4. 先定义 API 类型，再生成页面/组件代码
