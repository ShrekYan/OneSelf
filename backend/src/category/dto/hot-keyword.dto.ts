import { ApiProperty } from '@nestjs/swagger';

export class HotKeywordDto {
  @ApiProperty({ description: '分类ID' })
  id: string;

  @ApiProperty({ description: '分类名称' })
  name: string;
}
