import { createContext } from 'react';
import type { RootStore } from './RootStore';

export const rootStoreContext = createContext<RootStore | null>(null);
