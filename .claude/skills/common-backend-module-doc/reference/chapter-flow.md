# 章节 4：核心流程

> 本文件定义核心流程章节的内容规范，包含 mermaid 序列图。

---

### 4. 核心流程

必须生成 **mermaid 序列图**，展示一次核心请求的完整调用流程。

参考模板：[templates/flow-sequence.mmd](templates/flow-sequence.mmd)

**规范要求**：
- 使用 `sequenceDiagram`
- 参与者按调用顺序排列
- 使用 `alt` 分支处理不同情况（如缓存命中/未命中）
- 只展示核心流程，不要太复杂