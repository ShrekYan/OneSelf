# TODO / FIXME 扫描报告

## 统计

- **扫描范围**: `项目根目录`
- **发现条目**: {total} 个

---

## 待办清单

按文件路径排序：

{foreach file in sorted_files}

### `{file_path}`

| 行号 | 类型 | 内容 |
|------|------|------|
{foreach match in file.matches}
| {line} | {type} | {content} |
{end}
{end}

---

## 清理建议

1. 已完成的 TODO 及时删除
2. 长期未处理的 TODO 考虑安排进迭代
3. 紧急的 FIXME 优先处理
