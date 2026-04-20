# claude-mem 项目记忆功能 - 学习总结

## 什么是 claude-mem

`claude-mem` 是 Claude Code 的**自动项目记忆功能**，用于持久化存储项目特定的开发经验和规范。

### 核心原理
- 在 `~/.claude/projects/[项目路径]/memory/MEMORY.md` 文件中存储记忆
- **每次对话开始时自动加载**，让 Claude 记住你的项目规则
- 跨对话保持记忆，不会因为对话结束而丢失

---

## claude-mem 的作用

| 作用 | 说明 |
|------|------|
| **持久化经验** | 把踩过的坑和解决方案永久保存下来 |
| **自动上下文** | 每次对话自动加载项目规范，不用重复解释 |
| **统一规范** | 保持开发风格一致，遵循项目特定规则 |
| **提高效率** | 避免重复踩相同的坑，减少调试时间 |

---

## 记忆文件中存储什么内容

你的项目记忆文件已经存储了这些内容：

```
MEMORY.md
├── 项目关键信息 - 技术栈、构建工具、设计稿宽度
├── 个人偏好 - 开发者的个人习惯偏好
├── 开发规范要点 - 项目特定写法规范
├── 经验教训 - 遇到过的问题和正确解法
└── 常用工具速查 - 常用命令、重要文件路径
```

---

## 实际示例 - 你的项目中已记录的经验

### 示例 1：MobX useLocalObservable 写法规范

```
❌ 错误写法（箭头函数 this 绑定错误）：
export function useProfileStore() {
  const store = useLocalObservable(() => ({
    loading: false,
    setLoading: (state: boolean) => {
      this.loading = state; // this 指向错误，修改不生效
    },
  }));
  return store;
}

✅ 正确写法（使用方法语法）：
export function useProfileStore() {
  const store = useLocalObservable(() => ({
    loading: false,
    setLoading(state: boolean) {
      this.loading = state; // this 正确绑定到 store
    },
  }));
  return store;
}
```

**为什么记住这个？** 避免下次再犯同样的错误，Claude 会自动提示正确写法。

---

### 示例 2：Prisma 模型命名规范

```
✅ 正确：model Articles  (PascalCase 首字母大写)
❌ 错误：model articles (全小写)

✅ 正确访问方式：
this.prisma.articles.findMany(...)
// 不需要 as any 类型转换
```

---

## 如何添加新记忆

**非常简单，只需要说一句话：**

```
"把这个问题添加到项目记忆"
```

然后 Claude 会：
1. 自动读取现有记忆文件格式
2. 按照规范整理你的问题和解决方案
3. 追加到文件末尾
4. 保持原有内容不变

### 记忆格式（自动处理，你不用记）

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

---

## 你的项目是否需要 claude-mem？

### ✅ 需要使用的情况

- [x] 中大型项目（你的是 Monorepo 全栈项目 ✅）
- [x] 多技术栈（前端 React + MobX + 后端 NestJS + Prisma ✅）
- [x] 有特定项目规范 ✅
- [x] 团队开发或长期维护项目 ✅

### ❌ 不需要使用的情况

- 一次性临时脚本
- 非常小的项目（只有几个文件）
- 测试试用项目

---

## 最佳实践建议

1. **遇到问题解决后立刻记录** - 不要等忘了再记
2. **保持简洁** - 只记录关键信息，代码示例要短小精悍
3. **按问题分类** - 每个问题一个章节，方便查找
4. **定期整理** - 过时的错误解法及时更新

---

## 记忆文件位置

**你的项目记忆文件路径：**
```
/Users/yanjinqiang/.claude/projects/-Users-yanjinqiang-WebstormProjects-claude/memory/MEMORY.md
```

随时可以打开查看和编辑。

---

## 总结

- `claude-mem` = Claude Code 的项目自动记忆
- 你的项目**已经在用了**，并且已经记录了宝贵经验
- **继续使用**，每次解决新问题后添加到记忆
- 长期积累下来，开发效率会显著提升
