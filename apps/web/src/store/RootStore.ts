import { makeAutoObservable } from 'mobx';
import type { MobxStoreType as AppStoreType } from './AppStore';

export class RootStore {
  app: AppStoreType;

  constructor() {
    makeAutoObservable(this);
    this.app = null as unknown as AppStoreType;
  }

  init(appStore: AppStoreType): void {
    this.app = appStore;
  }
}
