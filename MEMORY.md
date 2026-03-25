# Claude Code 开发记忆 - 项目特定规则

## SCSS 变量引入规则

**项目使用旧版 `@import` 语法，而不是 `@use`**

❌ 错误写法：
```scss
@use '@/styles/variables.scss' as *;
```

✅ 正确写法：
```scss
@import '@/styles/variables.scss';
```

已多次重复犯这个错误，必须记住。

