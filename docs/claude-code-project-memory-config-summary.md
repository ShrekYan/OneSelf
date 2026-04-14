# Claude Code 项目记忆配置回顾

## 背景

我们配置了 **项目记忆自动加载 + 自然语言添加** 功能，让 Claude Code 记住项目中踩过的坑，每次写代码自动避开。

---

## 最终效果

| 功能 | 效果 |
|------|------|
| **自动加载** | 每次启动 Claude Code 对话，自动加载 `.claude/project-memory.md` 中的所有错误教训到上下文 |
| **自然语言添加** | 只需要说一句 `添加到项目记忆：[描述问题]`，Claude 自动整理格式追加到文件 |

---

## 配置了什么

### 1. `CLAUDE.md` 末尾添加了两段内容

```markdown
## 🧠 项目记忆规则

当用户说"添加到项目记忆"，请将用户描述的踩坑教训按照以下要求处理：

1. **目标文件**: `.claude/project-memory.md`
2. **格式要求**: 在文件末尾追加，遵循现有格式：
   ```markdown
   ---

   ## 问题标题（一句话概括）

   ### 错误场景
   什么场景下遇到这个错误

   ### 错误现象
   具体遇到了什么问题，有什么错误表现

   ### 原因分析
   分析错误原因

   ### 正确解决方法
   展示正确的代码/配置/操作步骤

   ### 记录信息
   **记录日期**: YYYY-MM-DD
   **错误原因**: 一句话概括根本原因

   ---
   ```
3. **处理流程**:
   - 先读取现有 `.claude/project-memory.md` 查看当前格式
   - 根据用户描述，整理成标准格式（补全缺失必要信息，但不要编造内容）
   - 追加到文件末尾
   - 保持原有内容不变

## 项目记忆自动加载：

Contents of .claude/project-memory.md:
```

### 2. `.claude/project-memory.md` 格式标准

已有的两条记录作为格式参考：

- CSS 命名规范错误 - 要求所有 class 都加页面/组件前缀
- Claude Code 命令路径规则 - `commands/` vs `skills/` 目录区别

---

## 使用方法

### 添加新的项目记忆

**直接说自然语言**，不需要记命令：

```
添加到项目记忆：我刚才遇到一个问题：Prisma 事务中使用 $queryRaw 时，占位符要用 $1 而不是 ?，原因是 Prisma PostgreSQL 使用编号占位符语法，正确写法是 SELECT * FROM table WHERE id = $1。
```

Claude 会自动：
1. 读取当前文件确认格式
2. 整理成标准 Markdown 格式
3. 追加到文件末尾

### 验证自动加载

下次新建对话时，系统提示会显示：

```
Contents of .claude/project-memory.md:
# 项目开发记忆 - 错误记录
...
```

说明已经自动加载成功。

---

## 概念澄清

| 概念 | 自动记忆 (Auto Memory) | 项目记忆 (Project Memory) |
|------|------------------------|---------------------------|
| 存储位置 | `~/.claude/projects/<项目路径>/memory/MEMORY.md` | `<项目根目录>/.claude/project-memory.md` |
| 维护者 | Claude Code 自动维护 | 开发者手动维护 |
| 加载方式 | 每次对话自动加载 | 通过 `CLAUDE.md` 的 `Contents of` 指令自动加载 |
| 版本控制 | ❌ 不进入 Git | ✅ 进入 Git，团队共享 |
| 用途 | 个人踩坑记录，让 Claude 记住你的习惯 | 团队共享错误教训，所有人一起避坑 |

---

## 关键点总结

1. **想要 Claude 每次自动记住** → 靠 `CLAUDE.md` 里加 `Contents of .claude/project-memory.md` 实现
2. **想要自然语言添加** → 在 `CLAUDE.md` 里写好规则，Claude 就能听懂指令
3. **不要斜杠命令** → 自然语言更方便，符合用户习惯
4. **格式统一** → 所有教训都用相同的标题层级结构，方便阅读和维护

---

## 相关文档

- [Claude Code 记忆系统使用指南](./claude-code-memory-system-guide.md) - 完整的概念说明
- `.claude/project-memory.md` - 实际存放错误教训的文件
- `CLAUDE.md` - 项目根目录，包含规则和自动加载配置
