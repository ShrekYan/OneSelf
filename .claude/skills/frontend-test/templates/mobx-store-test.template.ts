import { StoreName } from '../store-name';

describe('StoreName', () => {
  let store: StoreName;

  beforeEach(() => {
    store = new StoreName();
  });

  it('should have correct initial state', () => {
    expect(store.items).toEqual([]);
  });

  it('should update state when action called', () => {
    store.addItem({ id: '1', name: 'item' });

    expect(store.items.length).toBe(1);
  });
});
