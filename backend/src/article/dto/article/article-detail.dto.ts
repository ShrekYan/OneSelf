import { ApiProperty } from '@nestjs/swagger';
import { ArticleListItemDto } from './article-list-item.dto';

export class ContentBlock {
  @ApiProperty({
    description: '内容块类型',
    enum: ['heading', 'paragraph', 'quote', 'image', 'list'],
  })
  type: 'heading' | 'paragraph' | 'quote' | 'image' | 'list';

  @ApiProperty({ description: '标题级别（仅 heading 类型)', required: false })
  level?: number;

  @ApiProperty({
    description: '文本内容（heading/paragraph/quote)',
    required: false,
  })
  text?: string;

  @ApiProperty({ description: '图片 URL（仅 image 类型)', required: false })
  imageUrl?: string;

  @ApiProperty({
    description: '列表项（仅 list 类型)',
    type: [String],
    required: false,
  })
  items?: string[];
}

export class AuthorInfo {
  @ApiProperty({ description: '作者名称' })
  name: string;

  @ApiProperty({ description: '作者头像 URL' })
  avatar: string;
}

export class ArticleDetailDto extends ArticleListItemDto {
  @ApiProperty({
    description: '作者信息（嵌套对象，匹配前端结构）',
    type: () => AuthorInfo,
  })
  author: AuthorInfo;

  @ApiProperty({ description: '发布时间（字段名匹配前端: publishAt）' })
  publishAt: string;

  @ApiProperty({
    description: '文章正文内容（结构化区块数组，匹配前端渲染方式）',
    type: ContentBlock,
    isArray: true,
  })
  content: ContentBlock[];

  @ApiProperty({ description: 'HTML 格式正文（留作扩展）', required: false })
  contentHtml?: string;

  @ApiProperty({
    description: '原始 Markdown 内容（留作扩展）',
    required: false,
  })
  markdownContent?: string;

  @ApiProperty({ description: '当前用户是否已点赞', required: false })
  isLiked?: boolean;

  @ApiProperty({ description: '当前用户是否已收藏', required: false })
  isCollected?: boolean;

  @ApiProperty({ description: '最后更新时间', required: false })
  updatedAt?: string;

  @ApiProperty({ type: [String], description: 'SEO 关键词', required: false })
  seoKeywords?: string[];

  @ApiProperty({ description: 'SEO 描述', required: false })
  seoDescription?: string;
}
