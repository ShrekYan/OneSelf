# 02 - 组件开发规范

## 基础规范

- 组件使用 TypeScript 编写，带有完整类型定义
- 使用 CSS Modules (`.module.scss`) 进行样式管理
- 使用 antd-mobile 组件库优先，避免重复造轮子
- 使用 classnames 合并类名
- 使用 react-use 提供的 Hook 简化开发（如 useEffectOnce）
- 状态管理使用 `useLocalObservable` + `useObserver` 的组合方式

## 组件拆分核心原则

> **如果页面比较长，模块比较多，都应该拆分为子组件**
> - 遵循单一职责原则，每个组件只负责一个功能模块
> - 按功能区域拆分：搜索栏、筛选栏、列表、分页等都应独立成组件
> - 组件存放在对应页面的 `components/` 目录下
> - 每个组件独立维护自己的 TypeScript 类型和样式
> - 主页面只负责组合子组件和页面级状态管理

## 子组件开发规范

- 子组件放在页面的 `components/` 子目录下，每个组件有独立的文件夹
- 子组件可以通过 import 页面级的 `useStore` 访问状态
- 使用 `useObserver` 进行响应式渲染
- 类型定义使用类型导入（`import type`）
- 使用常量定义业务逻辑中的枚举值
- 使用 `React.memo` 优化性能

## 子组件示例：ProductCard

```tsx
import React from "react";
import { LazyImage } from "../LazyImage";
import type { ProductItem } from "@/types/product";
import styles from "./index.module.scss";
import { formatPrice, formatSales, truncateText } from "../../handle";

/**
 * 商品卡片组件属性接口
 */
interface ProductCardProps {
  product: ProductItem;                                  // 商品信息
  onCardClick: (product: ProductItem) => void;             // 卡片点击回调
  onCollect: (e: React.MouseEvent, product: ProductItem) => void;      // 收藏回调
  onAddToCart: (e: React.MouseEvent, product: ProductItem) => void;    // 加入购物车回调
}

/**
 * 商品卡片组件
 * 展示商品图片、标题、描述、标签、价格、销量等信息
 * 包含收藏和加入购物车功能按钮
 */
export const ProductCard = React.memo(({ product, onCardClick, onCollect, onAddToCart }: ProductCardProps) => {
  return (
    <div
      className={styles.card}
      onClick={() => onCardClick(product)}
    >
      {/* 商品图片容器 */}
      <div className={styles.imageContainer}>
        <LazyImage src={product.image} alt={product.title} className={styles.imageWrapper} />
        {/* 折扣标签 */}
        {product.discount && product.discount > 0 && (
          <div className={styles.discountBadge}>{product.discount}折</div>
        )}
      </div>

      {/* 商品信息内容 */}
      <div className={styles.content}>
        {/* 商品标题 */}
        <h3 className={styles.title}>{product.title}</h3>
        {/* 商品描述 */}
        <p className={styles.description}>{truncateText(product.description, 40)}</p>

        {/* 商品标签区域 */}
        <div className={styles.meta}>
          <div className={styles.tags}>
            {product.tags.slice(0, 2).map((tag, index) => (
              // tag: 商品标签文本，index: 标签的索引
              <span key={index} className={styles.tag}>
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* 价格信息区域 */}
        <div className={styles.priceContainer}>
          <span className={styles.priceSymbol}>¥</span>
          <span className={styles.price}>{formatPrice(product.price)}</span>
          {/* 原价显示（如果有折扣） */}
          {(product.originalPrice || 0) > product.price && (
            <span className={styles.originalPrice}>¥{formatPrice(product.originalPrice || 0)}</span>
          )}
        </div>

        {/* 底部操作栏 */}
        <div className={styles.footer}>
          {/* 销量信息 */}
          <span className={styles.salesInfo}>已售 {formatSales(product.sales)}</span>
          {/* 操作按钮 */}
          <div className={styles.actionButtons}>
            <button
              className={styles.actionButton}
              onClick={(e) => onCollect(e, product)}
              title="收藏"
            >
              ❤️
            </button>
            <button
              className={`${styles.actionButton} ${styles.cartButton}`}
              onClick={(e) => onAddToCart(e, product)}
              title="加入购物车"
            >
              🛒
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});
```

## 子组件访问 Store 示例

```tsx
import React from "react";
import { useObserver } from "mobx-react";
import useStore from "./../../useStore.ts";

const BottomDesc: React.FC = () => {
    const store = useStore();
    return useObserver(() => {
        return (
            <div>
                页面子组件使用store测试：{store?.currentCategory}
            </div>
        );
    });
};

export default BottomDesc;
```
