// store/__tests__/cart.store.test.ts
import { makeAutoObservable } from 'mobx';

interface ProductItem {
  id: string;
  price: number;
}

class CartStore {
  items: ProductItem[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  get totalPrice(): number {
    return this.items.reduce((sum, item) => sum + item.price, 0);
  }

  addItem(item: ProductItem): void {
    this.items.push(item);
  }
}

describe('CartStore', () => {
  let store: CartStore;

  beforeEach(() => {
    store = new CartStore();
  });

  it('should have empty initial state', () => {
    expect(store.items).toEqual([]);
    expect(store.totalPrice).toBe(0);
  });

  it('should add item correctly', () => {
    store.addItem({ id: '1', price: 100 });
    expect(store.items.length).toBe(1);
    expect(store.totalPrice).toBe(100);
  });
});
