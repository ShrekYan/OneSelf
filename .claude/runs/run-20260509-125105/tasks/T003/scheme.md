# T003 执行方案

## 任务概述
- 任务 ID：T003
- 任务名称：实现数字工具函数
- 模块：工具函数

## 前置依赖检查
✅ 无任何前置依赖

## 实现方案详情
- 技术选型：TypeScript 严格模式
- 核心实现思路：实现数字格式化、范围限制、精度处理等常用工具函数

## 将修改/新增的文件
- ✅ src/utils/number/index.ts (新增)

## 完整代码实现

### 📄 src/utils/number/index.ts
```typescript
/**
 * 格式化数字，添加千位分隔符
 */
export function formatNumber(num: number, locale = 'zh-CN'): string {
  return num.toLocaleString(locale);
}

/**
 * 限制数字在指定范围内
 */
export function clamp(num: number, min: number, max: number): number {
  return Math.min(Math.max(num, min), max);
}

/**
 * 数字四舍五入到指定小数位数
 */
export function roundTo(num: number, decimals: number): number {
  const factor = Math.pow(10, decimals);
  return Math.round(num * factor) / factor;
}

/**
 * 数字向下取整到指定小数位数
 */
export function floorTo(num: number, decimals: number): number {
  const factor = Math.pow(10, decimals);
  return Math.floor(num * factor) / factor;
}

/**
 * 数字向上取整到指定小数位数
 */
export function ceilTo(num: number, decimals: number): number {
  const factor = Math.pow(10, decimals);
  return Math.ceil(num * factor) / factor;
}

/**
 * 检查数字是否在指定范围内
 */
export function inRange(num: number, min: number, max: number): boolean {
  return num >= min && num <= max;
}
```

## 注意事项与风险点
- 纯工具函数，无副作用，低风险
- 注意浮点数精度问题

## 质量检查要点
- TypeScript 严格模式检查
- ESLint 规范检查
