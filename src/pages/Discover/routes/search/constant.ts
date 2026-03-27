/**
 * 搜索页面常量数据
 * @description 热门搜索推荐数据
 */

export interface HotSearchItem {
  id: string;
  keyword: string;
  score?: number;
}

// 热门搜索推荐数据
export const HOT_SEARCHES: HotSearchItem[] = [
  { id: '1', keyword: 'React 最佳实践', score: 999 },
  { id: '2', keyword: 'TypeScript 进阶', score: 888 },
  { id: '3', keyword: 'MobX 状态管理', score: 777 },
  { id: '4', keyword: 'CSS Grid 布局', score: 666 },
  { id: '5', keyword: '响应式设计', score: 555 },
  { id: '6', keyword: '性能优化', score: 444 },
  { id: '7', keyword: '前端工程化', score: 333 },
  { id: '8', keyword: '设计模式', score: 222 },
  { id: '9', keyword: '微前端', score: 111 },
  { id: '10', keyword: 'Webpack 配置', score: 99 },
];
