# 模块功能文档 - NestJS Compression 中间件配置

## 📋 模块概述

为所有后端微服务统一配置 `compression` Express 中间件，实现 JSON 响应的 gzip/deflate 压缩，显著减少网络传输体积，提升 API 响应速度。

---

## 🎯 功能特性

### 核心功能

- ✅ **JSON 响应压缩**：自动压缩所有 JSON 格式的 API 响应
- ✅ **多格式支持**：同时支持 gzip 和 deflate 压缩算法
- ✅ **智能阈值**：仅压缩大于 1KB 的响应（小文件压缩收益不高）
- ✅ **类型过滤**：自动跳过图片等已压缩的二进制格式

### 性能参数

| 参数        | 值          | 说明                                   |
| ----------- | ----------- | -------------------------------------- |
| `threshold` | `1024` 字节 | 仅压缩大于 1KB 的响应                  |
| `level`     | `6`         | 压缩级别（1-9），平衡压缩率和 CPU 消耗 |
| 预期压缩率  | 60%-80%     | JSON 文本的典型压缩效果                |

---

## 📁 适用服务

| 服务名称     | 路径                     | 端口 |
| ------------ | ------------------------ | ---- |
| auth-service | `services/auth-service/` | 8889 |
| backend      | `services/backend/`      | 8888 |
| log-service  | `services/log-service/`  | 8890 |

---

## 🔧 技术实现

### 配置位置

- **文件**：每个服务的 `src/main.ts`
- **位置**：在 `cookieParser` 之后，`useGlobalPipes` 之前

### 代码示例

```typescript
import compression from 'compression';

// 响应压缩中间件：压缩大于 1KB 的 JSON/文本响应，减少传输体积
app.use(
  compression({
    threshold: 1024,
    level: 6,
    filter: (req, res) => {
      // 跳过已压缩的二进制格式
      if (String(res.getHeader('Content-Type') || '').includes('image/')) {
        return false;
      }
      return compression.filter(req, res);
    },
  }),
);
```

---

## ✅ 验证方法

### 1. 编译验证

```bash
cd services/auth-service && npm run build
cd services/backend && npm run build
cd services/log-service && npm run build
```

### 2. 运行时验证

启动服务后，使用 curl 验证响应头：

```bash
curl -I -H "Accept-Encoding: gzip, deflate" http://localhost:8888/api/health
```

**预期响应头包含**：

```
Content-Encoding: gzip
```

---

## 📌 设计决策

### 为什么不在 app.module.ts 中配置？

| 方案                                   | 优点                                                | 缺点                           |
| -------------------------------------- | --------------------------------------------------- | ------------------------------ |
| **main.ts + app.use()**                | 代码简洁，一行搞定，符合 Express 原生中间件使用方式 | 不支持 Nest 依赖注入           |
| **app.module.ts + MiddlewareConsumer** | 支持依赖注入，可精细控制路由                        | 需要创建额外的包装类，代码冗余 |

**最终选择**：`main.ts` 配置，因为 `compression` 是纯基础设施级中间件，不需要依赖注入。

---

## ⚠️ 注意事项

### 1. CPU 开销

- 压缩会增加服务器 CPU 使用率
- 缓解措施：使用 level 6 平衡配置，设置 1KB 阈值避免压缩小文件

### 2. 与反向代理的关系

- 如果部署环境中 Nginx 已启用压缩，可能造成重复压缩
- Nginx 层通常是更好的压缩点（可缓存压缩结果）
- 若后续发现重复压缩，可在应用层关闭或调整配置

### 3. Swagger 静态资源

- Swagger JSON 文档会被压缩（有益）
- 图片等静态资源会被自动跳过

---

## 📚 相关文档

- [compression 官方文档](https://github.com/expressjs/compression)
- [NestJS 中间件文档](https://docs.nestjs.com/middleware)
