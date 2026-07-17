import { api } from '@/api';

export interface ApiParams {
  page: number;
  pageSize: number;
}

export interface ApiListItem {
  id: string;
}

export interface ApiResponse {
  list: ApiListItem[];
  total: number;
  page: number;
  pageSize: number;
}

export const moduleApi = {
  getList: async (params: ApiParams): Promise<ApiResponse> => {
    return await api.get('/api/v1/module/list', { params });
  },
};