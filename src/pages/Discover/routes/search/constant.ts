/**
 * Search page constant data
 * @description Trending search recommendations data
 */

export interface HotSearchItem {
  id: string;
  keyword: string;
  score?: number;
}

// Trending search recommendations data
export const HOT_SEARCHES: HotSearchItem[] = [
  { id: '1', keyword: 'React Best Practices', score: 999 },
  { id: '2', keyword: 'TypeScript Advanced', score: 888 },
  { id: '3', keyword: 'MobX State Management', score: 777 },
  { id: '4', keyword: 'CSS Grid Layout', score: 666 },
  { id: '5', keyword: 'Responsive Design', score: 555 },
  { id: '6', keyword: 'Performance Optimization', score: 444 },
  { id: '7', keyword: 'Frontend Engineering', score: 333 },
  { id: '8', keyword: 'Design Patterns', score: 222 },
  { id: '9', keyword: 'Micro Frontends', score: 111 },
  { id: '10', keyword: 'Webpack Configuration', score: 99 },
];
