import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEnum, IsNumber, Min } from 'class-validator';

import { GeoData, postStatusEnum } from '../schemas/posts.schema';

export class CreatePostDTO {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true, example: 'post title' })
  title: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true, example: 'post body', minLength: 10 })
  body: string;

  @ApiProperty({
    required: true,
    example: { latitude: '19.076090', longitude: '19.076090' },
    type: GeoData,
  })
  geoLocation: GeoData;
}

export class UpdatePostDTO {
  @IsString()
  @ApiProperty({ required: false, example: 'post title' })
  title?: string;

  @IsString()
  @ApiProperty({ required: false, example: 'post body', minLength: 10 })
  body?: string;

  @ApiProperty({
    required: true,
    example: { latitude: '19.076090', longitude: '19.076090' },
    type: GeoData,
  })
  geoLocation?: GeoData;

  @IsEnum(postStatusEnum)
  @ApiProperty({ required: false, example: 'active', enum: postStatusEnum })
  status?: postStatusEnum;
}

export class ListPostsDTO {
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @ApiProperty({ required: true, description: 'page', example: 1 })
  pageNo: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @ApiProperty({ required: true, description: 'limit', example: 10 })
  limit: number;

  @IsNotEmpty()
  @ApiProperty({ required: true, description: 'filter', example: {} })
  filter: Record<string, unknown>;

  @IsNotEmpty()
  @ApiProperty({
    required: true,
    example: { _id: -1 },
  })
  sort: Record<string, unknown>;
}
