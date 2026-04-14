# 生成后端模块功能介绍文档命令

**触发**: `/backend-module-doc [模块路径]`

**行为**: 生成后端 NestJS 特定模块的详细设计文档，包含架构图、技术选型、方案详述、数据库性能分析，输出到 `backend/docs` 目录用于日后回顾学习。

---

## 执行流程

1. 确认后端模块路径和功能范围
2. 分析模块代码结构、依赖关系和设计决策
3. 梳理数据库访问和性能考虑
4. 按照 NestJS 后端规范生成完整 markdown 文档
5. 生成模块级别的 mermaid 架构图和序列图
6. 写入 `backend/docs/{module-name}-YYYYMMDD.md`
7. 输出生成结果和文件路径

---

include: ../skills/common/backend-module-doc.md
