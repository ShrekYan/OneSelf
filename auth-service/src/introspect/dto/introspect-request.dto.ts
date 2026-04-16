import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class IntrospectRequestDto {
  @ApiProperty({ description: 'Access token to validate' })
  @IsString()
  accessToken: string;
}
