/**
 * Mock 数据统一导出
 */

export { MOCK_AUTHORS, type MockAuthor } from './mock-authors';
export { USER_LIKE_MAP, DEFAULT_USER_ID } from './mock-state';
export {
  generateMockArticles,
  generateMockContent,
} from './mock-data-generator';

// 预生成文章数据（保持和原来一样，在模块加载时生成）
import { ArticleListItemDto } from '../dto';
import { generateMockArticles } from './mock-data-generator';
export const MOCK_ARTICLES: ArticleListItemDto[] = generateMockArticles();
