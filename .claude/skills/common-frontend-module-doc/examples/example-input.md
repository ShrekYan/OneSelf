# 示例输入

## 示例 1：页面级模块

```
/frontend-module-doc apps/web/src/pages/article-list
```

**输入说明**：
- 用户指定了模块路径 `apps/web/src/pages/article-list`
- 根据路径规则，这是一个页面级模块
- 需要生成完整的页面设计文档

---

## 示例 2：公共组件

```
/frontend-module-doc apps/web/src/components/ProductCard
```

**输入说明**：
- 用户指定了模块路径 `apps/web/src/components/ProductCard`
- 根据路径规则，这是一个公共组件
- 需要生成组件设计文档，重点说明 Props 接口

---

## 示例 3：完整命令格式

```
/frontend-module-doc [模块路径] [可选参数]
```

**参数说明**：
- `[模块路径]`：必填，指向前端模块的相对路径
- `--verbose`：可选，输出详细日志
- `--force`：可选，强制覆盖已有文档