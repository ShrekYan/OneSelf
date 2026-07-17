import axios, { AxiosError } from 'axios';

export class HttpError extends Error {
  public readonly status?: number;

  constructor(
    message: string,
    public readonly context: string,
    status?: number,
  ) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
  }
}

export function throwHttpError(error: unknown, context: string): never {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;
    const status = axiosError.response?.status;
    const message = axiosError.message;
    throw new HttpError(message, context, status);
  }

  if (error instanceof Error) {
    throw new HttpError(error.message, context);
  }

  throw new HttpError('发生未知错误', context);
}
