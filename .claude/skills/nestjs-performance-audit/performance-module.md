# 模块架构检测规则

## T0 严重问题检测清单

- [ ] **循环依赖**：模块之间循环依赖，可能导致运行时不确定行为
- [ ] **全局模块过度使用**：把所有模块都注册为全局，增加启动时间和内存
- [ ] **提供者作用域不当**：请求级依赖应该用 `REQUEST` 作用域却用了默认 `SINGLETON`

## T1 中等问题检测清单

- [ ] **模块导入冗余**：导入不需要的模块，增加依赖耦合
- [ ] **过度使用动态模块**：可以静态导入的场景不必要用动态模块

## T2 优化检测清单

- [ ] **可以共享的服务没有抽成共享模块**：重复定义相同服务

## 典型问题示例

**作用域配置不当**：

```typescript
// ❌ 默认 SINGLETON，但服务持有请求级状态
@Injectable()
export class RequestContext {
  private requestId: string;
  setRequestId(id: string) { this.requestId = id; }
}

// ✅ 请求级作用域
@Injectable({ scope: Scope.REQUEST })
export class RequestContext {
  private requestId: string;
  setRequestId(id: string) { this.requestId = id; }
}
```

## 评分标准

| 等级 | 标准 |
|------|------|
| 100 | 模块架构清晰，无循环依赖 |
| 80 | 基本合理，少量优化空间 |
| 60 | 存在明显架构问题 |
| 0 | 严重架构问题，需要立即修复 |
