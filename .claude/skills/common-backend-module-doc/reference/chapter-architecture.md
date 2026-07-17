# 章节 3：模块架构设计

> 本文件定义模块架构设计章节的内容规范，包含 mermaid 架构分层图。

---

### 3. 模块架构设计

必须生成 **mermaid 架构分层图**，展示 Controller → Service → Repository → DB 分层结构。

参考模板：[templates/architecture-diagram.mmd](templates/architecture-diagram.mmd)

**规范要求**：
- 使用 `flowchart TD`
- 每个分层用颜色区分（按上面模板的类定义）
- 清晰展示调用方向
- 如果有多个 Service/Repository，都展示出来