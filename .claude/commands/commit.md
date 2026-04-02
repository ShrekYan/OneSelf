# Git 提交信息生成命令

**触发**: `/commit` （不带参数）或 `/commit 描述信息`
**行为**: 读取当前 `git status` 中的改动，分析文件变更，按照 [.claude/skills/commit-msg.md](.claude/skills/commit-msg.md) 规范生成符合 Conventional Commits 的提交信息，然后执行 `git commit`。

---

## 执行流程

1. 运行 `git status` 获取当前已暂存（staged）的文件改动
2. 如果没有已暂存的文件，运行 `git add .` 将所有改动暂存
3. 分析每个文件的改动内容，判断提交类型（`feat`/`fix`/`refactor` 等）和影响范围（scope）
4. 严格按照 `.claude/skills/commit-msg.md` 定义的规范生成提交信息
5. 展示生成的提交信息给用户预览
6. 确认后执行 `git commit` 完成提交

---

## 规范要求

必须严格遵循 [commit-msg.md](.claude/skills/commit-msg.md)：

- 格式：`type(scope): description`
- `type` 必须是允许的英文小写
- `description` 必须中文，动词开头，不超过 30 字，不能以句号结尾
- 必须添加 `Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>`
- 复杂改动需要 body 说明原因

---

## 输出要求

先展示生成的提交信息，等待用户确认后再执行 `git commit`。不要直接执行。
