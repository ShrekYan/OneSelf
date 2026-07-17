import axios, { AxiosRequestConfig } from 'axios';
import { throwHttpError } from './http-error.js';

export class HttpClient {
  async get<T>(
    url: string,
    config?: AxiosRequestConfig,
    context?: string,
  ): Promise<T> {
    try {
      const response = await axios.get<T>(url, config);
      return response.data;
    } catch (error) {
      throwHttpError(error, context ?? `GET ${url}`);
    }
  }

  async post<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
    context?: string,
  ): Promise<T> {
    try {
      const response = await axios.post<T>(url, data, config);
      return response.data;
    } catch (error) {
      throwHttpError(error, context ?? `POST ${url}`);
    }
  }
}
