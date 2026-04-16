import { ApiProperty } from '@nestjs/swagger';

export class IntrospectResponseDto {
  @ApiProperty({ description: 'Whether the token is valid' })
  valid: boolean;

  @ApiProperty({ description: 'User ID if valid' })
  userId?: string;

  @ApiProperty({ description: 'Expiration time in seconds' })
  expiresIn?: number;

  @ApiProperty({ description: 'Error code if invalid' })
  error?: 'INVALID_TOKEN' | 'EXPIRED' | 'MISSING';
}
