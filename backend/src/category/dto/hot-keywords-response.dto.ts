import { ApiProperty } from '@nestjs/swagger';

export class HotKeywordsResponseDto {
  @ApiProperty({ description: '热门搜索关键词列表' })
  keywords: string[];
}
