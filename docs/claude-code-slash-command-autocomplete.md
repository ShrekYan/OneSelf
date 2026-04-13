# Claude Code 自定义斜杠命令补全不显示问题排查

## 问题描述

在 Claude Code 中自定义了斜杠命令 `/full-test3`，将文件放在 `.claude/skills/full-test3.md`，但输入 `/full-tes` 后**没有出现补全提示**。

---

## 问题根因

**Claude Code 只扫描 `.claude/commands/` 目录来生成斜杠命令补全，不会扫描 `.claude/skills/` 目录。**

| 目录 | 是否扫描补全 | 作用 |
|------|-------------|------|
| `.claude/commands/` | ✅ **扫描** → 出现在补全列表 | Claude Code 启动时扫描这里，提取 `name` 字段显示给用户 |
| `.claude/skills/` | ❌ **不扫描** → 不会出现在补全 | 用户自己分类组织管理技能源码，Claude 不会主动扫描 |

---

## 正确目录分工

```
.claude/
├── commands/          # 👈 必须放这里！Claude 扫描 → 出现在补全列表
│   ├── full-test3.md -> ../skills/full-test3.md  (软链接)
│   └── full-frontend-review.md -> ../skills/full-frontend-review.md
└── skills/            # 存放技能源码文档，便于分类管理
    ├── full-test3.md
    └── full-frontend-review.md
```

---

## 解决方法

### 方案一：软链接（推荐，源码统一管理）

```bash
# 在项目根目录执行
mkdir -p .claude/commands
ln -sf ../skills/your-command.md .claude/commands/your-command.md
```

优点：
- ✅ 源码只存一份，在 `skills/` 中分类管理
- ✅ 修改源码自动同步，不需要两处维护
- ✅ Claude 能扫描到，补全正常显示

### 方案二：直接复制文件

```bash
cp .claude/skills/your-command.md .claude/commands/your-command.md
```

缺点：需要在两处维护，修改时要同步更新。

---

## 前置检查：frontmatter 格式

即使在正确目录，也要保证 frontmatter 的 `name` 和文件名一致：

```yaml
---
name: full-test3  # ✅ name 必须等于文件名 full-test3.md
description: 你的命令描述
---
```

规则：
- 文件名：`{name}.md`
- frontmatter: `name: {name}`
- 触发命令：`/{name}`

三者必须一致，否则补全可能不正常。

---

## 验证修复

创建好之后，**重启 Claude Code CLI**，让它重新扫描 `commands/` 目录。重启后输入命令前缀就能看到补全了。

---

## 本例修复记录

**问题文件：**
- 错误位置：`.claude/skills/full-test3.md` ✓ 源码正确，但找不到
- 修复操作：在 `.claude/commands/` 创建软链接 → `.claude/commands/full-test3.md -> ../skills/full-test3.md`

**修复后：**
- ✅ 输入 `/full-tes` → 补全提示显示 `/full-test3`
- ✅ 触发 `/full-test3` 命令正常执行

---

## 关键要点总结

1. 📌 **Claude 只认 `.claude/commands/`**，这是唯一扫描路径
2. 🔗 **推荐用软链接**，兼顾分类管理和补全显示
3. 📝 **name 必须和文件名一致**，否则补全不匹配
4. 🔄 **修改后需要重启 Claude**，才会重新扫描
