import React from 'react';
import { CATEGORIES, SORT_OPTIONS } from '../../constant';
import type { SortType } from '../../useStore';
import styles from './index.module.scss';

/**
 * 筛选栏组件属性
 */
export interface FilterBarProps {
  /** 当前选中的分类 */
  currentCategory: string;
  /** 当前选中的排序方式 */
  currentSort: SortType;
  /** 是否显示排序菜单 */
  showSortMenu: boolean;
  /** 分类选择回调 */
  onCategorySelect: (categoryId: string) => void;
  /** 切换排序菜单显示回调 */
  onSortMenuToggle: () => void;
  /** 排序选择回调 */
  onSortSelect: (sortId: string) => void;
}

/**
 * 分类筛选和排序栏组件
 * 提供分类选择和多种排序方式选择功能
 */
const FilterBar: React.FC<FilterBarProps> = ({
  currentCategory,
  currentSort,
  showSortMenu,
  onCategorySelect,
  onSortMenuToggle,
  onSortSelect,
}) => {
  return (
    <div className={styles.filterBar}>
      <div className={styles.filterRow}>
        <div className={styles.categoryNav}>
          {CATEGORIES.map(category => (
            <div
              key={category.id}
              className={`${styles.categoryItem} ${
                currentCategory === category.id ? styles.active : ''
              }`}
              onClick={() => onCategorySelect(category.id)}
            >
              {category.name}
            </div>
          ))}
        </div>
        <div className={styles.sortDropdown}>
          <button
            className={`${styles.sortButton} ${showSortMenu ? styles.active : ''}`}
            onClick={onSortMenuToggle}
          >
            {SORT_OPTIONS.find(s => s.id === currentSort)?.name}
            <span className={styles.sortArrow}>▼</span>
          </button>
          {showSortMenu && (
            <div className={styles.sortMenu}>
              {SORT_OPTIONS.map(option => (
                <div
                  key={option.id}
                  className={`${styles.sortOption} ${
                    currentSort === option.id ? styles.active : ''
                  }`}
                  onClick={() => onSortSelect(option.id)}
                >
                  {option.name}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
