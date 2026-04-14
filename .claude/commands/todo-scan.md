# TODO 扫描命令

**触发**: `/todo-scan`

**行为**: 扫描整个项目中所有 `TODO` / `FIXME` / `XXX` 标记，整理输出待办清单，方便清理和追踪。

---

## 执行流程

1. 使用 ripgrep 搜索整个项目中包含 TODO/FIXME/XXX 的所有行
2. 排除不需要搜索的目录（node_modules, .git, .claude, dist, build 等）
3. 按文件路径排序整理结果
4. 统计总数，输出结构化清单
5. 显示文件路径、行号、注释内容
6. 给出清理建议

---

include: ../skills/common/todo-scan.md
