import type { ProductItem } from '@/types/product';
import { api } from '@/api';

export interface ProductListParams {
  page: number;
  pageSize: number;
  categoryId: string;
  sortBy: 'default' | 'sales' | 'priceAsc' | 'priceDesc';
  keyword?: string;
}

export interface ProductListResponse {
  list: ProductItem[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export const productApi = {
  getProductList: async (
    params: ProductListParams,
  ): Promise<ProductListResponse> => {
    return await api.get('/api/v1/product/list', { params });
  },
};
