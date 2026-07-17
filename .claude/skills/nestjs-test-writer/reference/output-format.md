# 输出格式

## 测试覆盖说明

| 方法 | 覆盖场景 |
|------|----------|
| `methodName1` | 成功场景 / 记录不存在异常 |
| `methodName2` | 成功场景 / 参数验证失败 |

## Mock 说明

- `XxxService`：mock 所有公共方法，隔离依赖
- `PrismaService`：mock 对应模型操作，不连接真实数据库

## 运行测试

```bash
npm run test -- src/module/filename.spec.ts
npm run test
npm run test:cov
```
