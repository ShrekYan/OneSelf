import { makeAutoObservable } from 'mobx';
import type {
  HistoryStackStoreType,
  HistoryStackItem,
} from '@/types/app-history';

export class HistoryStackStore implements HistoryStackStoreType {
  stack: HistoryStackItem[] = [];
  currentIndex: number = -1;

  constructor() {
    makeAutoObservable(this);
  }

  get canGoBack(): boolean {
    return this.stack.length > 1 && this.currentIndex > 0;
  }

  get current(): HistoryStackItem | null {
    if (this.currentIndex < 0 || this.currentIndex >= this.stack.length) {
      return null;
    }
    return this.stack[this.currentIndex];
  }

  push(item: HistoryStackItem): void {
    // 如果当前不是在栈尾，说明用户回退几次后又点了新页面
    // 需要砍掉当前位置之后的历史，再推送（标准浏览器行为）
    if (this.currentIndex < this.stack.length - 1) {
      this.stack = this.stack.slice(0, this.currentIndex + 1);
    }
    this.stack.push(item);
    this.currentIndex = this.stack.length - 1;
  }

  replace(item: HistoryStackItem): void {
    if (this.currentIndex >= 0 && this.currentIndex < this.stack.length) {
      this.stack[this.currentIndex] = item;
    } else {
      this.stack = [item];
      this.currentIndex = 0;
    }
  }

  pop(): HistoryStackItem | null {
    if (!this.canGoBack) {
      return null;
    }
    this.currentIndex--;
    return this.current;
  }

  setIndex(index: number): void {
    if (index >= -1 && index < this.stack.length) {
      this.currentIndex = index;
    }
  }
}
