---
title: 不只会聊天：Headless模式+Agent SDK，让它自己干活
slug: claude-code-headless-mode-agent-sdk
date: 2024-06-01
tags: [Claude Code, Headless, Agent SDK, 自动化]
---

# Claude Code 不只会聊天：Headless 模式 + Agent SDK，让它自己干活

你不在键盘前，它就不工作——这个限制，终于可以打破了。

## 一个扎心的事实

到今天为止，你跟 Claude Code 的交互方式一直是"对话"——你在终端里打字，它回答。你说"审查这个文件"，它审查。你说"写个组件"，它写。

这种方式很直觉，但它有一个本质限制：**你得在场。**

- 它不能凌晨 2 点自动扫描代码仓库然后把质量报告发到钉钉群

- 它不能在每次有人提 PR 的时候自动做一轮审查

- 它不能批量处理 100 个文件的文档生成

为了解决这些问题，Claude Code 提供了两种"脱离终端"的模式：**Headless 模式** 和 **Agent SDK**。

## 一、Headless 模式——一行命令，Claude 自动干活

最简单的用法，直接在命令行里给 Claude 一个指令：

```bash
claude -p "分析 src/app/page.tsx 的性能问题"
```

不需要交互界面，不需要你在旁边盯着，跑完直接出结果。

### 三种输出格式

```bash
# 纯文本——适合人类阅读
claude -p "列出项目中的 TODO 注释" --output-format text

# JSON——适合程序解析
claude -p "列出项目中的 TODO 注释" --output-format json

# Stream JSON——逐条流式输出，适合实时处理
claude -p "重构 ArticleList 组件" --output-format stream-json
```

### 关键参数一览

| 参数              | 作用                     | 示例                            |
| ----------------- | ------------------------ | ------------------------------- |
| `--output-format` | 输出格式                 | `text` / `json` / `stream-json` |
| `--max-turns`     | 最大执行轮次（控制成本） | `3`                             |
| `--allowedTools`  | 限制可用工具（控制安全） | `Read,Grep,Glob`                |
| `--model`         | 指定模型                 | `sonnet`                        |

### 实操：批量审查最近改过的文件

```bash
#!/bin/bash
# review-recent.sh

for file in $(git diff --name-only HEAD~5 -- '*.ts' '*.tsx'); do
  echo "🔍 审查: $file"
  claude -p "审查 $file 的代码质量，关注类型安全和性能隐患" \
    --output-format json \
    --max-turns 2 \
    --allowedTools Read,Grep,Glob
done
```

⚠️ 注意 `--allowedTools Read,Grep,Glob`——只给了只读权限。批量脚本里**绝对不要给写权限**，万一 Claude 理解错了意图自动改了你的代码，100 个文件全改错，你哭都来不及。

### 另一个实用场景：自动生成 Changelog

```bash
git log --oneline origin/main...HEAD | \
  claude -p "基于这些提交记录生成 Changelog，分类为：✨新功能 / 🐛Bug修复 / 🔧优化 / 📝文档" \
    --output-format text \
    --max-turns 1 > CHANGELOG.md
```

一行命令，Changelog 就有了。挂到 CI 里，每次发版前自动生成。

## 二、Agent SDK——用代码获得 Claude Code 的全部能力

Claude Code SDK 已正式更名为 **Claude Agent SDK**，包名从 `@anthropic-ai/claude-code` 改为 `@anthropic-ai/claude-agent-sdk`。

### 安装

```bash
# TypeScript
npm install @anthropic-ai/claude-agent-sdk

# Python
pip install claude-agent-sdk
```

### 核心就一个函数：`query()`

它接收一个 prompt，返回一个**异步迭代器**，你可以逐条消息处理 Claude 的输出：

```typescript
import { query } from '@anthropic-ai/claude-agent-sdk';

for await (const message of query({ prompt: '分析当前目录的项目结构' })) {
  if (message.type === 'assistant') {
    // Claude 的回复
    for (const block of message.message.content) {
      if (block.type === 'text') console.log(block.text);
    }
  }
  if (message.type === 'result') {
    console.log('完成:', message.result);
  }
}
```

`query()` 不是简单的"发请求→收回复"。它内部运行着一个完整的 Agent 循环——Claude 会自动调用工具（读文件、执行命令、搜索代码），观察结果，决定下一步，直到任务完成。你只需要消费这个流就行了。

### 关键配置项

```typescript
const result = query({
  prompt: '审查 src/app/api/ 下的所有 API 路由',
  options: {
    model: 'sonnet',
    permissionMode: 'bypassPermissions', // CI 环境跳过权限确认
    allowedTools: ['Read', 'Grep', 'Glob'], // 限制可用工具
    maxTurns: 5, // 最大执行轮次
    systemPrompt: '你是一个严格的代码审查专家...', // 自定义系统提示
    settingSources: ['project'], // 加载项目级配置
  },
});
```

几个要点：

- **`permissionMode`**：CI/CD 用 `bypassPermissions`（没人在终端前点"同意"）；本地开发用 `acceptEdits`（自动同意编辑）

- **`settingSources`**：默认空数组，SDK 模式下一切由代码控制；想复用项目的子代理和 Hooks 配置就设成 `["project"]`

- **`allowedTools`**：安全的第一道防线——审查任务只给 Read，生成任务可以给 Read + Write

### 实操：批量组件文档生成器

