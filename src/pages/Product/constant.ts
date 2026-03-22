/**
 * Product 模块常量定义
 */

// ==================== 常量配置 ====================
export const PAGE_SIZE = 10;              // 每页显示的商品数量
export const SEARCH_DEBOUNCE_TIME = 300;  // 搜索防抖时间（毫秒）

// ==================== 分类配置 ====================
export const CATEGORIES = [
  { id: "all", name: "全部" },
  { id: "electronics", name: "数码家电" },
  { id: "clothing", name: "服饰鞋包" },
  { id: "food", name: "食品生鲜" },
  { id: "beauty", name: "美妆护肤" },
  { id: "home", name: "家居生活" },
  { id: "sports", name: "运动户外" }
];

export interface CategoryItem {
  id: string;
  name: string;
}

// ==================== 排序配置 ====================
export const SORT_OPTIONS = [
  { id: "default", name: "综合" },
  { id: "sales", name: "销量" },
  { id: "priceAsc", name: "价格升序" },
  { id: "priceDesc", name: "价格降序" }
];

export interface SortOptionItem {
  id: string;
  name: string;
}

// ==================== 导航配置 ====================
export const NAVIGATION_ITEMS = [
  { id: "home", name: "首页", icon: "🏠" },
  { id: "category", name: "分类", icon: "📂" },
  { id: "cart", name: "购物车", icon: "🛒" },
  { id: "profile", name: "我的", icon: "👤" }
];

export interface NavigationItem {
  id: string;
  name: string;
  icon: string;
}

// ==================== 类型定义 ====================
export type { ProductItem } from '@/types/product';

/**
 * 模拟商品数据
 * 用于开发环境下的商品展示
 */
export const MockProductData = [
  {
    id: "1",
    title: "iPhone 15 Pro Max 256GB 原色钛金属",
    description: "A17 Pro 芯片，钛金属设计，4800 万像素主摄",
    price: 9999,
    originalPrice: 11999,
    sales: 15800,
    stock: 999,
    category: "electronics",
    tags: ["热销", "新品", "包邮"],
    image: "https://picsum.photos/300/300?random=11",
    rating: 4.9,
    reviews: 2340,
    discount: 17
  },
  {
    id: "2",
    title: "MacBook Pro 14英寸 M3 Pro芯片",
    description: "18GB内存 512GB固态硬盘 深空灰色",
    price: 16999,
    originalPrice: 18999,
    sales: 5200,
    stock: 500,
    category: "electronics",
    tags: ["办公", "高性能"],
    image: "https://picsum.photos/300/300?random=12",
    rating: 4.8,
    reviews: 890,
    discount: 11
  },
  {
    id: "3",
    title: "耐克 Nike Air Max 270 运动鞋",
    description: "休闲跑步鞋 透气缓震 潮流百搭",
    price: 899,
    originalPrice: 1299,
    sales: 32000,
    stock: 2000,
    category: "clothing",
    tags: ["爆款", "免运费"],
    image: "https://picsum.photos/300/300?random=13",
    rating: 4.7,
    reviews: 5600,
    discount: 31
  },
  {
    id: "4",
    title: "SK-II 神仙水 230ml 精华液",
    description: "PITERA™ 精华 改善肌肤问题 提升肌肤质地",
    price: 1599,
    originalPrice: 1890,
    sales: 8900,
    stock: 800,
    category: "beauty",
    tags: ["进口", "正品正品保障"],
    image: "https://picsum.photos/300/300?random=14",
    rating: 4.9,
    reviews: 3200,
    discount: 15
  },
  {
    id: "5",
    title: "雅诗兰黛小棕瓶精华 30ml",
    description: "抗皱修护 保湿滋润 紧致肌肤",
    price: 980,
    originalPrice: 1180,
    sales: 12500,
    stock: 1500,
    category: "beauty",
    tags: ["热销", "赠品"],
    image: "https://picsum.photos/300/300?random=15",
    rating: 4.8,
    reviews: 4500,
    discount: 17
  },
  {
    id: "6",
    title: "三得利白桃乌龙茶 500ml*12瓶",
    description: "无糖低卡 0脂0卡 桃香清新",
    price: 59,
    originalPrice: 79.9,
    sales: 68000,
    stock: 5000,
    category: "food",
    tags: ["爆款", "超值"],
    image: "https://picsum.photos/300/300?random=16",
    rating: 4.6,
    reviews: 8900,
    discount: 25
  },
  {
    id: "7",
    title: "小米空气净化器4 Pro",
    description: "除甲醛 除菌除异味 智能控制",
    price: 1599,
    originalPrice: 1899,
    sales: 4500,
    stock: 600,
    category: "home",
    tags: ["智能家居", "健康"],
    image: "https://picsum.photos/300/300?random=17",
    rating: 4.7,
    reviews: 2100,
    discount: 16
  },
  {
    id: "8",
    title: "迪卡侬运动背包 30L",
    description: "登山徒步 旅行通勤 防水耐磨",
    price: 199,
    originalPrice: 299,
    sales: 28000,
    stock: 3000,
    category: "sports",
    tags: ["户外", "大容量"],
    image: "https://picsum.photos/300/405?random=18",
    rating: 4.5,
    reviews: 6800,
    discount: 33
  },
  {
    id: "9",
    title: "索尼 WH-1000XM5 降噪耳机",
    description: "无线蓝牙 头戴式 主动降噪",
    price: 2499,
    originalPrice: 2899,
    sales: 3800,
    stock: 400,
    category: "electronics",
    tags: ["数码", "降噪"],
    image: "https://picsum.photos/300/300?random=19",
    rating: 4.9,
    reviews: 1500,
    discount: 14
  },
  {
    id: "10",
    title: "优衣库 UNIQLO 羊绒针织衫",
    description: "100%羊毛 保暖舒适 经典款",
    price: 399,
    originalPrice: 599,
    sales: 15600,
    stock: 1800,
    category: "clothing",
    tags: ["保暖", "舒适"],
    image: "https://picsum.photos/300/300?random=20",
    rating: 4.6,
    reviews: 4200,
    discount: 33
  },
  {
    id: "11",
    title: "星巴克深度烘焙咖啡豆 227g",
    description: "进口咖啡豆 浓郁香醇 意式拼配",
    price: 128,
    originalPrice: 158,
    sales: 9800,
    stock: 2500,
    category: "food",
    tags: ["进口", "咖啡"],
    image: "https://picsum.photos/300/300?random=21",
    rating: 4.7,
    reviews: 3200,
    discount: 19
  },
  {
    id: "12",
    title: "宜家 MALM 马尔姆床架",
    description: "实木床架 北欧简约 1.5米双人床",
    price: 1299,
    originalPrice: 1599,
    sales: 3200,
    stock: 200,
    category: "home",
    tags: ["家具", "简约"],
    image: "https://picsum.photos/300/300?random=22",
    rating: 4.5,
    reviews: 890,
    discount: 19
  }
];

/**
 * 向后兼容：导出 ProductConst 对象
 * @deprecated 建议使用独立的常量导入
 */
export const ProductConst = {
  PAGE_SIZE,
  SEARCH_DEBOUNCE_TIME,
  CATEGORIES,
  SORT_OPTIONS,
  NAVIGATION_ITEMS
};
