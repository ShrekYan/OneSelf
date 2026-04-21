# 生成前端模块功能介绍文档命令

**触发**: `/frontend-module-doc [模块路径]`
- `模块路径`: 例如 `apps/web/src/pages/ArticleDetail` 或 `apps/web/src/components/LazyImage`
- 模块类型自动识别：`apps/web/src/pages/` → 页面级模块，`apps/web/src/components/` → 公共组件

**行为**: 生成前端 H5 特定模块的详细设计文档，包含组件结构图、数据流图、技术选型、方案详述，输出到 `/docs` 目录用于日后回顾学习设计决策。

---

## 执行流程

1. 确认前端模块路径，自动识别模块类型（页面/组件）
2. 分析模块代码结构、依赖关系和设计决策
3. 梳理组件结构、状态管理、API 依赖、样式方案
4. 按照前端 H5 规范生成完整 markdown 文档
5. 生成模块级别的 mermaid 组件结构图和数据流图
6. 创建 `/docs` 目录（如不存在）
7. 写入 `/docs/{module-name}-YYYYMMDD.md`
8. 输出生成结果和文件路径

---

include: ../skills/common/frontend-module-doc.md
