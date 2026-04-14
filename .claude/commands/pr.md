# PR 描述生成命令

**触发**: `/pr`

**行为**: 自动分析当前分支相对于 main 的所有 commit，生成符合项目规范的 Pull Request 描述，包括标题、改动清单、检查清单。

---

## 执行流程

1. 运行 `git branch --show-current` 获取当前分支名称
2. 运行 `git log main..HEAD --oneline` 获取所有未合并的 commit
3. 如果当前分支是 main，提示用户切换到特性分支
4. 如果没有未合并的 commit，提示用户先提交改动
5. 分析所有 commit，按照 type 分类整理
6. 根据分类自动生成 PR 标题（提取主类型）
7. 按照规范模板生成完整 PR 描述
8. 展示生成结果供用户预览和复制

---

include: ../skills/common/pr.md
