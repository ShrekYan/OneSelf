/**
 * 历史栈条目结构
 */
export interface HistoryStackItem {
  /** 路径 */
  pathname: string;
  /** 查询参数 */
  search: string;
  /** React Router 生成的唯一 key */
  key: string;
}

/**
 * 历史栈 Store 接口
 */
export interface HistoryStackStoreType {
  /** 应用层维护的历史栈 */
  stack: HistoryStackItem[];
  /** 当前位置索引 */
  currentIndex: number;
  /** 是否可以返回 */
  readonly canGoBack: boolean;
  /** 当前栈顶元素 */
  readonly current: HistoryStackItem | null;
  /** 推送新页面 */
  push: (item: HistoryStackItem) => void;
  /** 替换当前页面 */
  replace: (item: HistoryStackItem) => void;
  /** 回退一页 */
  pop: () => HistoryStackItem | null;
  /** 设置索引（popstate 同步用） */
  setIndex: (index: number) => void;
}
