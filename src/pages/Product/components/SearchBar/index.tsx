import React from 'react';
import styles from './index.module.scss';

/**
 * 搜索栏组件属性
 */
export interface SearchBarProps {
  /** 当前搜索关键词 */
  keyword: string;
  /** 搜索输入框引用 */
  inputRef: React.RefObject<HTMLInputElement | null>;
  /** 搜索关键词变化回调 */
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  /** 清空搜索回调 */
  onClear: () => void;
}

/**
 * 顶部搜索栏组件
 * 提供商品搜索功能，支持清空操作
 */
const SearchBar: React.FC<SearchBarProps> = ({
  keyword,
  inputRef,
  onChange,
  onClear,
}) => {
  return (
    <div className={styles.searchBar}>
      <div className={styles.searchInputContainer}>
        <span className={styles.searchIcon}>🔍</span>
        <input
          ref={inputRef}
          type="text"
          className={styles.searchInput}
          placeholder="搜索商品..."
          onChange={onChange}
          value={keyword}
        />
        {keyword && (
          <div className={styles.clearButton} onClick={onClear}>
            ✕
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