```typescript
import { query } from '@anthropic-ai/claude-agent-sdk';
import * as fs from 'fs';
import * as path from 'path';
import { glob } from 'glob';

const COMPONENTS_DIR = './src/components';
const OUTPUT_DIR = './docs/components';

async function generateDoc(filePath: string) {
  const name = path.basename(filePath, '.tsx');
  let docContent = '';

  for await (const msg of query({
    prompt: `阅读 ${filePath}，生成 Markdown 格式的组件文档，包含：概述、Props 表格、使用示例、注意事项。输出纯 Markdown。`,
    options: {
      model: 'sonnet',
      allowedTools: ['Read', 'Grep', 'Glob'],
      maxTurns: 3,
      permissionMode: 'bypassPermissions',
    },
  })) {
    if (msg.type === 'result') docContent = msg.result;
  }
  return docContent;
}

async function main() {
  const files = await glob(`${COMPONENTS_DIR}/**/*.tsx`, {
    ignore: ['**/*.test.tsx'],
  });
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  for (const file of files) {
    const name = path.basename(file, '.tsx');
    console.log(`📝 ${name}`);
    try {
      const doc = await generateDoc(file);
      fs.writeFileSync(path.join(OUTPUT_DIR, `${name}.md`), doc, 'utf-8');
      console.log(` ✅ 完成`);
    } catch (err) {
      console.error(` ❌ 失败:`, err);
    }
  }
}

main();
```

跑起来：

```
📝 ArticleCard
 ✅ 完成
📝 ArticleList
 ✅ 完成
📝 Header
 ✅ 完成
🎉 文档生成完成
```

你可以把这个脚本挂到 Git hook 上——每次有组件文件变更，自动更新文档。

**为什么这么设计？**

- `maxTurns: 3`：读文件（1轮）→ grep 引用（1轮）→ 生成输出（1轮），3 轮够了

- 只给 `Read/Grep/Glob`：文档生成器只需要"看"代码，不需要"改"代码

- 逐个处理而不是并行：每个 `query()` 都会启动一个完整的 Agent 进程，并行跑 12 个会消耗大量资源和 Token

## 三、怎么选？

| 维度       | Headless (CLI)                | Agent SDK                    |
| ---------- | ----------------------------- | ---------------------------- |
| 使用方式   | `claude -p "..."`             | `query({ prompt: "..." })`   |
| 适合场景   | Shell 脚本、简单自动化、CI/CD | 复杂工具、Web 服务、多轮对话 |
| 学习成本   | 低                            | 中                           |
| 灵活度     | 中                            | 高                           |
| 多轮对话   | 不支持                        | 支持                         |
| 自定义工具 | 不支持                        | 支持（MCP 集成）             |

**选择建议：**

- 能用 Headless 解决的 → 用 Headless（简单就是好）

- Headless 不够用了 → 上 Agent SDK

- 两者可以混用——Shell 脚本调 `claude -p`，复杂逻辑用 SDK

## 四、两条铁律：安全与成本

把 Claude Code 接入自动化流程，意味着它可能在没人看着的情况下运行。安全和成本的控制比交互模式更重要。

### 铁律一：按任务类型限制工具

| 任务类型               | 允许的工具                      | 额外措施                        |
| ---------------------- | ------------------------------- | ------------------------------- |
| 只读（审查/分析/文档） | `Read, Grep, Glob`              | —                               |
| 写入（代码生成/重构）  | `Read, Write, Edit, Grep, Glob` | 必须有 Git 版本控制，方便回滚   |
| 执行（运行测试/部署）  | `Read, Bash, Grep, Glob`        | 用 PreToolUse Hook 拦截危险命令 |

**永远不要：**

- ❌ `bypassPermissions` + 不限制 `allowedTools`

- ❌ 在没有版本控制的目录里运行写入任务

- ❌ 给自动化脚本访问生产数据库的权限

### 铁律二：用 `--max-turns` 控制成本

每一轮 Agent 循环都消耗 Token。一个失控的任务可能在你不知情的情况下烧掉大量费用。

```bash
# ❌ 危险：不限制轮次
claude -p "重构整个项目的类型系统"

# ✅ 安全：限制 5 轮
claude -p "重构整个项目的类型系统" --max-turns 5
```

经验值：简单审查 1-2 轮，文档生成 2-3 轮，复杂重构 5-8 轮。超过 10 轮的任务建议拆分成多个小任务。

## 总结

三个核心收获：

1. **Headless 模式**（`claude -p`）让 Claude Code 变成一个可以嵌入任何脚本和流水线的命令工具。三种输出格式（text/json/stream-json）覆盖了从人类阅读到程序解析的所有需求。`--max-turns` 和 `--allowedTools` 是自动化场景的两个必设参数。

2. **Agent SDK**（`@anthropic-ai/claude-agent-sdk`）提供了完整的编程接口。核心函数 `query()` 返回异步迭代器，你可以逐条消息处理 Claude 的输出。TypeScript 和 Python 两个版本 API 几乎一致，选你项目的主语言就行。

3. **从对话驱动到代码驱动是一次质变。** 你可以构建自己的 AI 开发工具——文档生成器、代码质量仪表盘、自动化审查系统——Claude Code 变成了你工具箱里的一个可编程组件。

不再是"你问它答"，而是"你定规则，它自己跑"。

这才是 AI 编程助手的正确打开方式。
