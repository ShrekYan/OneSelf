---
name: common-commit
description: Use this skill when the user wants to generate Git commit messages following Conventional Commits specification. Triggers include "/commit" command, generating commit messages, or formatting git commits. Also use when reviewing or validating commit message format. Do NOT use for non-Git version control systems.
license: Complete terms in LICENSE.txt
---

# Git Commit 信息生成规范

## Overview

本 skill 用于生成符合 Conventional Commits 约定式提交规范的 Git 提交信息。通过分析当前 git status 中的文件改动，自动判断提交类型和影响范围，生成规范的 commit 信息。

## When to use this skill

- 用户输入 `/commit` 命令（带或不带参数）
- 用户需要生成或格式化 Git 提交信息
- 用户需要验证或审查 commit 信息格式
- 用户需要批量生成多个 commit 信息

## Inputs

- 可选的提交描述信息（通过 `/commit 描述` 传入）
- 当前 Git 仓库的文件改动状态

## Workflow

1. 运行 `git status` 获取当前已暂存（staged）的文件改动
2. 如果没有已暂存的文件，运行 `git add .` 将所有改动暂存
3. 分析每个文件的改动内容，判断提交类型和影响范围
4. 读取参考文档，按照规范生成提交信息
5. 展示生成的提交信息给用户预览
6. 确认后执行 `git commit` 完成提交

## Resources

| 资源 | 何时使用 |
|------|----------|
| `reference/commit-format.md` | 需要查询提交格式、type 类型和 scope 命名约定时 |
| `reference/writing-rules.md` | 需要查询 description、body、footer 的书写规则时 |
| `reference/project-rules.md` | 需要查询本项目特定规则和检查清单时 |
| `examples/commit-examples.md` | 需要参考完整 commit 示例时 |

## Output format

先展示生成的提交信息，等待用户确认后再执行 `git commit`。不要直接执行。

生成的提交信息格式遵循 `type(scope): description` 结构，具体规范参见 [reference/commit-format.md](reference/commit-format.md)。

## Validation

- [ ] 是否遵循 Conventional Commits 格式
- [ ] type 是否符合允许的类型
- [ ] description 是否简洁清晰（< 30 个汉字）
- [ ] 是否包含 Co-Authored-By 信息

## Constraints

- 只处理 Git 版本控制系统
- description 和 body/footer 必须使用中文
- 必须在用户确认后才能执行 git commit
- 不处理非代码文件的提交（如二进制文件）