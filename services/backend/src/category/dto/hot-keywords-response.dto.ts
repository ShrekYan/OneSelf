import { ApiProperty } from '@nestjs/swagger';
import { HotKeywordDto } from './hot-keyword.dto';

export class HotKeywordsResponseDto {
  @ApiProperty({ description: '热门搜索关键词列表', type: [HotKeywordDto] })
  keywords: HotKeywordDto[];
}
