// apps/web/src/pages/ArticleList/__tests__/useStore.test.ts
import { formatPublishTime } from '../useStore';

describe('formatPublishTime', () => {
  it('should return relative time within one hour', () => {
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString();
    expect(formatPublishTime(tenMinutesAgo)).toBe('10分钟前');
  });

  it('should return relative time within one day', () => {
    const threeHoursAgo = new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString();
    expect(formatPublishTime(threeHoursAgo)).toBe('3小时前');
  });

  it('should return absolute date when relative is false', () => {
    const date = new Date(2024, 0, 15).toISOString();
    expect(formatPublishTime(date, false)).toBe('2024年1月15日');
  });
});
