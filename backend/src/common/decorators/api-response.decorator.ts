import { applyDecorators } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';

export interface ApiResponseOptions {
  description?: string;
  type?: any;
  isArray?: boolean;
}

export const ApiResponse = (options: ApiResponseOptions) => {
  const { description = 'Success', type, isArray } = options;

  return applyDecorators(
    ApiOperation({ summary: description }),
    ApiOkResponse({
      description,
      schema: isArray
        ? {
            properties: {
              code: { type: 'number', example: 200 },
              message: { type: 'string', example: 'Success' },
              data: { type: 'array', items: { $ref: `#/components/schemas/${type.name}` } },
            },
          }
        : type
          ? {
              properties: {
                code: { type: 'number', example: 200 },
                message: { type: 'string', example: 'Success' },
                data: { $ref: `#/components/schemas/${type.name}` },
              },
            }
          : {
              properties: {
                code: { type: 'number', example: 200 },
                message: { type: 'string', example: 'Success' },
                data: { type: 'object' },
              },
            },
    }),
  );
};
