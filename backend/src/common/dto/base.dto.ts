import { IsInt, Min } from 'class-validator';

export class PaginationDto {
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsInt()
  @Min(1)
  limit?: number = 10;
}

export class ResponseDto<T> {
  code: number;
  message: string;
  data: T;
}

export class PaginatedResponseDto<T> {
  code: number;
  message: string;
  data: {
    items: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
