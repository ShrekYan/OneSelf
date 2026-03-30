/**
 * Pixso DSL 解析与尺寸归一化
 * 将原始 DSL 缩放到项目标准 750px 设计稿
 */

/**
 * 尺寸缩放选项
 */
export interface ScaleOptions {
  /** 目标设计稿宽度，默认 750px */
  targetWidth: number;
  /** 是否四舍五入到整数像素，默认 true */
  roundToInt: boolean;
}

/**
 * 矩形尺寸
 */
export interface Dimensions {
  width: number;
  height: number;
  x: number;
  y: number;
}

/**
 * 缩放尺寸到目标设计稿宽度
 * @param original 原始尺寸
 * @param originalDesignWidth 原始设计稿宽度
 * @param options 缩放选项
 */
export function scaleDimensions(
  original: { width: number; height: number; x?: number; y?: number },
  originalDesignWidth: number,
  options: ScaleOptions = { targetWidth: 750, roundToInt: true }
): Dimensions {
  const { targetWidth, roundToInt } = options;
  const scale = targetWidth / originalDesignWidth;

  const result: Dimensions = {
    width: scaleValue(original.width, scale, roundToInt),
    height: scaleValue(original.height, scale, roundToInt),
    x: original.x !== undefined ? scaleValue(original.x, scale, roundToInt) : 0,
    y: original.y !== undefined ? scaleValue(original.y, scale, roundToInt) : 0,
  };

  return result;
}

/**
 * 缩放单个数值
 */
function scaleValue(value: number, scale: number, roundToInt: boolean): number {
  const scaled = value * scale;
  return roundToInt ? Math.round(scaled) : scaled;
}

/**
 * 颜色格式转换 - Pixso 格式转 CSS
 * Pixso: { r: 0-1, g: 0-1, b: 0-1, a: 0-1 }
 * CSS: rgba(r,g,b,a) 或 #hex
 */
export function formatColor(color: {
  r: number;
  g: number;
  b: number;
  a?: number;
}): string {
  const r = Math.round(color.r * 255);
  const g = Math.round(color.g * 255);
  const b = Math.round(color.b * 255);
  const a = color.a ?? 1;

  if (a === 1) {
    // 不透明转十六进制
    const hex = ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    return `#${hex}`;
  }

  // 带透明度
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

/**
 * 解析 Pixso DSL 中的文本样式
 */
export interface ParsedTextStyle {
  fontSize: number; // 已经缩放好，单位 px
  fontWeight: number;
  fontFamily: string;
  color: string; // CSS 颜色
  lineHeight: number;
  letterSpacing: number;
  textAlign: 'left' | 'center' | 'right' | 'justify';
}

/**
 * 解析并缩放文本样式
 */
export function parseTextStyle(
  dslStyle: {
    fontSize?: number;
    fontWeight?: number;
    fontFamily?: string;
    color?: { r: number; g: number; b: number; a?: number };
    lineHeight?: number;
    letterSpacing?: number;
    textAlign?: string;
  },
  scale: number,
  roundToInt: boolean = true
): Partial<ParsedTextStyle> {
  const result: Partial<ParsedTextStyle> = {};

  if (dslStyle.fontSize !== undefined) {
    result.fontSize = roundToInt
      ? Math.round(dslStyle.fontSize * scale)
      : dslStyle.fontSize * scale;
  }

  if (dslStyle.fontWeight !== undefined) {
    result.fontWeight = dslStyle.fontWeight;
  }

  if (dslStyle.fontFamily !== undefined) {
    result.fontFamily = dslStyle.fontFamily;
  }

  if (dslStyle.color !== undefined) {
    result.color = formatColor(dslStyle.color);
  }

  if (dslStyle.lineHeight !== undefined) {
    // lineHeight 是倍数，不需要缩放
    result.lineHeight = dslStyle.lineHeight;
  }

  if (dslStyle.letterSpacing !== undefined) {
    result.letterSpacing = roundToInt
      ? Math.round(dslStyle.letterSpacing * scale)
      : dslStyle.letterSpacing * scale;
  }

  if (dslStyle.textAlign !== undefined) {
    const align = dslStyle.textAlign.toLowerCase();
    if (['left', 'center', 'right', 'justify'].includes(align)) {
      result.textAlign = align as ParsedTextStyle['textAlign'];
    }
  }

  return result;
}

/**
 * 计算缩放比例
 * @param originalDesignWidth 原始设计稿宽度
 * @param targetWidth 目标宽度，默认 750
 */
export function calculateScale(
  originalDesignWidth: number,
  targetWidth: number = 750
): number {
  return targetWidth / originalDesignWidth;
}

/**
 * 验证 DSL 结构是否完整
 * 检查必要字段是否存在
 */
export function validateDsl(dsl: unknown): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!dsl || typeof dsl !== 'object') {
    errors.push('DSL is not an object');
    return { valid: false, errors };
  }

  const obj = dsl as Record<string, unknown>;

  if (!obj.type) {
    errors.push('Missing "type" field');
  }

  if (obj.width === undefined) {
    errors.push('Missing "width" field');
  }

  if (obj.height === undefined) {
    errors.push('Missing "height" field');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * DSL 基础节点接口
 */
export interface DslNode {
  children?: unknown[];
  [key: string]: unknown;
}

/**
 * 扁平化 DSL 树，收集所有节点
 * 支持循环引用检测，遇到循环引用自动跳过
 */
export function flattenDsl<T extends DslNode>(
  node: T | null | undefined,
  result: T[] = [],
  seen = new WeakSet<object>()
): T[] {
  if (!node || typeof node !== 'object') {
    return result;
  }

  // 检测循环引用
  if (seen.has(node)) {
    return result;
  }
  seen.add(node);

  result.push(node);

  if (Array.isArray(node.children)) {
    node.children.forEach(child => {
      if (child && typeof child === 'object') {
        flattenDsl(child as T, result, seen);
      }
    });
  }

  return result;
}
