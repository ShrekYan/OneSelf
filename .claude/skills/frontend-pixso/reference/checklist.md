# 生成完成后必须检查清单

## Pixso 特有检查项（必须全部通过）
- [ ] **结构层级**：HTML 层级完全匹配 DSL 树结构吗？
- [ ] **元素顺序**：每个容器内子元素顺序和 DSL 一致吗？
- [ ] **尺寸**：所有宽度高度都是缩放后的整数像素吗？
- [ ] **字体大小**：每个文字节点的字体大小都从 DSL 提取并正确缩放了吗？
- [ ] **颜色**：背景色和文字颜色都从 DSL 提取了吗？使用正确十六进制吗？
- [ ] **位置关系**：负margin、圆角覆盖等特殊定位正确实现了吗？
- [ ] **设计缩放**：所有尺寸已正确缩放到 750px 设计稿基准吗？

## 通用规范检查
- [ ] 是否已读取并遵循 [H5 frontend developer skill](../h5-frontend-developer/SKILL.md)？
- [ ] 是否按该 skill 的 Additional resources 读取了相关 supporting files？
- [ ] 是否遵循 React + TypeScript + MobX + SCSS Modules 规范？
- [ ] 是否遵循 750px 设计稿、px 自动转 vw、禁止手写 vw？
- [ ] 是否遵循页面拆分、组件拆分、API 调用与样式命名规范？